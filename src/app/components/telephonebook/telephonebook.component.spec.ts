import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonebookComponent } from './telephonebook.component';

describe('TelephonebookComponent', () => {
  let component: TelephonebookComponent;
  let fixture: ComponentFixture<TelephonebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelephonebookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelephonebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
