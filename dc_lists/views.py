from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def dc_lists(request):
    if request.method == 'GET':
        return render(request, 'dc_lists/lists.html')