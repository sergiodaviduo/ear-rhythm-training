from django.shortcuts import render
from django.views.generic import TemplateView
from music_training.forms import ScoreForm

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader


# whenever someone loads the homepage / root site, this method is ran:

def index(request):
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = ScoreForm(request.POST)

        print(form)

        return HttpResponseRedirect("/admin/")
    else:
        form = ScoreForm()

    print("testhihi")
    return render(request, "music_training/index.html", {"form": form})

'''def get_submitscore(request):
    # if this is a POST request we need to process the form data
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = ScoreForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect("/")

    # if a GET (or any other method) we'll create a blank form
    else:
        form = ScoreForm()

    return render(request, "submitscore.html", {"form": form})

'''