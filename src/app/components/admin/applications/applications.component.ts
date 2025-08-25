import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ICollectionData, CollectionNames } from '../../../../models/ICollection';
import { Application } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';

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

  selectedApp: ICollectionData<Application> | null = null;
  comment: string = '';

  constructor(private dataService: CollectionDataService<Application>) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.dataService
      .getUserCollections(CollectionNames.Applications)
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
    this.selectedApp = { ...app }; // Clone to prevent direct mutation
    // this.comment = this.selectedApp.data.comment || '';
  }

  closeModal() {
    this.selectedApp = null;
    this.comment = '';
  }

  updateStatus(status: 'approved' | 'rejected') {
    if (this.selectedApp) {
      // this.selectedApp.data.status = status;
      // this.selectedApp.data.comment = this.comment;

      this.dataService.updateData(this.selectedApp).subscribe(() => {
        this.closeModal();
        this.loadApplications();
      });
    }
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.dataService.deleteData(id).subscribe(() => this.loadApplications());
    }
  }
}
