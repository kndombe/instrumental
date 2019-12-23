class Player {
    constructor() {
        this.instruments = {};
        this.coldStart = 8000;
    }

    prepareOutput() {
        return new Promise(r => {
            console.log("Preparing audio output");
            let cs = new Audio("../instruments/cold_start.wav");
            cs.play();
            setTimeout(r, this.coldStart);
        });
    }

    addInstrument(instrument) {
        this.instruments[instrument] = new Instrument(instrument);
    }

    allOff() {
        for (let instrument in this.instruments) {
            this.instruments[instrument].all_notes_off();
        }
    }
}

class Instrument {
    constructor(instrument) {
        this.notes = loadNotes(instrument);
        this.notes_on = [];
        this.coldStart = 8000;
    }

    note_on(note, volume) {
        if (!(`note_${note}` in this.notes)) return;
        if (this.notes_on.indexOf(note) > -1) {
            this.note_off(note);
        }
        if (!volume) {
            volume = 1;
        }
        this.notes[`note_${note}`].currentTime = 0;
        this.notes[`note_${note}`].volume = volume;
        this.notes[`note_${note}`].play();
        this.notes_on.push(note);
    }

    note_off(note) {
        if (!(`note_${note}` in this.notes)) return;
        let index = this.notes_on.indexOf(note);
        if (index > -1) {
            this.notes_on.splice(index, 1);
            this.notes[`note_${note}`].pause();
        }
    }

    all_notes_off() {
        for (let note of this.notes_on) {
            this.note_off(note);
        }
    }
}

function loadNotes(instrument) {
    notes = {};
    for (let i = 24; i <= 96; i++) {
        let path = `../instruments/${instrument}/note_${i}.wav`;
        try {
            audio = new Audio(path);
            notes[`note_${i}`] = audio;
        } catch (e) {}
    }

    return notes;
}

// window.onclick = async function() {
//     p = new Player();
//     p.addInstrument("grand_piano");
//     await p.prepareOutput();
//     note = 40;
//     setInterval(function() {
//         console.log(`Now playing ${note}`);
//         p.instruments["grand_piano"].note_on(note);
//         p.instruments["grand_piano"].note_on(note + 4);
//         p.instruments["grand_piano"].note_on(note + 7);
//         note++;
//     }, 1000);
// };
