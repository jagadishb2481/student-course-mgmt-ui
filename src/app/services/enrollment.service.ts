import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8081/enrollments'; 
  getEnrollmentsByStudentId(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student/${studentId}/courses`);
  }

  enrollStudentInCourses(studentId: number, courseIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrollStudentInCourses`, { studentId, courseIds });
  }

  deleteEnrollment(studentId: number, courseId: number) {
    return this.http.delete(`${this.apiUrl}/${studentId}/courses/${courseId}`);
  }

}
