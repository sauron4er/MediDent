from django.conf.urls import include, url
from django.views.generic.base import RedirectView

# Custom:
from scheduler.views import schedule, visits_list, client_visits, stats, clients, edit_client, change_visit

app_name = 'scheduler'

urlpatterns = [
    url(r'^change_visit/(?P<pk>\d+)/$', change_visit, name='change_visit'),

    url(r'^schedule/clients', RedirectView.as_view(url='/clients', permanent=True), {'url': '/clients'}),
    url(r'^schedule/stats', RedirectView.as_view(url='/stats', permanent=True), {'url': '/stats'}),
    url(r'^schedule', schedule, name='schedule'),
    url(r'^visits_list/(?P<date>\d+/\d+/\d+)/$', visits_list, name='schedule'),
    url(r'^client_visits/(?P<visit_id>\d+)/$', client_visits, name='schedule'),

    url(r'^stats/clients', RedirectView.as_view(url='/clients', permanent=True), {'url': '/clients'}),
    url(r'^stats/schedule', RedirectView.as_view(url='/schedule', permanent=True), {'url': '/schedule'}),
    url(r'^stats/', stats, name='stats'),

    url(r'^clients/schedule', RedirectView.as_view(url='/schedule', permanent=True), {'url': '/schedule'}),
    url(r'^clients/stats', RedirectView.as_view(url='/stats', permanent=True), {'url': '/stats'}),
    url(r'^clients/(?P<pk>\d+)/$', edit_client, name='edit_client'),
    url(r'^clients/', clients, name='clients'),

    url(r'^$', schedule, name='schedule'),
]
