import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ICollectionData, CollectionNames } from '../../../../models/ICollection';
import { Application } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'ap-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  applications: ICollectionData<Application>[] = [];
  filtered: ICollectionData<Application>[] = [];
  statusFilter = 'All';

  constructor(
    private dataService: CollectionDataService<Application>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.dataService
      .getDataByCollectionId(CollectionNames.Applications)
      .subscribe((res) => {
        this.applications = res;
        this.applyFilter();
      });
  }

  applyFilter() {
    this.filtered =
      this.statusFilter === 'All'
        ? this.applications
        : this.applications.filter((app) => app.data.status === this.statusFilter);
  }

  edit(app: ICollectionData<Application>) {
    this.router.navigate(['/admin/application', app.id]);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.dataService.deleteData(id).subscribe(() => this.loadApplications());
    }
  }
}
