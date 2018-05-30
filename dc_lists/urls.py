from django.conf.urls import include, url

# Custom:
from dc_lists.views import dc_lists

app_name = 'dc_lists'

urlpatterns = [
    url(r'^$', dc_lists, name='dc_lists'),
]