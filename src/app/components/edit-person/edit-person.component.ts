import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css']
})
export class EditPersonComponent implements OnInit {
  @Input() person?: Person | undefined; // Initialize as undefined
  @Output() personsUpdated = new EventEmitter<Person[]>();

  persons: Person[] = [];

  constructor(private personService: PersonService, private authService: AuthService,private translateService: TranslateService
    ) { }

  ngOnInit(): void {
  }

  updatePerson(person: Person) {
    if (this.isValidPerson(person)) {
      this.personService.updatePerson(person).subscribe(() => {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.personService.getPersonsByUserId(currentUser.id).subscribe((result: Person[]) => {
            this.personsUpdated.emit(result);
            this.closeForm();
            const successMessage = this.translateService.instant('updateSuccessMessage');
            alert(successMessage);
          });
        }
      });
    }
  }

  deletePerson(person: Person) {
    const confirmMessage = this.translateService.instant('confirmDelete');
    if (confirm(confirmMessage)) {
      this.personService.deletePerson(person).subscribe((persons: Person[]) => {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.personService.getPersonsByUserId(currentUser.id).subscribe((result: Person[]) => {
          this.personsUpdated.emit(result);
          this.closeForm();
          const successMessage = this.translateService.instant('deleteSuccessMessage');
          alert(successMessage);
          this.persons = result; // Update the local persons array with the new data
        });
        }
      });
    }
  }
  

  createPerson(person: Person) {
    if (this.isValidPerson(person)) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        this.personService.createPerson(person, currentUser.id).subscribe((persons: Person[]) => {
          this.personsUpdated.emit(persons);
          this.closeForm();
          const successMessage = this.translateService.instant('createSuccessMessage');
          alert(successMessage);
        });
      }
    }
  }
  
  // Düzenleme veya ekleme formunu kapatmak için metot
  closeForm() {
    this.person = undefined;
  }

  private isValidPerson(person: Person): boolean {
    // Perform validation checks here
    // For example, check if the required fields are not empty
    if (!person.ad || person.ad.trim() === '') {
      alert('Ad alanı boş bırakılamaz.');
      return false;
    }
    if (!person.soyad || person.soyad.trim() === '') {
      alert('Soyad alanı boş bırakılamaz.');
      return false;
    }
    if (!person.numara || person.numara.trim() === '') {
      alert('Numara alanı boş bırakılamaz.');
      return false;
    }

    // Add more validation checks if needed

    return true;
  }
}
