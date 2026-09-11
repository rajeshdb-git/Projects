from django.urls import path

from . import admin_views


urlpatterns = [
    path('login/', admin_views.admin_login, name='admin-login'),
    path('logout/', admin_views.admin_logout, name='admin-logout'),
    path('', admin_views.dashboard, name='admin-dashboard'),
    path('products/', admin_views.products, name='admin-products'),
    path('products/add/', admin_views.product_create, name='admin-product-add'),
    path('products/<int:product_id>/edit/', admin_views.product_edit, name='admin-product-edit'),
    path('products/<int:product_id>/delete/', admin_views.product_delete, name='admin-product-delete'),
    path('categories/', admin_views.categories, name='admin-categories'),
    path('categories/<int:category_id>/delete/', admin_views.category_delete, name='admin-category-delete'),
    path('orders/', admin_views.orders, name='admin-orders'),
    path('orders/<int:order_id>/', admin_views.order_detail, name='admin-order-detail'),
    path('customers/', admin_views.customers, name='admin-customers'),
    path('discounts/', admin_views.coupons, name='admin-coupons'),
    path('discounts/<int:coupon_id>/delete/', admin_views.coupon_delete, name='admin-coupon-delete'),
    path('reviews/', admin_views.reviews, name='admin-reviews'),
    path('reviews/<int:review_id>/status/', admin_views.review_status, name='admin-review-status'),
    path('reports/', admin_views.reports, name='admin-reports'),
    path('settings/', admin_views.settings_page, name='admin-settings'),
]
