import { Component } from '@angular/core';
import { NoteGroupComponent } from "./note-group/note-group.component";
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {MatSliderModule} from '@angular/material/slider';
import { NoteGroup } from './models/note-group';
import { Settings } from './models/settings';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Card, CardType } from './models/card';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NoteGroupComponent, CardComponent, CdkDropListGroup, MatProgressSpinnerModule, MatSliderModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading = true;
  gridSize: number = 0;
  backgroundSize: string = '';
  cards: Card[] = [];
  noteGroups: NoteGroup[] = [];

  constructor(private dbService: NgxIndexedDBService) {
    this.fetchSettings(() => this.loadData());
  }

  private fetchSettings(callback?: Function) {
    this.dbService.getAll<Settings>('settings').subscribe((settingsList) => {
      if (settingsList.length == 0) {
        // Create a new setting
        console.log("No existing settings could be found, creating a new one...");

        const newSettings: Settings = {
          gridSize: 50
        };

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
    this.gridSize = settings.gridSize;
    this.backgroundSize = `${this.gridSize}px ${this.gridSize}px`;
  }

  private loadData() {
    this.dbService.getAll<Card>('emptyCards').subscribe((cards) => {
      this.cards = cards;

      this.dbService.getAll<NoteGroup>('noteGroups').subscribe((noteGroups) => {
        this.noteGroups = noteGroups;
  
        this.loading = false;
      });
    });
  }

  createCard() {
    const newCard: Card = {
      height: "200px",
      width: "400px",
      left: "0",
      top: "0",
      transform: 'matrix(1, 0, 0, 1, 0, 0)',
      type: CardType.empty
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
      this.noteGroups.push(noteGroup);
      this.dbService.delete('emptyCards', card.id!).subscribe(() => {
        this.deleteCard(card.id!);
      });
    });
  }

  updateNoteGroup(id: number) {
    const noteGroup = this.noteGroups.find(n => n.id == id);

    if (noteGroup == null) {
      console.error(`Unable to find the note group ${id} the note previously belonged to.`);
      return;
    }

    this.dbService.update('noteGroups', noteGroup).subscribe();
  }

  deleteNoteGroup(id: number) {
    const cardGroupIndex = this.noteGroups.findIndex(n => n.id == id);

    if (cardGroupIndex == null) {
      console.error(`Unable to find the note group ${id} to delete it.`);
      return;
    }

    this.noteGroups.splice(cardGroupIndex, 1);
  }

  deleteCard(id: number) {
    const cardIndex = this.cards.findIndex(n => n.id == id);

    if (cardIndex == null) {
      console.error(`Unable to find the card ${id} to delete it.`);
      return;
    }

    this.cards.splice(cardIndex, 1);
  }
}
