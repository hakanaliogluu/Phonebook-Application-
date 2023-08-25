import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private url = "Person";

  constructor(private http: HttpClient) { }

  public getPersonsByUserId(userId: number | undefined): Observable<Person[]> {
    return this.http.get<Person[]>(`${environment.apiUrl}/${this.url}/${userId}`);
  }
  public updatePerson(person:Person): Observable<Person[]> {
    return this.http.put<Person[]>(
      `${environment.apiUrl}/${this.url}`, person);
  }

  public createPerson(person: Person, userId: number | undefined): Observable<Person[]> {
    return this.http.post<Person[]>(
      `${environment.apiUrl}/${this.url}?userId=${userId}`, person);
  }  

  public deletePerson(person:Person): Observable<Person[]> {
    return this.http.delete<Person[]>(
      `${environment.apiUrl}/${this.url}/${person.id}`);
  }
}