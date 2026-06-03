from django.contrib import admin
from .models import Category, Product, ProductImage

# Register your models here.
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'final_price', 'stock']
    list_filter = ['category', 'discount']
    search_fields = ['title', 'description']
    list_editable = ['stock']
    inlines = [ProductImageInline]

    def final_price(self, obj):
        return f'{obj.final_price:.2f}'
    final_price.short_description = 'Цена со скидкой'

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'product']
    autocomplete_fields = ['product']