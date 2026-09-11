from django import forms

from .models import Category, Coupon, Order, Product, Review


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            'name', 'category', 'price', 'original_price', 'discount', 'color',
            'fabric', 'occasion', 'rating', 'reviews_count', 'stock',
            'description', 'external_image_url', 'image', 'is_active',
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'discount': forms.NumberInput(attrs={'min': 0, 'max': 100}),
            'rating': forms.NumberInput(attrs={'min': 0, 'max': 5, 'step': '0.1'}),
            'stock': forms.NumberInput(attrs={'min': 0}),
        }

    def clean(self):
        cleaned = super().clean()
        price = cleaned.get('price')
        original_price = cleaned.get('original_price')
        if price is not None and original_price is not None and price > original_price:
            raise forms.ValidationError('Price cannot be higher than original price.')
        return cleaned


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'is_active']


class CouponForm(forms.ModelForm):
    class Meta:
        model = Coupon
        fields = [
            'code', 'discount_type', 'discount_value', 'minimum_order_amount',
            'maximum_discount', 'start_date', 'end_date', 'is_active',
        ]
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }


class OrderStatusForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['order_status', 'payment_status']


class ReviewStatusForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['status']
