from django.urls import path
from .views import *

urlpatterns = [
    path("",Home.as_view()),
    path('user_register/',Registration.as_view()),
    path("login/",LoginUser.as_view()),
    path('logout/',Logout.as_view()),
    path("recommendations/", getRecommendations)
]