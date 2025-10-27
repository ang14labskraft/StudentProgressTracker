import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models/student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const mockStudent: Student = {
    id: '1',
    name: 'John Doe',
    class: 10,
    section: 'A',
    math: 85,
    science: 90,
    english: 88,
    total: 263,
    grade: 'A'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllStudents', () => {
    it('should return an array of students', () => {
      const mockStudents: Student[] = [mockStudent];

      service.getAllStudents().subscribe(students => {
        expect(students).toEqual(mockStudents);
      });

      const req = httpMock.expectOne('http://localhost:3000/students');
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
    });
  });

  describe('addStudent', () => {
    it('should add a new student', () => {
      const { id, ...newStudent } = mockStudent;

      service.addStudent(newStudent).subscribe(student => {
        expect(student).toBeTruthy();
        expect(student.id).toBeTruthy(); // Should have an ID
        expect(student.name).toBe(newStudent.name);
      });

      const req = httpMock.expectOne('http://localhost:3000/students');
      expect(req.request.method).toBe('POST');
      req.flush({ ...newStudent, id: '1' });
    });
  });

  describe('updateStudent', () => {
    it('should update an existing student', () => {
      const updatedStudent = { ...mockStudent, name: 'Jane Doe' };

      service.updateStudent(updatedStudent).subscribe(student => {
        expect(student).toEqual(updatedStudent);
      });

      const req = httpMock.expectOne(`http://localhost:3000/students/${mockStudent.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedStudent);
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', () => {
      service.deleteStudent(mockStudent.id).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`http://localhost:3000/students/${mockStudent.id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getStudentById', () => {
    it('should return a student by ID', () => {
      service.getStudentById(mockStudent.id).subscribe(student => {
        expect(student).toEqual(mockStudent);
      });

      const req = httpMock.expectOne(`http://localhost:3000/students/${mockStudent.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
    });

    it('should handle student not found', () => {
      service.getStudentById('nonexistent').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/students/nonexistent`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('404'), { status: 404 });
    });
  });
});