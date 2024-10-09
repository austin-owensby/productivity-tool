import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../models/card';
import { CdkDragHandle, CdkDrag, Point, DragRef, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, AngularDraggableModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() card!: Card;
  @Input() gridSize!: number;
  @Input() gridElement!: HTMLElement;
  @Output() cardUpdated = new EventEmitter();
  @Output() cardDeleted = new EventEmitter();
  @ViewChild('cardElement') cardElement!: ElementRef;
  static zIndex = 1;

  computeDragRenderPos = (pos: Point, dragRef: DragRef) => {
    // Snap grid
    const snapObject = { x: Math.max(0, Math.floor(pos.x / this.gridSize) * this.gridSize), y: Math.max(0, Math.floor(pos.y / this.gridSize) * this.gridSize) };
    return snapObject;
  }

  handleDrop() {
    const transform = getComputedStyle(this.cardElement.nativeElement).getPropertyValue('transform');
    this.card.transform = transform;
    this.updateCard();
  }

  handleResize() {
    const style = getComputedStyle(this.cardElement.nativeElement);

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

  bringToFront = () => {
    CardComponent.zIndex++;
    this.cardElement.nativeElement.style.zIndex = CardComponent.zIndex.toString();
  }

  updateCard() {
    this.cardUpdated.emit();
  }

  deleteCard() {
    this.cardDeleted.emit();
  }
}
