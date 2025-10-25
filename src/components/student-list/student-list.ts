import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';

interface StudentWithNames extends Student {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  students: StudentWithNames[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  private splitName(fullName: string): { firstName: string; lastName: string } {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    return { firstName, lastName };
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;
    
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data.map(student => ({
          ...student,
          ...this.splitName(student.name)
        }));
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load students. Please try again later.';
        this.loading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(student => student.id !== id);
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student. Please try again.');
        }
      });
    }
  }
}
