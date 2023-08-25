import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-view-person',
  template: `
    <div *ngIf="person" class="person-details">
      <h3>{{ person.ad }} {{ person.soyad }}</h3>
      <p>Numara: {{ person.numara }}</p>
      <button class="btn btn-primary" (click)="closeDetails()">{{ 'Kapat' | translate }}</button>
    </div>
  `,
})
export class ViewPersonComponent {
  @Input() person: Person | undefined;
  @Output() close = new EventEmitter<void>();

  closeDetails() {
    this.close.emit();
  }
}