function keyboard(tempo) {
    let synth = new Tone.Synth().toDestination();

    const reverb = new Tone.Reverb({
        decay: 4,
        wet: 0.2,
        preDelay: 0.0,
    });

    reverb.generate();

    const effect = new Tone.FeedbackDelay(`${Math.floor(2 / 2)}n`, 1 / 2);
    effect.wet.value = 0.2;

    synth.set({
        voice0: {
            oscillator: {
            type: "triangle",
            },
        volume: -30,
        envelope: { attack: 0.005, release: 0.05, sustain: 1, },
        },
        voice1: {
            volume: -20,
            envelope: { attack: 0.005, release: 0.05, sustain: 1, },
        },
    });

    effect.connect(reverb);
    reverb.connect(Tone.Destination);

    Tone.Transport.bpm.value = tempo;

    Tone.start();

    return synth;
}

function fourByFour() {
    const kickDrum = new Tone.MembraneSynth({
        volume: 4
    }).toDestination();

    const kickPart = new Tone.Part(function(time) {
        kickDrum.triggerAttackRelease('C1', '8n', time);
    }, [{ time: '0:0' },{ time: '0:1' },{ time: '0:2' },{ time: '0:3' }]).start(0);

    kickPart.loop = true;

    return kickPart;
}

export { keyboard, fourByFour };