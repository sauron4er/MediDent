from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from datetime import timedelta, datetime
from dateutil import parser
from django.utils import timezone
import pytz

from .models import Client, Doctor, Visit
from .forms import ClientForm, AddVisitForm, ChangeVisitsTimeForm, DelVisitForm, ChangeVisitsDoctorOrNoteForm


def convert_to_localtime(utctime):
    fmt = '%Y/%m/%d %H:%M:%S'
    utc = utctime.replace(tzinfo=pytz.UTC)
    localtz = utc.astimezone(timezone.get_current_timezone())
    return localtz.strftime(fmt)


@login_required
def schedule(request):
    if request.method == 'GET':
        today = timezone.now()
        clients_list = [{
            'id': client.pk,
            'name': client.name,
            'note': '' if client.note is None else client.note,
            'phone': '' if client.phone is None else client.phone,
        } for client in Client.objects.filter(is_active=True).order_by('name')]
        doctors = [{
            'id': doctor.pk,
            'name': doctor.name,
        } for doctor in Doctor.objects.filter(is_active=True).order_by('name')]
        visits = [{
            'id': visit.id,
            'text': visit.client.name,
            'startDate': convert_to_localtime(visit.start),
            'endDate': convert_to_localtime(visit.finish),
            'note': '' if visit.note is None else visit.note,
            'doctor': '' if visit.doctor is None else visit.doctor.name,
        } for visit in Visit.objects
            .filter(start__range=[today - timedelta(days=7), today + timedelta(days=7)])
            .filter(is_active=True)]
        return render(request, 'scheduler/schedule/schedule.html', {
            'visits': visits, 'clients': clients_list, 'doctors': doctors,
        })
    if request.method == 'POST':
        # копіюємо запит, щоб зробити його мутабельним і обробляємо поля
        visit_request = request.POST.copy()
        # parser.parse перетворює отримані з dxScheduler дані на нормальний DateTime, але путає місцями місяць та день
        start = parser.parse(visit_request['start'])
        finish = parser.parse(visit_request['finish'])
        # Перетворюємо невірні дані в string
        start_string = datetime.strftime(start, "%Y-%d-%m %H:%M:%S")
        finish_string = datetime.strftime(finish, "%Y-%d-%m %H:%M:%S")
        # Задаємо формат вірних даних і виправляємо їх функцією strptime
        correct_start = datetime.strptime(start_string, "%Y-%d-%m %H:%M:%S")
        correct_finish = datetime.strptime(finish_string, "%Y-%d-%m %H:%M:%S")

        visit_request.update({'start': correct_start})
        visit_request.update({'finish': correct_finish})
        if visit_request['doctor'] == '':
            visit_request.update({'doctor': None})

        add_visit_form = AddVisitForm(visit_request)
        if add_visit_form.is_valid():
            # Постимо і отримуємо ід нового клієнта
            new_visit = add_visit_form.save()

            return HttpResponse(new_visit.pk)


@login_required
def change_visit(request, pk):
    visit = get_object_or_404(Visit, pk=pk)
    if request.method == 'POST':
        if request.POST['change'] == 'time':
            visit_request = request.POST.copy()
            visit_request.update({'start': datetime.strptime(request.POST['start'], "%Y/%m/%d %H:%M:%S")})
            visit_request.update({'finish': datetime.strptime(request.POST['finish'], "%Y/%m/%d %H:%M:%S")})

            form = ChangeVisitsTimeForm(visit_request, instance=visit)
            if form.is_valid():
                form.save()
                return HttpResponse(visit)
        elif request.POST['change'] == 'doctor_note':
            form = ChangeVisitsDoctorOrNoteForm(request.POST, instance=visit)
            if form.is_valid():
                form.save()
                return HttpResponse(visit)
        elif request.POST['change'] == 'delete':
            form = DelVisitForm(request.POST, instance=visit)
            if form.is_valid():
                form.save()
                return HttpResponse(visit)


@login_required
def stats(request):
    if request.method == 'GET':
        return render(request, 'scheduler/stats/stats.html')


@login_required
def clients(request):
    if request.method == 'GET':

        clients_list = [{
            'id': client.pk,
            'name': client.name,
            'note': '' if client.note is None else client.note,
            'phone': '' if client.phone is None else client.phone,
        } for client in Client.objects.filter(is_active=True).order_by('name')]
        return render(request, 'scheduler/clients/clients.html', {
            'clients': clients_list,
        })

    if request.method == 'POST':
        client_form = ClientForm(request.POST)
        if client_form.is_valid():
            # Постимо і отримуємо ід нового клієнта
            new_client = client_form.save()

            return HttpResponse(new_client.pk)


@login_required
def edit_client(request, pk):
    client = get_object_or_404(Client, pk=pk)
    if request.method == 'POST':
        form = ClientForm(request.POST, instance=client)
        if form.is_valid():
            form.save()
            return HttpResponse(client)
