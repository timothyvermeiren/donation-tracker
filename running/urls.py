from django.urls import path

from . import views

app_name = "running"
urlpatterns = [
    path("", views.index, name="index"),
    path("addLapAsync/", views.add_lap_async, name="add_lap_async"),
]