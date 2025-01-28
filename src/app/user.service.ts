import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, Message } from './user.model';

const BASE_URL = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(BASE_URL);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${BASE_URL}/${id}`);
  }

  searchUsersByName(name: string): Observable<User[]> {
    const searchTerm = name.toLowerCase();
    return this.http.get<User[]>(BASE_URL).pipe(
      map(users => users.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
      ))
    );
  }

  searchUsersByCountry(country: string): Observable<User[]> {
    const searchTerm = country.toLowerCase();
    return this.http.get<User[]>(BASE_URL).pipe(
      map(users => users.filter(user => 
        user.country.toLowerCase().includes(searchTerm)
      ))
    );
  }

  getMessagesByUserId(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${BASE_URL}/${userId}/messageReceived`);
  }

  sendMessage(userId: number, message: Message): Observable<Message> {
    return this.http.post<Message>(`${BASE_URL}/${userId}/messageSent`, message);
  }

  updateUser(userId: number, user: User): Observable<User> {
    return this.http.put<User>(`${BASE_URL}/${userId}`, user);
  }
}