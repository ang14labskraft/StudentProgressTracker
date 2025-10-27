import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service responsible for handling all student-related operations.
 * Provides methods for CRUD operations on student data through HTTP requests.
 * 
 * @remarks
 * This service communicates with the backend API at http://localhost:3000/students
 * 
 * @example
 * ```typescript
 * constructor(private studentService: StudentService) {
 *   // Get all students
 *   this.studentService.getAllStudents().subscribe(students => {
 *     console.log(students);
 *   });
 * }
 * ```
 */
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
     * @param student Student data without ID
     * @returns Observable<Student> Added student with generated UUID
     */
    addStudent(student: Omit<Student, 'id'>): Observable<Student> {
        const newStudent = {
            ...student,
            id: uuidv4()
        };
        return this.http.post<Student>(this.apiUrl, newStudent);
    }

    /**
     * Delete a student by ID
     * @param id ID of the student to delete
     * @returns Observable<void>
     */
    deleteStudent(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }

    /**
     * Get a single student by ID
     * @param id ID of the student to retrieve
     * @returns Observable<Student> The requested student
     */
    getStudentById(id: string): Observable<Student> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Student>(url);
    }

    /**
     * Update an existing student
     * @param id ID of the student to update
     * @param student Updated student data
     * @returns Observable<Student> The updated student
     */
    updateStudent(id: string, student: Omit<Student, 'id'>): Observable<Student> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Student>(url, { ...student, id });
    }
}