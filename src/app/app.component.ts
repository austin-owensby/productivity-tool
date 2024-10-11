import { Component, inject } from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { NoteGroup } from './models/note-group';
import { Settings, ShowGridBehavior } from './models/settings';
import { Card, CardType } from './models/card';
import { CardComponent } from './card/card.component';
import { NoteGroupComponent } from "./note-group/note-group.component";
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NoteGroupComponent, CardComponent, CdkDropListGroup, MatProgressSpinnerModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading = true;
  settings: Settings = new Settings();
  gridSize: number = 0;
  backgroundSize: string = '';
  backgroundImage: string = 'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px);';
  editing = false;
  cards: Card[] = [];
  cardType = CardType;
  dialog = inject(MatDialog);

  constructor(private dbService: NgxIndexedDBService) {
    this.fetchSettings(() => this.loadData());
  }

  private fetchSettings(callback?: Function) {
    this.dbService.getAll<Settings>('settings').subscribe((settingsList) => {
      if (settingsList.length == 0) {
        // Create a new setting
        console.log("No existing settings could be found, creating a new one...");

        const newSettings: Settings = new Settings();
        delete newSettings.id;

        this.dbService.add('settings', newSettings).subscribe((settings) => {
          this.applySettings(settings);

          if (callback) {
            callback();
          }
        });
      }
      else {
        if (settingsList.length > 1) {
          console.warn(`Found ${settingsList.length} settings, choosing the first settings found.`);
        }

        this.applySettings(settingsList[0]);

        if (callback) {
          callback();
        }
      }
    });
  }

  private applySettings(settings: Settings) {
    this.settings = settings;
    this.gridSize = settings.gridSize;
    this.backgroundSize = `${this.gridSize}px ${this.gridSize}px`;
    this.editing = settings.editViewIsDefault;

    document.getElementsByTagName('body')[0].style.background = settings.backgroundColor;
    this.backgroundImage = `linear-gradient(to right, ${settings.gridLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${settings.gridLineColor} 1px, transparent 1px)`;
  }

  private loadData() {
    this.cards = [];
    this.dbService.getAll<Card>('emptyCards').subscribe((cards) => {
      this.cards.push(...cards);

      this.dbService.getAll<NoteGroup>('noteGroups').subscribe((noteGroups) => {
        this.cards.push(...noteGroups);

        this.loading = false;
      });
    });
  }

  showGrid() {
    switch (this.settings.showGridBehavior) {
      case ShowGridBehavior.never:
        return false;
      case ShowGridBehavior.edit:
        return this.editing;
      case ShowGridBehavior.always:
        return true;
    }
  }

  createCard() {
    const newCard: Card = {
      height: "200px",
      width: "400px",
      left: "0",
      top: "0",
      transform: 'matrix(1, 0, 0, 1, 0, 0)',
      type: CardType.emptyCard
    };

    this.dbService.add('emptyCards', newCard).subscribe((card) => {
      this.cards.push(card);
    });
  }

  createNoteGroup(card: Card) {
    const newNoteGroup: NoteGroup = {
      height: card.height,
      width: card.width,
      left: card.left,
      top: card.top,
      transform: card.transform,
      type: CardType.noteGroup,
      title: '',
      notes: []
    };

    this.dbService.add('noteGroups', newNoteGroup).subscribe((noteGroup) => {
      this.cards.push(noteGroup);
      this.deleteCard(card);
    });
  }

  updateCard(card: Card) {
    this.dbService.update(card.type, card).subscribe();
  }

  deleteCard(card: Card) {
    const cardIndex = this.cards.findIndex(n => n.id == card.id && n.type == card.type);

    if (cardIndex == null) {
      console.error(`Unable to find the ${card.type} ${card.id} to delete it.`);
      return;
    }

    this.cards.splice(cardIndex, 1);

    this.dbService.delete(card.type, card.id!).subscribe();
  }

  castToNoteGroup(card: Card) {
    return card as NoteGroup;
  }

  getNoteCardById(id: number) {
    const noteCard = this.cards.find(c => c.id == id && c.type == CardType.noteGroup);

    return noteCard!;
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsComponent, {
      data: structuredClone(this.settings),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.dbService.update('settings', result).subscribe(() => {
          this.applySettings(result);
        });
      }
    });
  }
}
