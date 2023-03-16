from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

class FarmerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'})
    class Meta:
        model = Farmer
        fields = ['id', 'first_name', 'last_name', 'email','username','contact_no','password']

        extra_kwargs = {'password': {'write_only': True, 'min_length': 4}}

    def newsave(self):
        profile=Farmer(email=self.validated_data['email'],username=self.validated_data['username'],first_name=self.validated_data['first_name'],last_name=self.validated_data['last_name'],contact_no=self.validated_data['contact_no'])
        password=self.validated_data['password']
        profile.set_password(password)
        profile.save()
        return profile