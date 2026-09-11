from django.contrib import admin

from .models import Address, Category, Coupon, Customer, Order, OrderItem, Product, Review


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('name', 'category', 'price', 'stock', 'rating', 'is_active')
	list_filter = ('category', 'is_active')
	search_fields = ('name', 'fabric', 'color')


admin.site.register([Address, Category, Coupon, Customer, Order, OrderItem, Review])
