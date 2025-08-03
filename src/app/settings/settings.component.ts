import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICollectionData, CollectionNames } from '../../models/ICollection';
import { ISetting, Application } from '../../models/schema';
import { CollectionDataService } from '../../services/collection.data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
 settings: ICollectionData<ISetting>[] = [];

  constructor(
    private dataService: CollectionDataService<ISetting>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.dataService
      .getDataByCollectionId(CollectionNames.Settings)
      .subscribe((res) => {
        this.settings = res;
      });
  }

save(data: ICollectionData<ISetting>) {
    if (data.id) {
      this.dataService.updateData(data).subscribe(() => this.loadApplications());
    } else {
      this.dataService.addData(data).subscribe(() => this.loadApplications());
    }
  }
}
