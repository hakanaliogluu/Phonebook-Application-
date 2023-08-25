import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { AuthService } from 'src/app/services/auth.service';
import { PersonService } from 'src/app/services/person.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core'; // Çeviri servisini ekleyin

@Component({
  selector: 'app-telephonebook',
  templateUrl: './telephonebook.component.html',
  styleUrls: ['./telephonebook.component.css']
})
export class TelephonebookComponent implements OnInit {

  @Output() personsUpdated = new EventEmitter<Person[]>();

  title = 'TelephoneBook';
  persons: Person[] = [];
  personToEdit?: Person;
  searchQuery: string = ''; 
  selectedPerson: Person | undefined;
  userName: string | undefined;
  sortBy: { column: string, direction: 'asc' | 'desc' } | null = null;

  constructor(
    private logOutAuth: AuthService,
    private personService: PersonService,
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadPersons();
    }, 0);

    this.authService.currentUser.subscribe(userInfo => {
      if (userInfo) {
        this.userName = userInfo.isim + ' ' + userInfo.soyisim;
      }
    });
  }

  loadPersons() {
    const currentUser = this.authService.currentUserValue; // Mevcut kullanıcı bilgisini al
    if (currentUser) {
      this.personService
        .getPersonsByUserId(currentUser.id) // currentUser'dan userId alabilirsiniz
        .subscribe((result: Person[]) => (this.persons = result));
    }
  }

  updatePersonList(persons: Person[]) {
    this.persons = persons;
  }

  // Yeni Kişi Ekle butonuna tıklandığında çağrılacak metot
  initNewPerson() {
    // Önce var olan görüntüleme formunu kapat
    this.closeViewForm();

    // Yeni Kişi Ekle formunu aç
    this.personToEdit = new Person();
  }

  // Düzenle butonuna tıklandığında çağrılacak metot
  editPerson(person: Person) {
      // Önce var olan görüntüleme formunu kapat
      this.closeViewForm();

      // Düzenleme formunu aç
      this.personToEdit = person;
  }

  // Görüntüleme formunu kapatmak için metot
  closeViewForm() {
      this.selectedPerson = undefined;
  }

  deletePerson(person: Person) {
    if (confirm(this.translateService.instant('deleteConfirmation'))) {
      this.personService.deletePerson(person).subscribe((persons: Person[]) => {
        this.personsUpdated.emit(persons);
        const successMessage = this.translateService.instant('deleteSuccessMessage');
        alert(this.translateService.instant(successMessage));
        this.persons = this.persons.filter((p) => p !== person);
      });
    }
  }

  logOut() {
    this.authService.removeToken();
    const successMessage = this.translateService.instant(
      'logOutSuccessMessage',
      {
        isim: this.logOutAuth.currentUser.getValue().isim,
        soyisim: this.logOutAuth.currentUser.getValue().soyisim,
      }
    );
    alert(successMessage);
    this.router.navigateByUrl('/login');
  }

   // Görüntüle butonuna tıklandığında çağrılacak metot
   viewPerson(person: Person) {
    // Önce var olan düzenleme veya ekleme formunu kapat
    this.closeEditForm();

    // Görüntüleme formunu aç
    this.selectedPerson = person;
  }

  // Düzenleme veya ekleme formunu kapatmak için metot
  closeEditForm() {
      this.personToEdit = undefined;
  }

  closePersonDetails() {
    this.selectedPerson = undefined;
  }

  closeFormAndEmit(persons: Person[]) {
    this.persons = persons;
    this.personToEdit = undefined;
  }

  filterPersons() {
    const query = this.searchQuery.toLowerCase();
    this.persons = this.persons.filter(
      person =>
        person.ad.toLowerCase().includes(query) ||
        person.soyad.toLowerCase().includes(query) ||
        person.numara.toLowerCase().includes(query)
    );
  }

  exportToExcel(): void {
    const data: any[] = this.persons.map((person) => [person.ad, person.soyad, person.numara]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['Ad', 'Soyad', 'Telefon'], ...data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rehber');
    
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(dataBlob, 'rehber.xlsx');
  }

  sortColumn(columnName: string) {
    if (this.sortBy && this.sortBy.column === columnName) {
      this.sortBy.direction = this.sortBy.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = { column: columnName, direction: 'asc' };
    }
  
    this.persons.sort((a, b) => {
      const valueA = a[columnName] as string;
      const valueB = b[columnName] as string;
      const comparison = valueA.localeCompare(valueB, 'tr', { sensitivity: 'base' });
      return this.sortBy!.direction === 'asc' ? comparison : -comparison;
      // Notice the ! after this.sortBy to tell TypeScript that it won't be null at this point
    });
  }
}