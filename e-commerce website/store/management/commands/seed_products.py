import json
from pathlib import Path

from django.core.management.base import BaseCommand

from store.models import Category, Product


class Command(BaseCommand):
    help = 'Import the existing products.json catalog into the database.'

    def handle(self, *args, **options):
        source = Path('static/js/products.json')
        products = json.loads(source.read_text(encoding='utf-8'))
        created = 0
        for item in products:
            category, _ = Category.objects.get_or_create(name=item['category'])
            product, was_created = Product.objects.update_or_create(
                name=item['name'],
                defaults={
                    'category': category,
                    'price': item['price'],
                    'original_price': item['originalPrice'],
                    'discount': item.get('discount', 0),
                    'color': item.get('color', ''),
                    'fabric': item.get('fabric', ''),
                    'occasion': item.get('occasion', ''),
                    'rating': item.get('rating', 0),
                    'reviews_count': item.get('reviews', 0),
                    'stock': item.get('stock', 0),
                    'description': item.get('description', ''),
                    'external_image_url': item.get('image', ''),
                    'is_active': True,
                },
            )
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f'Imported {created} new products; processed {len(products)} total products.'))
