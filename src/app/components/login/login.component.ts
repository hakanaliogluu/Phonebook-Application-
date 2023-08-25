import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { Route } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginAuth: AuthService, private router: Router,private translateService: TranslateService
    ) { }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    sifre: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ])
  });

  isUserValid: boolean = false;

  isPasswordVisible: boolean = false;
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  loginSubmited() {
    this.loginAuth.loginUser([this.loginForm.value.email, this.loginForm.value.sifre]).subscribe((res) => {
      if (res == 'Failure') {
        this.isUserValid = false;
        const errorMessage = this.translateService.instant('loginFailureMessage');
        alert(errorMessage);
      } else {
        this.isUserValid = true;
        this.loginAuth.setToken(res);
        const successMessage = this.translateService.instant(
          'loginSuccessMessage',
          {
            isim: this.loginAuth.currentUser.getValue().isim,
            soyisim: this.loginAuth.currentUser.getValue().soyisim,
          }
        );
        alert(successMessage);
        this.router.navigateByUrl('/telephonebook');
      }
    });
  }
  
  get EMail(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get Sifre(): FormControl {
    return this.loginForm.get('sifre') as FormControl;
  }

}