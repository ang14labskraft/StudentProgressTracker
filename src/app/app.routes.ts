import { Routes } from '@angular/router';
import { StudentList } from '../components/student-list/student-list';
import { StudentForm } from '../components/student-form/student-form';
import { StudentDetails } from '../components/student-details/student-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'students',
    component: StudentList
  },
  {
    path: 'add-student',
    component: StudentForm
  },
  {
    path: 'edit/:id',
    component: StudentForm
  },
  {
    path: 'details/:id',
    component: StudentDetails
  },
  {
    path: 'edit-student/:id',
    component: StudentForm
  },
];
