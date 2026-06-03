from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'is_staff']
    list_filter = ['is_staff', 'is_active']
    search_fields = ['username', 'email', 'phone']
    fieldsets = UserAdmin.fields + (
        ('Дополнительная информация', {'fields': ('phone', 'avatar')})
    )