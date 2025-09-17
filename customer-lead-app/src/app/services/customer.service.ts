// src/app/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = 'http://localhost:5270/api/customer';

  constructor(private http: HttpClient) { }

  getCustomer(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getImages(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/images`);
  }

  uploadImage(id: string, base64: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/${id}/images`, base64);
  }


  uploadImages(id: string, base64Images: string[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/${id}/images`, base64Images);
  }

  deleteImage(customerId: string, imageId: string) {
    return this.http.delete<any[]>(`${this.apiUrl}/${customerId}/images/${imageId}`);
  }
}
