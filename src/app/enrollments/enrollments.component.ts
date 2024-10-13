import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnrollmentsService } from '../services/enrollment.service';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.css']
})
export class EnrollmentsComponent {
  enrolledCourses: any[] = [];
  constructor(
    private enrollmentsService: EnrollmentsService,
    private dialogRef: MatDialogRef<EnrollmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number, courses: any[] }
  ) {
    this.enrolledCourses = this.data.courses;
  }

  deleteEnrollment(courseId: number) {
    this.enrollmentsService.deleteEnrollment(this.data.studentId, courseId)
      .subscribe(() => {
        // Filter out the deleted course from the enrolledCourses array
        this.enrolledCourses = this.enrolledCourses.filter(course => course.id !== courseId);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
