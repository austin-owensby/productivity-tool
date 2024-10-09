export enum CardType {
    empty,
    noteGroup
}

export class Card {
    public id?: number;
    public height: string = "";
    public width: string = "";
    public left: string = "";
    public top: string = "";
    public transform: string = "";
    public type: CardType = CardType.empty;
}