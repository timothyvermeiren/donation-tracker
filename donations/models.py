from django.db import models

class Donation(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    amount = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)