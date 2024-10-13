import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentManagementComponent } from './student-management/student-management.component';
import { CourseManagementComponent } from './course-management/course-management.component';

const routes: Routes = [
  { path: 'students', component: StudentManagementComponent },
  { path: 'courses', component: CourseManagementComponent },
  { path: '', redirectTo: '/students', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
