import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student.model';
import { StudentDialogComponent } from './student-dialog/student-dialog.component'; // for add/edit dialog
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EnrollmentDialogComponent } from '../enrollment-dialog/enrollment-dialog.component';
import { EnrollmentsService } from '../services/enrollment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnrollmentsComponent } from '../enrollments/enrollments.component';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'major', 'actions', 'enrollments', 'enrollCourses'];
  dataSource = new MatTableDataSource<Student>();
 
  filterValue: string = '';
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private studentService: StudentService, private enrollmentsService: EnrollmentsService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(students => {
      this.dataSource.data = students;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  addStudent() {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '400px',
      data: { student: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.addStudent(result).subscribe(() => this.loadStudents());
      }
    });
  }

  editStudent(student: Student) {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '400px',
      data: { student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.updateStudent(student.id, result).subscribe(() => this.loadStudents());
      }
    });
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(() => this.loadStudents());
  }
  applyFilter(event: Event) {
    console.log("inside filter");
    this.filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  // showEnrollments(student: any) {
  //   this.enrollmentsService.getEnrollmentsByStudentId(student.id).subscribe((courses) => {
  //     // Show enrolled courses (use dialog, modal, or inline display)
  //     const courseNames = courses.map(course => course.courseName).join(', ');
  //     this.snackBar.open(`Enrolled Courses: ${courseNames}`, 'Close', { duration: 5000 });
  //   });
  // }

  showEnrollments(student: any) {
    this.enrollmentsService.getEnrollmentsByStudentId(student.id).subscribe((courses) => {
      // Open the dialog and pass the enrolled courses as data
      this.dialog.open(EnrollmentsComponent, {
        width: '400px',
        data: {
          studentId: student.id,  // Pass studentId
          courses: courses        // Pass enrolled courses
        }
      });
    });
  }

  enrollCourses(student: any) {
    this.dialog.open(EnrollmentDialogComponent, {
      width: '400px',
      data: { studentId: student.id }
    });
  }

}
