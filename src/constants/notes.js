const AMinorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const AllNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FourOnTheFloorTest = [
   { time: "0:0:0", note: "C4", velocity: 0.9 },
   { time: "0:1:0", note: "C4", velocity: 0.9 },
   { time: "0:2:0", note: "C4", velocity: 0.9 },
   { time: "0:3:0", note: "C4", velocity: 0.9 },
   { time: "1:0:0", note: "C4", velocity: 0.9 },
   { time: "1:1:0", note: "C4", velocity: 0.9 },
   { time: "1:2:0", note: "C4", velocity: 0.9 },
   { time: "1:3:0", note: "C4", velocity: 0.9 }
];
const StaticNotes = [
    { time: 0, note: "C3", velocity: 0.9 },
    { time: "0:2", note: "G3", velocity: 0.5 },
    { time: "0:3:1", note: "C4", velocity: 0.5 },
    { time: "0:3:3", note: "C4", velocity: 0.5 }
];

export const STATIC_LIBRARY = [AMinorScale, AllNotes, FourOnTheFloorTest, StaticNotes];