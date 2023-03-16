from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.urls import reverse
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
import random
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class MyUserManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, department=None,password=None,**kwargs):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            first_name = first_name,
            last_name  = last_name,
            department = department,
            email      = self.normalize_email(email),
            username   = username
        )



        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, username, first_name, last_name, password):
        user = self.create_user(
            first_name = first_name,
            last_name  = last_name,
            email      = self.normalize_email(email),
            password   = password,
            username   = username
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email           = models.EmailField(max_length=50, unique=True)
    username        = models.CharField(max_length=25, unique=True)
    first_name      = models.CharField(max_length=15)
    last_name       = models.CharField(max_length=15)
    department      = models.CharField(max_length=15, blank=True, null=True)
    date_joined     = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login      = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin        = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    is_staff        = models.BooleanField(default=False)
    is_superuser    = models.BooleanField(default=False)
    is_verified     = models.BooleanField(default=False)

    
    def otp_generator(self):
        self.otp=random.randint(1000,9999)
        self.save()
    
    def random_generator(self):
        self.otp=random.randint(100000,999999)
        self.save()







    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username','first_name','last_name']

    objects = MyUserManager()


    # For checking permissions. to keep it simple all admin have ALL permissons
    def has_perm(self, perm, obj=None):
        return self.is_admin

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(self, app_label):
        return True

    def name(self):
        return self.first_name+' '+self.last_name

class Farmer(User):
    user=models.OneToOneField(User,on_delete=models.CASCADE,parent_link=True)
    contact_no=models.CharField(max_length=10,blank=False,unique=True)
    def name(self):
        return self.first_name+' '+self.last_name

class FarmerHistory(models.Model):
    farmer = models.ForeignKey(Farmer,on_delete=models.CASCADE)
    year = models.CharField(max_length=100)
    sowing_month = models.IntegerField()
    harvest_month = models.IntegerField()
    crop = models.CharField(max_length=300)
    actual = models.FloatField()
    expected = models.FloatField()



