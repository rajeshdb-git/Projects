from datetime import timedelta
from decimal import Decimal

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.db.models import Count, DecimalField, F, Sum, Value
from django.db.models.functions import Coalesce, TruncDate
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import CategoryForm, CouponForm, OrderStatusForm, ProductForm, ReviewStatusForm
from .models import Category, Coupon, Customer, Order, Product, Review


def staff_required(view):
    return login_required(login_url='admin-login')(user_passes_test(lambda user: user.is_staff, login_url='admin-login')(view))


def admin_login(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('admin-dashboard')
    if request.method == 'POST':
        user = authenticate(request, username=request.POST.get('username'), password=request.POST.get('password'))
        if user and user.is_staff:
            login(request, user)
            return redirect('admin-dashboard')
        messages.error(request, 'Invalid staff username or password.')
    return render(request, 'admin/login.html')


def admin_logout(request):
    auth_logout(request)
    return redirect('admin-login')


@staff_required
def dashboard(request):
    orders = Order.objects.select_related('customer').order_by('-created_at')
    today = timezone.localdate()
    sales_by_day = dict(
        orders.filter(payment_status='PAID', created_at__date__gte=today - timedelta(days=6))
        .annotate(day=TruncDate('created_at'))
        .values('day')
        .annotate(total=Sum('total_amount'))
        .values_list('day', 'total')
    )
    context = {
        'total_products': Product.objects.count(),
        'total_orders': orders.count(),
        'total_customers': Customer.objects.count(),
        'total_revenue': orders.filter(payment_status='PAID').aggregate(total=Sum('total_amount'))['total'] or Decimal('0'),
        'pending_orders': orders.filter(order_status='PENDING').count(),
        'low_stock': Product.objects.filter(stock__lte=5).count(),
        'recent_orders': orders[:8],
        'low_stock_products': Product.objects.filter(stock__lte=5).select_related('category')[:6],
        'sales_overview': [
            {'day': today - timedelta(days=offset), 'total': sales_by_day.get(today - timedelta(days=offset), 0)}
            for offset in range(6, -1, -1)
        ],
    }
    return render(request, 'admin/dashboard.html', context)


@staff_required
def products(request):
    queryset = Product.objects.select_related('category').order_by('-created_at')
    query = request.GET.get('q', '').strip()
    category = request.GET.get('category', '')
    stock = request.GET.get('stock', '')
    if query:
        queryset = queryset.filter(name__icontains=query)
    if category:
        queryset = queryset.filter(category_id=category)
    if stock == 'low':
        queryset = queryset.filter(stock__lte=5)
    elif stock == 'out':
        queryset = queryset.filter(stock=0)
    paginator = Paginator(queryset, 12)
    page = paginator.get_page(request.GET.get('page'))
    return render(request, 'admin/products.html', {'page': page, 'categories': Category.objects.filter(is_active=True), 'query': query})


@staff_required
def product_create(request):
    form = ProductForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        form.save()
        messages.success(request, 'Product added successfully.')
        return redirect('admin-products')
    return render(request, 'admin/product_form.html', {'form': form, 'title': 'Add Product'})


@staff_required
def product_edit(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    form = ProductForm(request.POST or None, request.FILES or None, instance=product)
    if form.is_valid():
        form.save()
        messages.success(request, 'Product updated successfully.')
        return redirect('admin-products')
    return render(request, 'admin/product_form.html', {'form': form, 'title': 'Edit Product', 'product': product})


@staff_required
def product_delete(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        product.delete()
        messages.success(request, 'Product deleted successfully.')
        return redirect('admin-products')
    return render(request, 'admin/confirm_delete.html', {'object': product, 'type': 'product'})


@staff_required
def categories(request):
    edit_category = get_object_or_404(Category, pk=request.GET['edit']) if request.GET.get('edit') else None
    form = CategoryForm(request.POST or None, instance=edit_category)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Category saved successfully.')
        return redirect('admin-categories')
    rows = Category.objects.annotate(product_count=Count('products')).order_by('name')
    return render(request, 'admin/categories.html', {'rows': rows, 'form': form, 'edit_category': edit_category})


@staff_required
def category_delete(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    if request.method == 'POST':
        category.delete()
        messages.success(request, 'Category deleted successfully.')
        return redirect('admin-categories')
    return render(request, 'admin/confirm_delete.html', {'object': category, 'type': 'category'})


@staff_required
def orders(request):
    queryset = Order.objects.select_related('customer').order_by('-created_at')
    query = request.GET.get('q', '').strip()
    status = request.GET.get('status', '')
    if query:
        queryset = queryset.filter(customer__name__icontains=query) | queryset.filter(pk__icontains=query)
    if status:
        queryset = queryset.filter(order_status=status)
    page = Paginator(queryset, 15).get_page(request.GET.get('page'))
    return render(request, 'admin/orders.html', {'page': page, 'query': query, 'statuses': Order.ORDER_STATUS_CHOICES})


@staff_required
def order_detail(request, order_id):
    order = get_object_or_404(Order.objects.select_related('customer').prefetch_related('items__product'), pk=order_id)
    form = OrderStatusForm(request.POST or None, instance=order)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Order status updated successfully.')
        return redirect('admin-order-detail', order_id=order.id)
    return render(request, 'admin/order_detail.html', {'order': order, 'form': form})


@staff_required
def customers(request):
    query = request.GET.get('q', '').strip()
    queryset = Customer.objects.annotate(order_count=Count('orders')).order_by('-created_at')
    if query:
        queryset = queryset.filter(name__icontains=query) | queryset.filter(email__icontains=query)
    page = Paginator(queryset, 15).get_page(request.GET.get('page'))
    return render(request, 'admin/customers.html', {'page': page, 'query': query})


@staff_required
def coupons(request):
    edit_coupon = get_object_or_404(Coupon, pk=request.GET['edit']) if request.GET.get('edit') else None
    form = CouponForm(request.POST or None, instance=edit_coupon)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Coupon saved successfully.')
        return redirect('admin-coupons')
    return render(request, 'admin/coupons.html', {'rows': Coupon.objects.order_by('-id'), 'form': form, 'edit_coupon': edit_coupon})


@staff_required
def coupon_delete(request, coupon_id):
    coupon = get_object_or_404(Coupon, pk=coupon_id)
    if request.method == 'POST':
        coupon.delete()
        messages.success(request, 'Coupon deleted successfully.')
        return redirect('admin-coupons')
    return render(request, 'admin/confirm_delete.html', {'object': coupon, 'type': 'coupon'})


@staff_required
def reviews(request):
    rows = Review.objects.select_related('customer', 'product').order_by('-created_at')
    return render(request, 'admin/reviews.html', {'rows': rows})


@staff_required
def review_status(request, review_id):
    review = get_object_or_404(Review, pk=review_id)
    form = ReviewStatusForm(request.POST or None, instance=review)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Review status updated successfully.')
    return redirect('admin-reviews')


@staff_required
def reports(request):
    paid_orders = Order.objects.filter(payment_status='PAID')
    best_sellers = Product.objects.annotate(
        quantity_sold=Coalesce(Sum('order_items__quantity'), Value(0)),
        revenue=Coalesce(
            Sum(F('order_items__price') * F('order_items__quantity')),
            Value(Decimal('0'), output_field=DecimalField(max_digits=10, decimal_places=2)),
        ),
    ).order_by('-quantity_sold')[:10]
    return render(request, 'admin/reports.html', {
        'total_sales': paid_orders.aggregate(total=Sum('total_amount'))['total'] or 0,
        'total_orders': Order.objects.count(),
        'total_customers': Customer.objects.count(),
        'best_sellers': best_sellers,
        'low_stock_products': Product.objects.filter(stock__lte=5),
    })


@staff_required
def settings_page(request):
    return render(request, 'admin/settings.html')
