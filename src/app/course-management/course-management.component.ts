import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  displayedColumns: string[] = ['id', 'courseName', 'description', 'schedule', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  dataSource = new MatTableDataSource<Course>();
  filterValue: string = '';
  constructor(private courseService: CourseService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.dataSource.data = courses;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(course?: Course): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      data: course ? course : { id: null, courseName: '', description: '', schedule: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.courseService.updateCourse(result).subscribe(() => this.loadCourses());
        } else {
          this.courseService.addCourse(result).subscribe(() => this.loadCourses());
        }
      }
    });
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
  }
  applyFilter(event: Event) {
    console.log("inside filter");
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

}
