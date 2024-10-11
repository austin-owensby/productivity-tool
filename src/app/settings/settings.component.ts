import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Settings, ShowGridBehavior } from '../models/settings';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatTabsModule,
    MatSliderModule,
    MatBadgeModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  dialogRef = inject(MatDialogRef<SettingsComponent>);
  settings = inject<Settings>(MAT_DIALOG_DATA);
  originalSettings = new Settings();
  showGridBehavior = ShowGridBehavior;

  ngOnInit() {
    this.originalSettings = structuredClone(this.settings);
  }

  onSaveClick(): void {
    this.dialogRef.close(this.settings);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onUndoClick(): void {
    this.settings = structuredClone(this.originalSettings);
  }

  onResetClick(): void {
    const id = this.settings.id;
    this.settings = new Settings();
    this.settings.id = id;
  }
}
