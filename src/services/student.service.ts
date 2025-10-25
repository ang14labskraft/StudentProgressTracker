import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private apiUrl = 'http://localhost:3000/students';

    constructor(private http: HttpClient) { }

    /**
     * Get all students from the API
     * @returns Observable<Student[]> List of all students
     */
    getAllStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(this.apiUrl);
    }

    /**
     * Add a new student
     * @param student Student object to be added
     * @returns Observable<Student> Added student with generated ID
     */
    addStudent(student: Student): Observable<Student> {
        return this.http.post<Student>(this.apiUrl, student);
    }

    /**
     * Delete a student by ID
     * @param id ID of the student to delete
     * @returns Observable<void>
     */
    deleteStudent(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }

    /**
     * Get a single student by ID
     * @param id ID of the student to retrieve
     * @returns Observable<Student> The requested student
     */
    getStudentById(id: number): Observable<Student> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Student>(url);
    }
}