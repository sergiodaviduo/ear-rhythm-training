from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('show-highscores.html', views.show_highscores, name='show-highscores'),
]