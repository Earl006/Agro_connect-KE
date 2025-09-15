import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://agro-connect-ke.onrender.com/api/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all/users`, {
      headers: this.getAuthHeaders()
    });
  }
  approveFarmerRequest(userId: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/approve-farmer`,
      { userId },
      { headers: this.getAuthHeaders() }
    );
  }
  rejectFarmerRequest(userId: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/reject-farmer`,
      { userId },
      { headers: this.getAuthHeaders() }
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, data);
  }

  requestFarmerRole(userId: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/request-farmer`, 
      { userId },
      { headers: this.getAuthHeaders() }
    );
  }

  getFarmerRequests(skip = 0, take = 10): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/farmer/requests?skip=${skip}&take=${take}`, { headers: this.getAuthHeaders() });
  }

  getAllFarmers(skip = 0, take = 10): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/farmer/all?skip=${skip}&take=${take}`, { headers: this.getAuthHeaders() });
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/u/stats`, { headers: this.getAuthHeaders() });
  }
}
