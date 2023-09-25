from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib import messages
from django.urls import reverse
from django.db.models import Sum
from .models import Donation

def index(request):
    total_amount = Donation.objects.all().aggregate(Sum("amount")).get("amount__sum", 10)
    context = {
        "total_amount": total_amount
    }
    return render(request, "donations/index.html", context)

def donate(request):

    # The first section for POST processes input if there was any, adding the donation. After that we render the form in all cases.

    if request.method == "POST":
        try:
            amount = request.POST.get("amount", 50)
            first_name = request.POST.get("firstName", None)
            last_name = request.POST.get("lastName", None)
            donation = Donation(first_name=first_name, last_name=last_name, amount=amount)
            donation.save()
            messages.success(request, "Vervolledig het officiële KotK giftenformulier om de gift af te werken!")
            context = {
                "first_name": first_name,
                "last_name": last_name,
                "amount": amount
            }
            return render(request, "donations/kotk_form.html", context=context)
        except Exception as e:
            messages.error(request, "Er was een probleem met de ingegeven gift.")
            print(e)
            return render(request, "donations/donate.html")

    else:
        return render(request, "donations/donate.html")
    

def get_current_total_async(request):

    try:
        total_amount = Donation.objects.all().aggregate(Sum("amount")).get("amount__sum", 0)
        response = {
            "total_amount": total_amount
        }
        return JsonResponse(response)
    except Exception as e:
        print(e)
