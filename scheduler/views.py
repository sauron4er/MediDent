from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from .models import Client, Doctor, Visit
from .forms import ClientForm

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
        clients_list = [{
            'id': client.pk,
            'name': client.name,
            'note': client.note,
            'phone': '' if client.phone is None else '0' + client.phone,
        } for client in Client.objects.filter(is_active=True)]
        return render(request, 'scheduler/clients.html', {
            'clients': clients_list,
        })

    if request.method == 'POST':
        client_form = ClientForm(request)
        if client_form.is_valid():
            # Постимо і отримуємо ід нового клієнта
            new_client = client_form.save()

            return HttpResponse(new_client.pk)


