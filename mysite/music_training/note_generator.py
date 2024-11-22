#generate answer string server side

# will need to find a way to have javascript take it. Maybe encrypt it first?

# first line of business: 

import json

import random

def medium_randomizer(notes):
    notes = min(notes, 15)

    note = {'time': 0, 'note': 'C4', 'velocity': 0.9}
    note_clone = note.copy()
    time_group = []
    note_group = []
    time = ""
    random_4th = 0
    random_16th = 0

    medium = [0, 2]

    for i in range(notes):
        while True:
            random_4th = random.randint(0, 3)
            random_16th = random.choice(medium)
            time = f"0:{random_4th}:{random_16th}"
            if time not in time_group:
                break
        time_group.append(time)

    time_group.sort()

    for time in time_group:
        note_clone['time'] = time
        note_group.append(note_clone)
        note_clone = note.copy()

    return note_group

song_answer = medium_randomizer(4)

print(json.dumps(song_answer))

# calculate when notes are played, and get valid input windows for answer

# will work on this on a different branch once basic high score function is wrapped up