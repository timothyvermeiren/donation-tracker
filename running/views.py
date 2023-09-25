from django.http import JsonResponse
from django.shortcuts import render
from .models import Participant, Team, Lap

import json

# Create your views here.

def index(request):
    teams = Team.objects.all().order_by("id")
    participants = Participant.objects.all().order_by("number")
    context = {}
    context["teams"] = []
    for team in teams:
        team_participants = []
        for team_participant in [p for p in participants if p.team == team]:
            team_participant_laps = Lap.objects.filter(participant=team_participant).count()
            team_participants.append({
                "name": team_participant.name,
                "number": team_participant.number,
                "participant": team_participant,
                "laps": team_participant_laps
            })
        context["teams"].append({
            "name": team.name,
            "team": team,
            "participants": team_participants,
            "total_laps": sum([p["laps"] for p in team_participants])
        })

    return render(request, "running/index.html", context)

def add_lap_async(request):

    try:
        request_json = json.loads(request.body)
        participant_id = request_json["participantId"]
        new_lap = Lap.objects.create(participant_id=participant_id)
        participant_total_laps = Lap.objects.filter(participant_id=participant_id).count()
        
        response = {
            "new_lap_timestamp": new_lap.timestamp,
            "participant_total_laps": participant_total_laps
        }
        return JsonResponse(response)
    
    except Exception as e:
        print(e)
