from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

class FarmerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'})
    class Meta:
        model = Farmer
        fields = ['id', 'name_f', 'email','username','contact_no','password']

        extra_kwargs = {'password': {'write_only': True, 'min_length': 4}}

    def newsave(self):
        profile=Farmer(name_f=self.validated_data['name_f'],email=self.validated_data['email'],username=self.validated_data['username'],contact_no=self.validated_data['contact_no'])
        password=self.validated_data['password']
        profile.set_password(password)
        profile.save()
        return profile
    
class FarmerHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerHistory
        fields = "__all__"