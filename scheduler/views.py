from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Client, Doctor, Visit

@login_required
def schedule(request):
    if request.method == 'GET':
        return render(request, 'scheduler/schedule.html')


@login_required
def stats(request):
    if request.method == 'GET':
        return render(request, 'scheduler/stats.html')


@login_required
def clients(request):
    if request.method == 'GET':
        clients = [{
            'id': client.pk,
            'name': client.name,
            'note': client.note,
            'phone': '0' + client.phone,
        } for client in Client.objects.filter(is_active=True)]
        return render(request, 'scheduler/clients.html', {
            'clients': clients,
        })


