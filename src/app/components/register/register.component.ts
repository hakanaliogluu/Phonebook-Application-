import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // Çeviri servisini ekleyin

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  repeatPass: string = 'none';

  displayMsg: string = '';
  isAccountCreated: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
    ) { }

  ngOnInit(): void {
  }

  registerForm = new FormGroup( {
    isim: new FormControl('', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern("[a-zA-Z].*"),
    ]),
    soyisim: new FormControl("", [
      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern("[a-zA-Z].*"),
    ]),
    email: new FormControl("", [
      Validators.required, 
      Validators.email
    ]),
    telefonnumarasi: new FormControl('',[
      Validators.required,
      Validators.pattern("[0-9]*"),
      Validators.minLength(11), 
      Validators.maxLength(11),
    ]),
    cinsiyet: new FormControl("", [Validators.required]),
    sifre: new FormControl("", [
      Validators.required, 
      Validators.minLength(6),
      Validators.maxLength(15)]),
    sifreyeniden: new FormControl(''),
  });

  registerSubmited() {
    if (this.Sifre.value == this.SifreYeniden.value) {
      console.log("submited");
      this.repeatPass = 'none';

      this.authService.registerUser([
        this.registerForm.value.isim,
        this.registerForm.value.soyisim,
        this.registerForm.value.email,
        this.registerForm.value.telefonnumarasi,
        this.registerForm.value.cinsiyet,
        this.registerForm.value.sifre,
      ]).subscribe(res => {
        if (res == 'Success') {
          this.displayMsg = this.translateService.instant('accountCreatedSuccess');
          this.isAccountCreated = true;
        } else if (res == 'Already Exits') {
          this.displayMsg = this.translateService.instant('accountAlreadyExist');
          this.isAccountCreated = false;
        } else {
          this.displayMsg = this.translateService.instant('somethingWentWrong');
          this.isAccountCreated = false;
          alert(this.translateService.instant('newUserRegisteredSuccess'));
          this.router.navigateByUrl('/login');
        }     
      });
    } else {
      this.repeatPass = 'inline';
    }
  }
  
  register() {
    this.router.navigateByUrl('/login');
  }

  get Isim(): FormControl {
    return this.registerForm.get("isim") as FormControl;
  }

  get SoyIsim(): FormControl {
    return this.registerForm.get('soyisim') as FormControl;
  }

  get EMail(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get TelefonNumarasi(): FormControl {
    return this.registerForm.get('telefonnumarasi') as FormControl;
  }

  get Cinsiyet(): FormControl {
    return this.registerForm.get('cinsiyet') as FormControl;
  }

  get Sifre(): FormControl {
    return this.registerForm.get('sifre') as FormControl;
  }

  get SifreYeniden(): FormControl {
    return this.registerForm.get('sifreyeniden') as FormControl;
  }
}