export class Settings {
    public id?: number;

    public gridSize: number = 50;
    public showGridBehavior: ShowGridBehavior = ShowGridBehavior.edit;

    public editViewIsDefault: boolean = false;
    public deleteCardInReadonly: boolean = false;
    public dragCardInReadonly: boolean = false;
    public resizeCardInReadonly: boolean = false;
    public updateNoteGroupTitleInReadonly: boolean = false;
    public deleteNoteInReadonly: boolean = true;
    public addNoteInReadonly: boolean = true;
    public updateNoteInReadonly: boolean = true;
    public dragNoteInReadonly: boolean = true;

    public backgroundColor: string = "#bbbbbb";
    public gridLineColor: string = "#000000";

    public emptyCardColor: string = "#ffffff";
    public emptyCardTextColor: string = "#000000";
    public emptyCardButtonColor: string = "#00006e";
    public emptyCardButtonBackgroundColor: string = "#e0e0ff";

    public noteGroupColor: string = "#ffffff";
    public noteGroupTextColor: string = "#000000";
    public noteGroupButtonColor: string = "#00006e";
    public noteGroupButtonBackgroundColor: string = "#e0e0ff";
    public noteColor: string = "#ffffff";
    public noteTextColor: string = "#000000";
    public noteButtonColor: string = "#00006e";
    public noteButtonBackgroundColor: string = "#e0e0ff";
}

export enum ShowGridBehavior {
    never,
    edit,
    always
}