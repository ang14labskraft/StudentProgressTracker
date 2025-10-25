import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit {
  student: Student | null = null;
  loading: boolean = true;
  error: string | null = null;
  firstName: string = '';
  lastName: string = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadStudentDetails(id);
      }
    });
  }

  private loadStudentDetails(id: number): void {
    this.loading = true;
    this.error = null;

    this.studentService.getStudentById(id)
      .pipe(
        catchError(err => {
          console.error('Error loading student:', err);
          return of(null);
        })
      )
      .subscribe(student => {
        this.loading = false;
        if (student) {
          this.student = student;
          const nameParts = student.name.trim().split(' ');
          this.firstName = nameParts[0];
          this.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        } else {
          this.error = 'Student not found or an error occurred while loading the details.';
        }
      });
  }

  getGradeColor(grade: string): string {
    switch (grade.toUpperCase()) {
      case 'A':
        return 'grade-a';
      case 'B':
        return 'grade-b';
      case 'C':
        return 'grade-c';
      case 'D':
        return 'grade-d';
      default:
        return 'grade-f';
    }
  }
}
