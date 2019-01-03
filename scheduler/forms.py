from django import forms

from .models import Client, Visit, Doctor


class ClientForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ('name', 'note', 'phone', 'is_active')


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
