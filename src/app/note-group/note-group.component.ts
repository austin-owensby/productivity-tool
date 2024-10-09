import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note, NoteGroup } from '../models/note-group';
import { CdkDragPlaceholder, CdkDragHandle, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-group',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragHandle, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './note-group.component.html',
  styleUrl: './note-group.component.scss'
})
export class NoteGroupComponent {
  @Input() noteGroup!: NoteGroup;
  @Output() noteGroupUpdated = new EventEmitter<number>();
  
  drop(event: CdkDragDrop<Note[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const parentElement = event.previousContainer.element.nativeElement.closest(".card");

      if (parentElement == null) {
        console.error('Unable to find the note group the note previously belonged to.');
        return;
      }

      const idParts = parentElement.id.split('-');
      if (idParts.length == 0) {
        console.error(`Unable to find a valid id from '${parentElement.id}' for the note group.`);
        return;
      }

      const id = parseInt(idParts[idParts.length - 1]);
      if (isNaN(id)) {
        console.error(`Unable to parse a valid id from '${idParts[idParts.length - 1]}' for the note group.`);
        return;
      }

      this.noteGroupUpdated.emit(id);
    }

    this.updateNoteGroup();
  }

  updateNoteGroup() {
    this.noteGroupUpdated.emit(this.noteGroup.id);
  }

  createNewNote() {
    const newNote = new Note();

    this.noteGroup.notes.push(newNote);

    this.updateNoteGroup();
  }

  deleteNote(index: number) {
    this.noteGroup.notes.splice(index, 1);
    this.updateNoteGroup();
  }
}
