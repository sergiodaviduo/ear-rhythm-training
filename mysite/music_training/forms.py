from django import forms


class ScoreForm(forms.Form):
    name = forms.CharField(label="Name", max_length=100, initial="Your Name Here")
    final_score = forms.CharField(label="Final Score", max_length=10)

