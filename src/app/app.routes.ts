/**
 * Application routing configuration module.
 * Defines the mapping between URLs and components.
 * 
 * @module AppRoutes
 */

import { Routes } from '@angular/router';
import { StudentList } from '../components/student-list/student-list';
import { StudentForm } from '../components/student-form/student-form';
import { StudentDetails } from '../components/student-details/student-details';

/**
 * Application route configuration.
 * Defines the mapping between URLs and components in the application.
 * 
 * @constant
 * @type {Routes}
 * 
 * Routes:
 * - '/' -> Redirects to '/students'
 * - '/students' -> List of all students
 * - '/add-student' -> Form to add new student
 * - '/edit/:id' -> Form to edit existing student
 * - '/details/:id' -> Detailed view of a student
 */
export const routes: Routes = [
  {
    /** Default route - redirects to students list */
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    /** Display list of all students with filtering and sorting capabilities */
    path: 'students',
    component: StudentList,
    title: 'Student List - Student Progress Tracker'
  },
  {
    /** Form for adding a new student */
    path: 'add-student',
    component: StudentForm,
    title: 'Add New Student - Student Progress Tracker'
  },
  {
    /** Form for editing an existing student
     * @param id - Student ID to edit
     */
    path: 'edit/:id',
    component: StudentForm,
    title: 'Edit Student - Student Progress Tracker'
  },
  {
    /** Detailed view of a student's information
     * @param id - Student ID to view
     */
    path: 'details/:id',
    component: StudentDetails,
    title: 'Student Details - Student Progress Tracker'
  },
];
