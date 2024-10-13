import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from '../services/course.service';
import { EnrollmentsService } from '../services/enrollment.service';


@Component({
  selector: 'app-enrollment-dialog',
  templateUrl: './enrollment-dialog.component.html'
})
export class EnrollmentDialogComponent {
  availableCourses: any[] = [];
  selectedCourses: any[] = [];
  enrolledCourses: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number },
    private coursesService: CourseService,
    private enrollmentsService: EnrollmentsService,
    private dialogRef: MatDialogRef<EnrollmentDialogComponent>
  ) {
    // Fetch available courses
    this.coursesService.getAllCourses().subscribe(courses => {
      console.log("courses"+JSON.stringify(courses));
      this.availableCourses = courses;
      this.enrollmentsService.getEnrollmentsByStudentId(this.data.studentId).subscribe((enrolled: any[]) => {
        this.enrolledCourses = enrolled;

        // Filter out the already enrolled courses from the availableCourses list
        this.availableCourses = this.availableCourses.filter(course => 
          !this.enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id)
        );
      });
    });
  }

  onEnroll(selectedCourses: any) {
    
    const selectedCourseIds = selectedCourses.map((courseOption: { value: { id: any; }; }) => courseOption.value.id); // Extract course IDs
    console.log("courseIds:"+selectedCourseIds);
    this.enrollmentsService.enrollStudentInCourses(this.data.studentId, selectedCourseIds).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
