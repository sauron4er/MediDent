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
