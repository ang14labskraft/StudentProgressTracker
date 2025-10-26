import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      class: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
      section: ['', [Validators.required, Validators.pattern('^[A-Z]$')]],
      math: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      science: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      english: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      total: [{ value: 0, disabled: true }],
      grade: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = id;
      this.loadStudentData(this.studentId);
    }

    // Subscribe to changes in score fields
    this.studentForm.get('math')?.valueChanges.subscribe(() => this.calculateTotalAndGrade());
    this.studentForm.get('science')?.valueChanges.subscribe(() => this.calculateTotalAndGrade());
    this.studentForm.get('english')?.valueChanges.subscribe(() => this.calculateTotalAndGrade());
  }

  /**
   * Calculate total score and grade based on subject scores
   */
  private calculateTotalAndGrade(): void {
    const math = parseInt(this.studentForm.get('math')?.value || '0');
    const science = parseInt(this.studentForm.get('science')?.value || '0');
    const english = parseInt(this.studentForm.get('english')?.value || '0');

    const total = math + science + english;
    const percentage = (total / 300) * 100;

    let grade = '';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';
    else grade = 'F';

    this.studentForm.patchValue({
      total: total,
      grade: grade
    }, { emitEvent: false });
  }

  loadStudentData(id: string): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          name: student.name,
          class: student.class,
          section: student.section,
          math: student.math,
          science: student.science,
          english: student.english,
          total: student.total,
          grade: student.grade
        });
      },
      error: (error) => {
        console.error('Error loading student:', error);
        // Handle error appropriately
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.studentForm.valid) {
      const studentData = {
        name: this.studentForm.get('name')?.value,
        class: Number(this.studentForm.get('class')?.value),
        section: this.studentForm.get('section')?.value,
        math: Number(this.studentForm.get('math')?.value),
        science: Number(this.studentForm.get('science')?.value),
        english: Number(this.studentForm.get('english')?.value),
        total: Number(this.studentForm.get('total')?.value),
        grade: this.studentForm.get('grade')?.value
      };
      
      if (this.isEditMode && this.studentId) {
        this.studentService.updateStudent(this.studentId, studentData).subscribe({
          next: () => {
            this.toastService.showSuccess('Student updated successfully');
            this.router.navigate(['/students']);
          },
          error: (error) => {
            console.error('Error updating student:', error);
            this.toastService.showError('Failed to perform the operation');
          }
        });
      } else {
        this.studentService.addStudent(studentData).subscribe({
          next: () => {
            this.toastService.showSuccess('New student added successfully');
            this.router.navigate(['/students']);
          },
          error: (error) => {
            console.error('Error adding student:', error);
            this.toastService.showError('Failed to perform the operation');
          }
        });
      }
    }
  }

  // Helper method to check if a field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const control = this.studentForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern']) {
        switch (fieldName) {
          case 'class': return 'Class must be a number between 1 and 99';
          case 'section': return 'Section must be a single uppercase letter';
          default: return 'Invalid format';
        }
      }
      if (control.errors['min']) return `${fieldName} must be at least ${control.errors['min'].min}`;
      if (control.errors['max']) return `${fieldName} must be at most ${control.errors['max'].max}`;
    }
    return '';
  }
}
