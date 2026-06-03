from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _ 

# Create your models here.
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, verbose_name='Телефон', blank=True)
    avatar = models.ImageField(upload_to='avatars/', verbose_name='Аватар', blank=True, null=True)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Пользователь',
        verbose_name_plural = 'Пользователи'


        