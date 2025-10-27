import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from './navbar';

// Mock components for testing routes
@Component({ template: '' })
class MockHomeComponent {}

@Component({ template: '' })
class MockAddStudentComponent {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterModule.forRoot([
          { path: 'students', component: MockHomeComponent },
          { path: 'add-student', component: MockAddStudentComponent }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navbar brand title', () => {
    const brandTitle = element.querySelector('.navbar-brand h1');
    expect(brandTitle?.textContent).toContain('Student Progress Tracker');
  });

  it('should render navigation links', () => {
    const links = element.querySelectorAll('.nav-links a');
    expect(links.length).toBe(2);
    
    const [homeLink, addStudentLink] = Array.from(links);
    expect(homeLink.getAttribute('routerLink')).toBe('/students');
    expect(homeLink.textContent).toContain('Home');
    
    expect(addStudentLink.getAttribute('routerLink')).toBe('/add-student');
    expect(addStudentLink.textContent).toContain('Add Student');
  });

  it('should navigate to correct routes when links are clicked', async () => {
    const links = element.querySelectorAll('.nav-links a');
    const [homeLink, addStudentLink] = Array.from(links);
    
    // Test home link navigation
    homeLink.click();
    await fixture.whenStable();
    expect(router.url).toContain('/students');
    
    // Test add student link navigation
    addStudentLink.click();
    await fixture.whenStable();
    expect(router.url).toContain('/add-student');
  });

  it('should have proper accessibility attributes', () => {
    const nav = element.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav?.classList.contains('navbar')).toBeTrue();
    
    const heading = element.querySelector('h1');
    expect(heading).toBeTruthy();
  });
});
