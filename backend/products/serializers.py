from rest_framework import serializers
from .models import Category, Product, ProductImage 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product 
        fields = [
            'id', 'title', 'description', 'price', 'discount', 'final_price',
            'category', 'category_id', 'image', 'stock', 'created_at', 'updated_at', 'images'
        ]