// This needs to stay in sync with the app.config.ts store name
export enum CardType {
    emptyCard = 'emptyCards',
    noteGroup = 'noteGroups'
}

export class Card {
    public id?: number;
    public height: string = "";
    public width: string = "";
    public left: string = "";
    public top: string = "";
    public transform: string = "";
    public type: CardType = CardType.emptyCard;
}