from rest_framework import viewsets, permissions, status 
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from products.models import Product 

# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.none()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        cart_items = self.request.data.get('items', [])
        total = 0
        for item in cart_items:
            product = Product.objects.get(id=item['product_id'])
            quantity = item['quantity']
            price = product.final_price
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )
            total += price * quantity
        order.total = total 
        order.save()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.user != request.user and not request.user.is_staff:
            return Response({'error': 'У вас нет прав на отмену этого заказа'}, status=403)
        order.status = 'cancelled'
        order.save()
        return Response({'status': 'Заказ отменен'})
    
class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.none()

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)