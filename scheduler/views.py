from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from datetime import timedelta, datetime, date
from django.utils import timezone
import pytz
import json

from .models import Client, Doctor, Visit
from .forms import ClientForm, AddVisitForm, ChangeVisitsTimeForm, DelVisitForm, ChangeVisitsDoctorOrNoteForm, DoctorForm, FireDoctorForm


def convert_to_localtime(utctime, fmt):
    utc = utctime.replace(tzinfo=pytz.UTC)
    localtz = utc.astimezone(timezone.get_current_timezone())
    return localtz.strftime(fmt)


# бере з бд список прийомів на місяць, який відображається на екрані
def get_visits(day):
    visits = [{
        'id': visit.id,
        'text': visit.client.name,
        'startDate': convert_to_localtime(visit.start, '%Y/%m/%d %H:%M:%S'),
        'endDate': convert_to_localtime(visit.finish, '%Y/%m/%d %H:%M:%S'),
        'note': '' if visit.note is None else visit.note,
        'doctor': '' if visit.doctor is None else visit.doctor.name,
        'price': '' if visit.price is None else visit.price,
    } for visit in Visit.objects
        .filter(start__range=[day - timedelta(days=7), day + timedelta(days=28)])
        .filter(is_active=True)]
    return visits


@login_required
def schedule(request):
    if request.method == 'GET':
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

        return render(request, 'scheduler/schedule/schedule.html', {
            'visits': get_visits(timezone.now()), 'clients': clients_list, 'doctors': doctors,
        })
    elif request.method == 'POST':
        # копіюємо запит, щоб зробити його мутабельним і обробляємо поля
        visit_request = request.POST.copy()

        correct_start = datetime.strptime(visit_request['start'], "%d.%m.%Y, %H:%M:%S")
        correct_finish = datetime.strptime(visit_request['finish'], "%d.%m.%Y, %H:%M:%S")

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
def visits_list(request, first_date):
    if request.method == 'GET':
        return HttpResponse(
            json.dumps(
                get_visits(datetime.strptime(first_date, "%Y/%m/%d"))
            )
        )


# Список майбутніх візитів клієнта
@login_required
def client_visits(request, visit_id):
    if request.method == 'GET':
        clicked_visit = get_object_or_404(Visit, pk=visit_id)

        visits = [{
            'id': visit.pk,
            'start': convert_to_localtime(visit.start, '%d.%m, %H:%M:%S'),
        } for visit in Visit.objects
            .filter(client_id=clicked_visit.client_id)
            .filter(is_active=True)
            .filter(start__gte=datetime.now())
            .order_by('start')]

        return HttpResponse(json.dumps(visits))


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
        elif request.POST['change'] == 'info':
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
        doctors_list = [{
            'id': doctor.pk,
            'name': doctor.name,
        } for doctor in Doctor.objects.filter(is_active=True).order_by('name')]

        return render(request, 'scheduler/stats/stats.html', {
            'doctors': doctors_list,
        })


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

    elif request.method == 'POST':
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


@login_required
def new_doctor(request):
    if request.method == 'POST':
        doctor_request = request.POST.copy()
        doctor_request.update({'hired_date': timezone.now()})
        doctor_form = DoctorForm(doctor_request)
        if doctor_form.is_valid():
            new_doctor_id = doctor_form.save().pk

            return HttpResponse(new_doctor_id)


@login_required
def fire_doctor(request, pk):
    if request.method == 'POST':
        doctor = get_object_or_404(Doctor, pk=pk)
        doctor_request = request.POST.copy()
        doctor_request.update({'fired_date': timezone.now()})
        form = FireDoctorForm(doctor_request, instance=doctor)
        if form.is_valid():
            form.save()
            return HttpResponse(doctor)

