from django.shortcuts import render
from music_training.forms import ScoreForm

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader

# should process data in a different file then this at some point, but for now is ok
from music_training.models import HighScores


# whenever someone loads the homepage / root site, this method is ran:

def index(request):
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = ScoreForm(request.POST)
        if form.is_valid():
            print("Name of submitted form:"+form.cleaned_data["name"])
            newScore = HighScores(name=form.cleaned_data["name"], finalScore=form.cleaned_data["final_score"])

            newScore.save()

            print(form)

        return HttpResponseRedirect("/admin/")
    else:
        form = ScoreForm()

    return render(request, "music_training/index.html", {"form": form})

def show_highscores(request):
    all_highscores = HighScores.objects.all()
    template = loader.get_template("music_training/show-highscores.html")
    return HttpResponse(template.render({'all_highscores': all_highscores}, request) )
