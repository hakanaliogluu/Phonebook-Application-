import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { BehaviorSubject, using } from 'rxjs';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  baseServerUrl = "https://localhost:7108/api/";

  jwtHelperService = new JwtHelperService();

  get currentUserValue(): any {
    return this.currentUser.getValue();
  }

  registerUser(user: Array<any>) {
    return this.http.post(this.baseServerUrl + 'User/CreateUser', {
      Isim: user[0],
      SoyIsim: user[1],
      EMail: user[2],
      TelefonNumarasi: user[3],
      Cinsiyet: user[4],
      Sifre: user[5]
    }, 
    {
      responseType: 'text',
    }); 
  }

  loginUser(loginInfo: Array<any>) {
    return this.http.post(this.baseServerUrl + 'User/LoginUser', {
      EMail: loginInfo[0],
      Sifre: loginInfo[1]
    }, 
    {
      responseType: 'text',
    }); 
  }

  setToken(token: string) {
    localStorage.setItem("access_token", token);
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const token = localStorage.getItem("access_token");
    if (token) {
      const userInfo = this.jwtHelperService.decodeToken(token);
  
      const data = {
        id: userInfo.id,
        isim: userInfo.isim,
        soyisim: userInfo.soyisim,
        email: userInfo.email,
        telefonnumarasi: userInfo.telefonnumarasi,
        cinsiyet: userInfo.cinsiyet
      };
      this.currentUser.next(data);
    }
  }
  

  isLoggedin(): boolean {
    return this.currentUser.getValue() !== null;
  }

  removeToken() {
    localStorage.removeItem("acces_token");
  }
}