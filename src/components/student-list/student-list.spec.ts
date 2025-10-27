import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentList } from './student-list';
import { StudentService } from '../../services/student.service';
import { ToastService } from '../../services/toast.service';
import { of, throwError } from 'rxjs';
import { Student } from '../../models/student';

describe('StudentList', () => {
  let component: StudentList;
  let fixture: ComponentFixture<StudentList>;
  let element: HTMLElement;
  let mockStudentService: any;
  let mockToastService: any;

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      class: 10,
      section: 'A',
      math: 85,
      science: 90,
      english: 88,
      total: 263,
      grade: 'A'
    },
    {
      id: '2',
      name: 'Jane Smith',
      class: 10,
      section: 'B',
      math: 92,
      science: 88,
      english: 95,
      total: 275,
      grade: 'A+'
    }
  ];

  beforeEach(async () => {
    // Create mock services
    mockStudentService = {
      getAllStudents: jasmine.createSpy('getAllStudents').and.returnValue(of(mockStudents)),
      deleteStudent: jasmine.createSpy('deleteStudent').and.returnValue(of(void 0))
    };

    mockToastService = {
      showSuccess: jasmine.createSpy('showSuccess'),
      showError: jasmine.createSpy('showError')
    };

    await TestBed.configureTestingModule({
      imports: [
        StudentList,
        FormsModule,
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: StudentService, useValue: mockStudentService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentList);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    expect(mockStudentService.getAllStudents).toHaveBeenCalled();
    expect(component.students.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should display student data in table', () => {
    const rows = element.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    const firstRow = rows[0];
    expect(firstRow.textContent).toContain('John Doe');
    expect(firstRow.textContent).toContain('10');
    expect(firstRow.textContent).toContain('A');
  });

  it('should handle student deletion', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteStudent('1');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockStudentService.deleteStudent).toHaveBeenCalledWith('1');
    expect(mockToastService.showSuccess).toHaveBeenCalled();
    expect(component.students.length).toBe(1);
  });

  it('should handle error when loading students', async () => {
    mockStudentService.getAllStudents.and.returnValue(throwError(() => new Error('API Error')));
    
    component.loadStudents();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.error).toBeTruthy();
    expect(mockToastService.showError).toHaveBeenCalled();
  });

  describe('Filtering', () => {
    it('should filter students by name', () => {
      component.filters.name = 'John';
      component.applyFilters();
      fixture.detectChanges();

      expect(component.filteredStudents.length).toBe(1);
      expect(component.filteredStudents[0].name).toContain('John');
    });

    it('should filter students by class', () => {
      component.filters.class = '10';
      component.applyFilters();
      fixture.detectChanges();

      expect(component.filteredStudents.length).toBe(2);
    });

    it('should filter students by section', () => {
      component.filters.section = 'A';
      component.applyFilters();
      fixture.detectChanges();

      expect(component.filteredStudents.length).toBe(1);
      expect(component.filteredStudents[0].section).toBe('A');
    });
  });

  describe('Sorting', () => {
    it('should sort students by name', () => {
      component.sort('name');
      fixture.detectChanges();

      expect(component.filteredStudents[0].name).toBe('Jane Smith');
      expect(component.filteredStudents[1].name).toBe('John Doe');
    });

    it('should toggle sort direction', () => {
      component.sort('name');
      component.sort('name');
      fixture.detectChanges();

      expect(component.sortDirection).toBe('desc');
      expect(component.filteredStudents[0].name).toBe('John Doe');
      expect(component.filteredStudents[1].name).toBe('Jane Smith');
    });
  });
});
