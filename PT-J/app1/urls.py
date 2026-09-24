from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('',views.base),
    path('home/',views.home),
    path(
        'services/<slug:service>/',
        views.service_page,
        name='service_page'
    ),
    path('about/', views.about, name='about'),
    path(
        'all-conditions/',
        views.all_conditions,
        name='all_conditions'
    ),




   
]