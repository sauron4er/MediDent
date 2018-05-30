from django.conf.urls import include, url

# Custom:
from scheduler.views import schedule

app_name = 'scheduler'

urlpatterns = [
    url(r'^$', schedule, name='schedule'),
]