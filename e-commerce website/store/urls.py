from django.urls import path

from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('products/<int:product_id>/', views.product_detail, name='product-detail'),
    path('api/products/', views.product_data, name='product-data'),
    path('logout/', views.logout, name='logout'),
    path('login/', views.account_page, {'page_title': 'Login / Signup', 'page_text': 'Sign in or create your Brand_name account.'}, name='login'),
    path('orders/', views.account_page, {'page_title': 'Orders', 'page_text': 'Your Brand_name orders will appear here.'}, name='orders'),
    path('wishlist/', views.account_page, {'page_title': 'Wishlist', 'page_text': 'Save your favourite products here.'}, name='wishlist'),
    path('gift-cards/', views.account_page, {'page_title': 'Gift Cards', 'page_text': 'Your gift cards will appear here.'}, name='gift-cards'),
    path('contact-us/', views.account_page, {'page_title': 'Contact Us', 'page_text': 'We are here to help with your Brand_name experience.'}, name='contact-us'),
    path('bag/', views.account_page, {'page_title': 'Bag', 'page_text': 'Your shopping bag is currently empty.'}, name='bag'),
]
