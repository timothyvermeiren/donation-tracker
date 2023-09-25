from django.db import models
from django.utils import timezone

class Team(models.Model):
    name = models.CharField(max_length=255, default="Anoteam")
    origin = models.CharField(max_length=255, default="Weerde")

class Participant(models.Model):
    name = models.CharField(max_length=255, default="Anoniem")
    number = models.CharField(max_length=3, default="")
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    strava_user_id = models.CharField(max_length=255, null=True, blank=True, default="")

class Lap(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)