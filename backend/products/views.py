from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action 
from rest_framework.response import Response 
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, ProductSerializer, ProductImageSerializer
from .permissions import IsAdminOrReadOnly
from .pagination import CustomPagination

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'stock']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at', 'discount']
    ordering = ['-created_at']
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category_id')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        in_stock = self.request.query_params.get('in_stock')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if in_stock == 'true':
            queryset = queryset.filter(stock__gt=0)
        return queryset
    
    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        image = request.FILES.get('image')
        if image:
            ProductImage.objects.create(product=product, image=image)
            return Response({'status': 'Image uploaded'})
        return Response({'error': 'No image provided'}, status=400)
    
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAdminUser]