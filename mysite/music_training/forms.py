from django import forms


class ScoreForm(forms.Form):
    name = forms.CharField(label="name", max_length=100, initial="test1")
    final_score = forms.CharField(label="Final score", max_length=10)

