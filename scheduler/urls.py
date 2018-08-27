from django.conf.urls import include, url

# Custom:
from scheduler.views import schedule, stats, clients

app_name = 'scheduler'

urlpatterns = [
    url(r'^$', schedule, name='schedule'),
    url(r'^stats/', stats, name='stats'),
    url(r'^clients/', clients, name='clients'),
]