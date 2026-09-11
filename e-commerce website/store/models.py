from django.db import models


class Customer(models.Model):
	name = models.CharField(max_length=120)
	mobile_number = models.CharField(max_length=10, unique=True)
	email = models.EmailField(blank=True)
	address = models.CharField(max_length=255, blank=True)
	city = models.CharField(max_length=80, blank=True)
	state = models.CharField(max_length=80, blank=True)
	postal_code = models.CharField(max_length=10, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	last_login = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.name} ({self.mobile_number})'


class Category(models.Model):
	name = models.CharField(max_length=80, unique=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name


class Product(models.Model):
	name = models.CharField(max_length=180)
	category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
	price = models.DecimalField(max_digits=10, decimal_places=2)
	original_price = models.DecimalField(max_digits=10, decimal_places=2)
	discount = models.PositiveIntegerField(default=0)
	color = models.CharField(max_length=60, blank=True)
	fabric = models.CharField(max_length=100, blank=True)
	occasion = models.CharField(max_length=80, blank=True)
	rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
	reviews_count = models.PositiveIntegerField(default=0)
	stock = models.PositiveIntegerField(default=0)
	description = models.TextField(blank=True)
	external_image_url = models.URLField(blank=True)
	image = models.ImageField(upload_to='products/', blank=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	@property
	def image_source(self):
		return self.image.url if self.image else self.external_image_url

	def __str__(self):
		return self.name


class Order(models.Model):
	ORDER_STATUS_CHOICES = [
		('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('PACKED', 'Packed'),
		('SHIPPED', 'Shipped'), ('OUT_FOR_DELIVERY', 'Out for Delivery'),
		('DELIVERED', 'Delivered'), ('CANCELLED', 'Cancelled'),
	]
	PAYMENT_STATUS_CHOICES = [('PENDING', 'Pending'), ('PAID', 'Paid'), ('FAILED', 'Failed'), ('REFUNDED', 'Refunded')]
	customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='orders')
	shipping_address = models.CharField(max_length=255)
	shipping_city = models.CharField(max_length=80)
	shipping_state = models.CharField(max_length=80)
	shipping_postal_code = models.CharField(max_length=10)
	payment_method = models.CharField(max_length=50, default='Cash on Delivery')
	payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
	order_status = models.CharField(max_length=30, choices=ORDER_STATUS_CHOICES, default='PENDING')
	discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'#{self.pk} - {self.customer.name}'


class OrderItem(models.Model):
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
	quantity = models.PositiveIntegerField(default=1)
	price = models.DecimalField(max_digits=10, decimal_places=2)

	@property
	def subtotal(self):
		return self.price * self.quantity


class Coupon(models.Model):
	PERCENTAGE = 'PERCENTAGE'
	FIXED = 'FIXED'
	DISCOUNT_TYPES = [(PERCENTAGE, 'Percentage'), (FIXED, 'Fixed Amount')]
	code = models.CharField(max_length=40, unique=True)
	discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default=PERCENTAGE)
	discount_value = models.DecimalField(max_digits=10, decimal_places=2)
	minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	maximum_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	start_date = models.DateField()
	end_date = models.DateField()
	is_active = models.BooleanField(default=True)

	def __str__(self):
		return self.code


class Review(models.Model):
	STATUS_CHOICES = [('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('HIDDEN', 'Hidden')]
	customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reviews')
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
	rating = models.PositiveSmallIntegerField(default=5)
	comment = models.TextField()
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
	created_at = models.DateTimeField(auto_now_add=True)


class Address(models.Model):
	customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='addresses')
	label = models.CharField(max_length=30, default='HOME')
	address = models.CharField(max_length=255)
	city = models.CharField(max_length=80)
	state = models.CharField(max_length=80)
	postal_code = models.CharField(max_length=10)
	is_default = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.customer.name} - {self.city}'
