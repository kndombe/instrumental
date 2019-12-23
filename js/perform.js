let chords_dict = {
    C_Major: { main: [36, 48, 52, 55, 60], fill: [60, 62, 50, 67, 72, 74, 64, 55, 52] },
    D_minor: {
        main: [38, 50, 53, 57, 60],
        fill: [53, 60, 65, 57, 55, 52, 64, 65, 67, 69, 72, 76, 77]
    },
    E_minor: { main: [40, 52, 55, 59, 62], fill: [55, 62, 67, 59, 57, 50, 62, 67, 69, 71, 74] },
    F_Major: { main: [41, 52, 57, 60], fill: [60, 64, 55, 52, 67, 72, 76, 57, 55] },
    F_Major_on_G: { main: [43, 53, 57, 60], fill: [53, 60, 57, 48, 55, 57, 64, 65, 67, 69, 72] },
    A_minor: { main: [45, 52, 55, 60], fill: [52, 55, 64, 60, 48, 47, 57, 59, 60, 64, 67, 71] }
};

class Performer {
    constructor(chords) {
        this.chords = chords;
        this.current = 0;
        this.player = new Player();
        this.player.addInstrument("grand_piano");
    }

    async start() {
        await this.player.prepareOutput();
        let chords = JSON.parse(JSON.stringify(this.chords));
        let end = this.chords[this.chords.length - 1][2];
        let previous_chord = null;
        Performer._recursivePlay(chords, end, previous_chord, this.current, this.player);
    }

    static _recursivePlay(chords, end, previous_chord, current, player) {
        if (current >= end) return;

        if (current >= chords[0][2]) {
            chords.shift();
            if (chords.length == 0) {
                return;
            }
        }
        let beat = chords[0][2] - chords[0][1];
        let chord = chords[0][0];
        let conf = chords[0][3];
        if (chord != previous_chord) {
            player.allOff();
            console.log(chord);
        }
        previous_chord = previous_chord == null ? chord : previous_chord;
        if (beat >= 0.5) {
            Performer.playChord(chord, chords[0][3], chord != previous_chord, player);
        }
        let bar = beat / 4;
        current += bar;
        previous_chord = chord;
        setTimeout(function() {
            // console.log(chords);
            Performer._recursivePlay(chords, end, previous_chord, current, player);
        }, bar * 1000);
    }

    static playChord(chord, conf, main, player) {
        let main_notes = chords_dict[chord]["main"];
        let fill_notes = chords_dict[chord]["fill"];
        if (main) {
            for (let note of main_notes) {
                player.instruments["grand_piano"].note_on(note);
            }
        } else {
            for (let i = 0; i < 3; i++) {
                let fill_note = fill_notes[Math.floor(Math.random() * fill_notes.length - 1)];
                player.instruments["grand_piano"].note_on(fill_note);
            }
        }
    }
}

// let chords = [
//     ["F_Major_on_G", 0.0, 4.09, 0.42444444444444446],
//     ["C_Major", 4.09, 5.94, 0.46444444444444444],
//     ["D_minor", 5.94, 7.49, 0.4266666666666667],
//     ["E_minor", 7.49, 9.27, 0.4022222222222222],
//     ["F_Major_on_G", 9.27, 10.87, 0.4577777777777778],
//     ["C_Major", 10.87, 12.75, 0.4822222222222222],
//     ["D_minor", 12.75, 14.38, 0.4266666666666667],
//     ["E_minor", 14.38, 16.16, 0.4222222222222222],
//     ["F_Major_on_G", 16.16, 17.68, 0.43333333333333335],
//     ["C_Major", 17.68, 19.67, 0.45111111111111113],
//     ["D_minor", 19.67, 21.24, 0.4577777777777778],
//     ["E_minor", 21.24, 23.0, 0.4088888888888889],
//     ["F_Major_on_G", 23.0, 24.7, 0.44666666666666666],
//     ["C_Major", 24.7, 26.43, 0.4288888888888889],
//     ["D_minor", 26.43, 28.13, 0.43333333333333335],
//     ["E_minor", 28.13, 29.84, 0.39555555555555555],
//     ["F_Major_on_G", 29.84, 31.45, 0.33111111111111113],
//     ["D_minor", 31.45, 33.25, 0.4355555542310079],
//     ["E_minor", 33.25, 34.92, 0.4622222222222222],
//     ["F_Major", 34.92, 36.69, 0.4777777777777778],
//     ["E_minor", 36.69, 38.53, 0.37777777777777777],
//     ["D_minor", 38.53, 41.87, 0.32222222222222224],
//     ["F_Major_on_G", 41.87, 45.17, 0.44666666666666666],
//     ["C_Major", 45.17, 48.91, 0.4666666666666667],
//     ["D_minor", 48.91, 52.18, 0.4311111111111111],
//     ["F_Major_on_G", 52.18, 55.46, 0.46],
//     ["C_Major", 55.46, 58.82, 0.4533333333333333],
//     ["A_minor", 58.82, 60.52, 0.36666666666666664],
//     ["E_minor", 60.52, 62.32, 0.4266666666666667],
//     ["F_Major", 62.32, 64.02, 0.4622222222222222],
//     ["E_minor", 64.02, 65.94, 0.3977777777777778],
//     ["D_minor", 65.94, 67.67, 0.3844444444444444],
//     ["F_Major_on_G", 67.67, 69.33, 0.45555555555555555],
//     ["C_Major", 69.33, 72.46, 0.41555555555555557],
//     ["A_minor", 72.46, 74.2, 0.3466666666666667],
//     ["E_minor", 74.2, 76.19, 0.4911111111111111],
//     ["F_Major", 76.19, 77.81, 0.48000009597215365],
//     ["E_minor", 77.81, 79.53, 0.39111111111111113],
//     ["D_minor", 79.53, 81.41, 0.3933333333333333],
//     ["F_Major_on_G", 81.41, 82.8, 0.41555555555555557],
//     ["C_Major", 82.8, 84.79, 0.43777777777777777],
//     ["F_Major_on_G", 84.79, 86.24, 0.4177777777777778],
//     ["C_Major", 86.24, 88.16, 0.41555555555555557],
//     ["F_Major_on_G", 88.16, 89.76, 0.4422222222974561],
//     ["C_Major", 89.76, 91.55, 0.44],
//     ["F_Major_on_G", 91.55, 93.11, 0.45111111111111113],
//     ["C_Major", 93.11, 95.16, 0.4577777777777778],
//     ["F_Major_on_G", 95.16, 97.03, 0.42],
//     ["C_Major", 97.03, 102.82, 0.4677667096998046]
// ];

// window.onclick = function() {
//     p = new Performer(chords);
//     p.start();
// };
