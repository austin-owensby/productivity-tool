import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note, NoteGroup } from '../models/note-group';
import {
  CdkDragPlaceholder,
  CdkDragHandle,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  Point,
  DragRef,
} from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Key, NgxIndexedDBService } from 'ngx-indexed-db';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-note-group',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragHandle, AngularDraggableModule, MatInputModule, MatFormFieldModule, FormsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './note-group.component.html',
  styleUrl: './note-group.component.scss'
})
export class NoteGroupComponent {
  @Input() noteGroup!: NoteGroup;
  @Input() gridSize!: number;
  @Input() gridElement!: HTMLElement;
  @Output() noteGroupUpdated = new EventEmitter<number>();
  @Output() noteGroupDeleted = new EventEmitter<number>();

  computeDragRenderPos = (pos: Point, dragRef: DragRef) => {
    // Snap grid
    const snapObject = {x: Math.max(0, Math.floor(pos.x / this.gridSize) * this.gridSize), y: Math.max(0, Math.floor(pos.y / this.gridSize) * this.gridSize)};
    return snapObject;
  }

  constructor(private dbService: NgxIndexedDBService) {
  }
  
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

      const parentElement = event.previousContainer.element.nativeElement.closest(".note-group");

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
    this.dbService.update('noteGroups', this.noteGroup).subscribe();
  }

  handleDrop() {
    const element = document.getElementById(`note-group-${this.noteGroup.id}`);
    if (element == null) {
      console.error(`Unable to find html element with id 'note-group-${this.noteGroup.id}'`);
      return;
    }
    
    const transform = getComputedStyle(element).getPropertyValue('transform');
    this.noteGroup.transform = transform;
    this.updateNoteGroup();
  }

  handleResize() {
    const element = document.getElementById(`note-group-${this.noteGroup.id}`);
    if (element == null) {
      console.error(`Unable to find html element with id 'note-group-${this.noteGroup.id}'`);
      return;
    }

    const style = getComputedStyle(element);
    
    const width = style.getPropertyValue('width');
    this.noteGroup.width = width;
    const height = style.getPropertyValue('height');
    this.noteGroup.height = height;
    const left = style.getPropertyValue('left');
    this.noteGroup.left = left;
    const top = style.getPropertyValue('top');
    this.noteGroup.top = top;

    this.updateNoteGroup();
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

  deleteNoteGroup() {
    this.dbService.delete('noteGroups', this.noteGroup.id!).subscribe(() => {
      this.noteGroupDeleted.emit(this.noteGroup.id);
    });
  }
}
