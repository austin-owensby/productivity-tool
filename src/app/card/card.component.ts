import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../models/card';
import {
  CdkDragPlaceholder,
  CdkDragHandle,
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
  selector: 'app-card',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragHandle, AngularDraggableModule, MatInputModule, MatFormFieldModule, FormsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() card!: Card;
  @Input() gridSize!: number;
  @Input() gridElement!: HTMLElement;
  @Output() cardDeleted = new EventEmitter<number>();
  @Output() noteGroupCreated = new EventEmitter();

  computeDragRenderPos = (pos: Point, dragRef: DragRef) => {
    // Snap grid
    const snapObject = {x: Math.max(0, Math.floor(pos.x / this.gridSize) * this.gridSize), y: Math.max(0, Math.floor(pos.y / this.gridSize) * this.gridSize)};
    return snapObject;
  }

  constructor(private dbService: NgxIndexedDBService) {
  }

  handleDrop() {
    const element = document.getElementById(`card-${this.card.id}`);
    if (element == null) {
      console.error(`Unable to find html element with id 'card-${this.card.id}'`);
      return;
    }
    
    const transform = getComputedStyle(element).getPropertyValue('transform');
    this.card.transform = transform;
    this.updateCard();
  }

  handleResize() {
    const element = document.getElementById(`card-${this.card.id}`);
    if (element == null) {
      console.error(`Unable to find html element with id 'card-${this.card.id}'`);
      return;
    }

    const style = getComputedStyle(element);
    
    const width = style.getPropertyValue('width');
    this.card.width = width;
    const height = style.getPropertyValue('height');
    this.card.height = height;
    const left = style.getPropertyValue('left');
    this.card.left = left;
    const top = style.getPropertyValue('top');
    this.card.top = top;

    this.updateCard();
  }

  updateCard() {
    this.dbService.update('emptyCards', this.card).subscribe();
  }

  deleteCard() {
    this.dbService.delete('emptyCards', this.card.id!).subscribe(() => {
      this.cardDeleted.emit(this.card.id);
    });
  }

  createNoteGroup() {
    this.noteGroupCreated.emit();
  }
}
