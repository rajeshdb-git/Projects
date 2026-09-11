import hmac
import json
import secrets
from decimal import Decimal

from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone

from .models import Address, Customer, Order, OrderItem, Product


def home(request):
    return render(request, 'store/home.html', {
        'customer_name': request.session.get('customer_name'),
        'customer_phone': request.session.get('customer_phone'),
    })


def product_detail(request, product_id):
    return render(request, 'store/product_detail.html', {'product_id': product_id})


def product_data(request):
    products = []
    for product in Product.objects.filter(is_active=True).select_related('category'):
        products.append({
            'id': product.id,
            'name': product.name,
            'category': product.category.name,
            'price': float(product.price),
            'originalPrice': float(product.original_price),
            'discount': product.discount,
            'color': product.color,
            'fabric': product.fabric,
            'occasion': product.occasion,
            'rating': float(product.rating),
            'reviews': product.reviews_count,
            'stock': product.stock,
            'description': product.description,
            'image': product.image_source,
        })
    return JsonResponse(products, safe=False)


def account_page(request, page_title, page_text):
    if page_title == 'Bag':
        customer = Customer.objects.filter(id=request.session.get('customer_id')).first()
        addresses = []
        if customer:
            addresses = list(customer.addresses.order_by('-is_default', '-created_at'))
            if not addresses and customer.address:
                addresses = [Address.objects.create(
                    customer=customer,
                    address=customer.address,
                    city=customer.city,
                    state=customer.state,
                    postal_code=customer.postal_code,
                    is_default=True,
                )]

        if request.method == 'POST' and request.POST.get('action') == 'select_address':
            address = Address.objects.filter(id=request.POST.get('address_id'), customer=customer).first()
            if address:
                request.session['selected_address_id'] = address.id
            return redirect('bag')

        if request.method == 'POST' and request.POST.get('action') == 'place_order':
            selected_address = Address.objects.filter(
                id=request.session.get('selected_address_id'), customer=customer
            ).first() if customer else None
            if not selected_address and addresses:
                selected_address = addresses[0]
            if not customer or not selected_address:
                return render(request, 'store/account_page.html', {
                    'page_title': page_title,
                    'page_text': page_text,
                    'customer': customer,
                    'addresses': addresses,
                    'address_error': 'Add a delivery address before placing your order.',
                }, status=400)
            try:
                cart_ids = json.loads(request.POST.get('cart_products', '[]'))
            except json.JSONDecodeError:
                cart_ids = []
            products = Product.objects.filter(id__in=[item.get('id') for item in cart_ids if isinstance(item, dict)])
            product_map = {product.id: product for product in products}
            subtotal = Decimal('0')
            order_items = []
            for item in cart_ids:
                product = product_map.get(item.get('id')) if isinstance(item, dict) else None
                quantity = int(item.get('quantity', 1)) if isinstance(item, dict) else 1
                if product and quantity > 0:
                    subtotal += product.price * quantity
                    order_items.append((product, quantity))
            shipping_fee = Decimal('23') if order_items else Decimal('0')
            order = Order.objects.create(
                customer=customer,
                shipping_address=selected_address.address,
                shipping_city=selected_address.city,
                shipping_state=selected_address.state,
                shipping_postal_code=selected_address.postal_code,
                shipping_fee=shipping_fee,
                total_amount=subtotal + shipping_fee,
            )
            for product, quantity in order_items:
                OrderItem.objects.create(order=order, product=product, quantity=quantity, price=product.price)
            return render(request, 'store/account_page.html', {
                'page_title': page_title,
                'page_text': page_text,
                'customer': customer,
                    'addresses': addresses,
                'order_placed': True,
                'created_order': order,
            })

        if request.method == 'POST' and request.POST.get('action') == 'save_address':
            if not customer:
                return redirect('login')

            street_address = request.POST.get('address', '').strip()
            if not street_address:
                street_address = ', '.join(filter(None, [
                    request.POST.get('house_number', '').strip(),
                    request.POST.get('locality', '').strip(),
                    request.POST.get('locality_town', '').strip(),
                ]))
            address_data = {
                'address': street_address,
                'city': request.POST.get('city', '').strip(),
                'state': request.POST.get('state', '').strip(),
                'postal_code': request.POST.get('postal_code', '').strip(),
            }
            if not all(address_data.values()):
                return render(request, 'store/account_page.html', {
                    'page_title': page_title,
                    'page_text': page_text,
                    'customer': customer,
                    'address_error': 'Please complete every address field.',
                }, status=400)

            customer_name = request.POST.get('customer_name', '').strip()
            if customer_name:
                customer.name = customer_name
            customer.address = address_data['address']
            customer.city = address_data['city']
            customer.state = address_data['state']
            customer.postal_code = address_data['postal_code']
            customer.save(update_fields=('name', 'address', 'city', 'state', 'postal_code'))
            new_address = Address.objects.create(customer=customer, **address_data, is_default=not addresses)
            request.session['selected_address_id'] = new_address.id
            return redirect('bag')

        return render(request, 'store/account_page.html', {
            'page_title': page_title,
            'page_text': page_text,
            'customer': customer,
            'addresses': addresses,
        })

    if page_title == 'Login / Signup':
        actions = request.POST.getlist('action')

        if request.method == 'POST' and 'send_otp' in actions:
            customer_name = request.POST.get('customer_name', '').strip()
            mobile_number = request.POST.get('mobile_number', '').strip()

            if not customer_name or not mobile_number.isdigit() or len(mobile_number) != 10:
                return render(request, 'store/account_page.html', {
                    'page_title': page_title,
                    'page_text': page_text,
                    'login_error': 'Enter your name and a valid 10-digit mobile number.',
                }, status=400)

            request.session['pending_customer_name'] = customer_name
            request.session['pending_mobile_number'] = mobile_number
            request.session['login_otp'] = str(secrets.randbelow(9000) + 1000)
            request.session.set_expiry(300)

            return render(request, 'store/account_page.html', {
                'page_title': page_title,
                'page_text': page_text,
                'otp_sent': True,
                'demo_otp': request.session['login_otp'],
                'mobile_number': mobile_number,
            })

        if request.method == 'POST' and 'verify_otp' in actions:
            entered_otp = ''.join(request.POST.getlist('otp_digit'))
            saved_otp = request.session.get('login_otp', '')

            if saved_otp and hmac.compare_digest(entered_otp, saved_otp):
                customer_name = request.session.get('pending_customer_name')
                customer_phone = request.session.get('pending_mobile_number')
                customer, _ = Customer.objects.get_or_create(
                    mobile_number=customer_phone,
                    defaults={'name': customer_name},
                )
                customer.name = customer_name
                customer.last_login = timezone.now()
                customer.save(update_fields=('name', 'last_login'))
                request.session['logged_in'] = True
                request.session['customer_id'] = customer.id
                request.session['customer_name'] = customer.name
                request.session['customer_phone'] = customer.mobile_number
                for key in ('pending_customer_name', 'pending_mobile_number', 'login_otp'):
                    request.session.pop(key, None)
                request.session.set_expiry(None)
                return redirect('home')

            return render(request, 'store/account_page.html', {
                'page_title': page_title,
                'page_text': page_text,
                'otp_sent': True,
                'mobile_number': request.session.get('pending_mobile_number', ''),
                'demo_otp': saved_otp,
                'otp_error': 'The OTP is incorrect or has expired.',
            }, status=400)

    return render(request, 'store/account_page.html', {
        'page_title': page_title,
        'page_text': page_text,
    })


def logout(request):
    request.session.flush()
    return redirect('home')
