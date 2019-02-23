from django import forms

from .models import Client, Visit, Doctor


class ClientForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ('name', 'note', 'phone', 'is_active')


class DoctorForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ('name', 'hired_date')


class FireDoctorForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ('is_active', 'fired_date')


class AddVisitForm(forms.ModelForm):
    class Meta:
        model = Visit
        fields = ('doctor', 'client', 'start', 'finish', 'note')


class ChangeVisitsTimeForm(forms.ModelForm):
    class Meta:
        model = Visit
        fields = ('start', 'finish')


class ChangeVisitsDoctorOrNoteForm(forms.ModelForm):
    class Meta:
        model = Visit
        fields = ('doctor', 'note', 'price')


class DelVisitForm(forms.ModelForm):
    class Meta:
        model = Visit
        fields = ('is_active',)
