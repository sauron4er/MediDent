from django.db import models


class Doctor(models.Model):
    name = models.CharField(max_length=45)
    hired_date = models.DateField(null=True)
    fired_date = models.DateField(null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)


class Client(models.Model):
    name = models.CharField(max_length=45)
    note = models.CharField(max_length=500, blank=True, null=True)
    phone = models.CharField(max_length=10, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)


class Visit(models.Model):
    doctor = models.ForeignKey(Doctor, related_name='visits', on_delete=models.PROTECT)
    client = models.ForeignKey(Client, related_name='visits', on_delete=models.PROTECT)
    start = models.DateTimeField()
    finish = models.DateTimeField()
    note = models.CharField(max_length=500, null=True, blank=True)
    price = models.IntegerField(null=True)
