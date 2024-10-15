from django.db import models

class HighScores(models.Model):
    name = models.CharField(max_length = 100)
    finalScore = models.IntegerField()

    def __int__(self):
        return self.finalScore