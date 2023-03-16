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
import pandas as pd

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
            recommendations = None
            if(request.data.get("file") != None) :
                #Saving image
                tmstmp = time.time()
                soilImgPath = default_storage.save(f"{tmstmp}.jpg", ContentFile(request.FILES["file"].read()))
                
                n = 5
                recommendations = recommendationPipeline.getRecommendationsByImage(soilImgPath,[request.data.get("lat"),request.data.get("lon")],n)

                #Deleting image
                path = os.path.join(settings.MEDIA_ROOT, f"{tmstmp}.jpg")
                time.sleep(0.1)
                os.remove(path)
            else :
                soilData = {"N": request.data["N"],"P": request.data["P"],"K": request.data["K"],"Ph": request.data["Ph"]}
                recommendations = recommendationPipeline.getRecommendationsByValues(soilData,[request.data.get("lat"),request.data.get("lon")],5)

            cropDf = pd.read_csv(os.path.join(settings.DATASETS, "Crop Data New.csv"), engine="python")

            resp = []
            for recomm in recommendations :
                resp.append({"id": recomm[0], "name": cropDf.iloc[recomm[0]]['Crop'], "description":cropDf.iloc[recomm[0]]['Description'], "img": cropDf.iloc[recomm[0]]['Image'] })

            return Response({"Recommendations": resp})
        except Exception as e:
            print(str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class farmer_history(generics.GenericAPIView):
    serializer_class = FarmerHistorySerializer
    queryset = FarmerHistory.objects.all()
    permission_classes = (IsAuthenticated,)

    def get(self,request):
        farmer_historys = FarmerHistory.objects.filter(farmer=request.user)
        serializer  = FarmerHistorySerializer(farmer_historys,many=True)
        return Response(serializer.data)
    def post(self,request):
        year = request.data.get("year")
        sowing_month = request.data.get("sowing_month")
        harvest_month = request.data.get("harvest_month")
        crop = request.data.get("crop")
        actual = request.data.get("actual")
        expected = request.data.get("expected")
        farmer = request.user
        data={
            "year":year,
            "sowing_month":sowing_month,
            "harvest_month":harvest_month,
            "crop":crop,
            "actual":actual,
            "expected":expected,
            "farmer":farmer
        }
        serializer = FarmerHistorySerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class farmer_history_id(generics.GenericAPIView):
    serializer_class = FarmerHistorySerializer
    queryset = FarmerHistory.objects.all()
    permission_classes = (IsAuthenticated,)

    def delete(self,request,id):
        farmer_historys = FarmerHistory.objects.get(id=id)
        farmer_historys.delete()
        return Response("deleted Successfully",status=HTTP_200_OK)
    def put(self,request,id):
        year = request.data.get("year")
        sowing_month = request.data.get("sowing_month")
        harvest_month = request.data.get("harvest_month")
        crop = request.data.get("crop")
        actual = request.data.get("actual")
        expected = request.data.get("expected")
        farmer = request.user
        farmer_historys = FarmerHistory.objects.get(id=id)
        # print(data)
        if year is not None:
            farmer_historys.year=year
        if sowing_month is not None:
            farmer_historys.sowing_month=sowing_month
        if harvest_month is not None:
            farmer_historys.harvest_month = harvest_month
        if crop is not None:
            farmer_historys.crop = crop
        if actual is not None:
            farmer_historys.actual = actual
        if expected is not None:
            farmer_historys.expected = expected
        farmer_historys.save()
        farmer_historys = FarmerHistory.objects.get(id=id)
        data={
            "year":farmer_historys.year,
            "sowing_month":farmer_historys.sowing_month,
            "harvest_month":farmer_historys.harvest_month,
            "crop":farmer_historys.crop,
            "actual":farmer_historys.actual,
            "expected":farmer_historys.expected,
            "farmer":farmer
        }
        serializer = FarmerHistorySerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data)     

"""
print(settings.MEDIA_ROOT)
            path = default_storage.save("tmp/test.jpg", ContentFile(request.FILES["file"].read()))
            tmpFile = os.path.join(settings.MEDIA_ROOT, path)
"""
