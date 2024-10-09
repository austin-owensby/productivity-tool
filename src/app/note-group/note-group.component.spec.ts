import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteGroupComponent } from './note-group.component';

describe('NoteGroupComponent', () => {
  let component: NoteGroupComponent;
  let fixture: ComponentFixture<NoteGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
