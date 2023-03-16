from django.shortcuts import render

# Create your views here.
from django.http import Http404
from rest_framework.views import APIView,View
from rest_framework.response import Response
from rest_framework import status,generics
from .serializer import *
from django.contrib.auth import authenticate, login
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets
from rest_framework import permissions
from django.contrib import auth
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .models import *
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib 
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from .Controllers import *
import time

# def sendmail(receiver,subject,body):
#     msg = MIMEMultipart()
#     msg['From'] = "lochackathon2021@gmail.com" #enter YOUR EMAIL ADDRESS
#     password= "daak@1234" #enter YOUR PASSWORD
#     msg['To']= receiver
#     msg['Subject'] = subject
#     msg.attach(MIMEText(body))
 
#     s = smtplib.SMTP('smtp.gmail.com', 587)
#     s.starttls()
#     s.login(msg['From'],password)
#     s.sendmail(msg['From'],msg['To'],msg.as_string())
#     s.quit()

class Home(APIView):
    def get(self,request):
        return Response("Home")

class Registration(APIView):
    def post(self,request):
        serializer=FarmerSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid(raise_exception=True):
            user=serializer.newsave()
            print(user)
            # user.otp_generator()
           
        
            token = Token.objects.create(user=user)

            data={
            "id":user.id,
            "name": user.first_name + " " + user.last_name,
            "email":user.email,
            "username":user.username,
            "contact_no":user.contact_no,
            "token":token.key,
            "resgistration status":"done",
            }
            # body = "Welcome! Your OTP (One time Password) to verify your Email ID is :"+str(user.otp)
            # sendmail(user.email,"Email Verification Mail",body)

            return Response(data,status=status.HTTP_200_OK)
     
class LoginUser(APIView):
    def post(self,request):
        email = request.data.get("email")
        password = request.data.get("password")
        print(email,password)
        user = authenticate(email=email,password=password)
        if user is not None : #and user.is_verified:
            token, _ =Token.objects.get_or_create(user=user)
            login(request, user)
            contact_no=Farmer.objects.get(id=user.id).contact_no
            data = {
                "id": user.pk,
                "Name": user.first_name+" "+user.last_name,
                "Username": user.username,
                "Message":"done",
                "contact_no":contact_no,
                "success":True,
                "Token":token.key
                }

            return Response(data,status=status.HTTP_200_OK)
        else:
            return Response({"message":"User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        """elif user is not None:
            if user.is_verified==False:
                return Response({"message":"Email Id is not verified"},status=status.HTTP_400_BAD_REQUEST)"""

class Logout(APIView):
    def get(self,request):
        auth.logout(request)
        return redirect('/')


@api_view(["POST"])
def getRecommendations(request) :
        try :
            recommendationPipeline = RecommendationPipeline(request.user)
            if(request.data.get("file") != None) :
                #Saving image
                tmstmp = time.time()
                soilImgPath = default_storage.save(f"{tmstmp}.jpg", ContentFile(request.FILES["file"].read()))
                
                n = 5
                recommendationPipeline.getRecommendationsByImage(soilImgPath,[request.data.get("lat"),request.data.get("lon")],n)

                #Deleting image
                path = os.path.join(settings.MEDIA_ROOT, f"{tmstmp}.jpg")
                time.sleep(0.1)
                os.remove(path)
            else :
                soilData = {"N": request.data["N"],"P": request.data["P"],"K": request.data["K"],"Ph": request.data["Ph"]}
                recommendationPipeline.getRecommendationsByValues(soilData,[request.data.get("lat"),request.data.get("lon")],5)

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

"""
print(settings.MEDIA_ROOT)
            path = default_storage.save("tmp/test.jpg", ContentFile(request.FILES["file"].read()))
            tmpFile = os.path.join(settings.MEDIA_ROOT, path)
"""
