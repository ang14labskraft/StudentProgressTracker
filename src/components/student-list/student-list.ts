import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { ToastService } from '../../services/toast.service';
import { ChatComponent } from '../chat/chat.component';

interface StudentWithNames extends Student {
  firstName: string;
  lastName: string;
}

/**
 * Component for displaying and managing the list of students.
 * Provides functionality for viewing, filtering, sorting, and deleting students.
 * 
 * @implements {OnInit}
 * 
 * @example
 * ```html
 * <app-student-list></app-student-list>
 * ```
 */
@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ChatComponent
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  students: StudentWithNames[] = [];
  filteredStudents: StudentWithNames[] = [];
  uniqueClasses: string[] = [];
  uniqueSections: string[] = [];
  loading: boolean = true;
  error: string | null = null;

  sortField: keyof StudentWithNames | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  filters = {
    name: '',
    class: '',
    section: ''
  };

  constructor(
    private studentService: StudentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  private splitName(fullName: string): { firstName: string; lastName: string } {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    return { firstName, lastName };
  }

  sort(field: keyof StudentWithNames): void {
    if (this.sortField === field) {
      // If clicking the same field, toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a new field, set it as sort field and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters(); // This will also apply sorting
  }

  getSortIcon(field: keyof StudentWithNames): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  applyFilters(): void {
    let filtered = [...this.students];

    // Apply filters
    if (this.filters.name) {
      const searchTerm = this.filters.name.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm)
      );
    }

    if (this.filters.class) {
      filtered = filtered.filter(student => student.class.toString() === this.filters.class);
    }

    if (this.filters.section) {
      filtered = filtered.filter(student => student.section === this.filters.section);
    }

    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortField!];
        const bValue = b[this.sortField!];
        
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredStudents = filtered;
  }

  private updateUniqueValues(): void {
    this.uniqueClasses = [...new Set(this.students.map(s => s.class.toString()))].sort();
    this.uniqueSections = [...new Set(this.students.map(s => s.section))].sort();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;
    
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data.map(student => ({
          ...student,
          ...this.splitName(student.name)
        }));
        this.updateUniqueValues();
        this.filteredStudents = [...this.students];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load students. Please try again later.';
        this.loading = false;
        console.error('Error loading students:', error);
        this.toastService.showError('Failed to perform the operation');
      }
    });
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(student => student.id !== id);
          this.filteredStudents = this.filteredStudents.filter(student => student.id !== id);
          this.updateUniqueValues();
          this.toastService.showSuccess('Student deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          this.toastService.showError('Failed to perform the operation');
        }
      });
    }
  }
}
