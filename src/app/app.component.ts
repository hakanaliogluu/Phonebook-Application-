import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from './models/person';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Output() personsUpdated = new EventEmitter<Person[]>();

  title = 'TelephoneBook';
  isDarkModeEnabled: boolean = false;
  
  constructor(private translate: TranslateService, private authService: AuthService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('tr');
    this.authService.loadCurrentUser();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  toggleDarkMode() {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;
  
    if (this.isDarkModeEnabled) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode'); // Light mod stilini kaldır
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode'); // Light mod stilini ekle
    }
  }
  
}
