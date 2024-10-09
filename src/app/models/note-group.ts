import { Card } from "./card";

export class NoteGroup extends Card {
    public title: string = "";
    public notes: Note[] = [];
}

export class Note {
    public content: string = "";
}