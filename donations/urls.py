from django.urls import path

from . import views

app_name = "donations"
urlpatterns = [
    # path("", views.index, name="index"),
    path("view/", views.index, name="index"),
    path("donate/", views.donate, name="donate"),
    # path("kotk_form/<str:first_name>/<str:last_name>/<str:amount>/", views.kotk_form, name="kotk_form"),
    path("getCurrentTotal/", views.get_current_total_async, name="get_current_total_async"),
]