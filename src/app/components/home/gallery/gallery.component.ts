import { Component } from '@angular/core';
import { Project } from '../../../../models/schema';
import { CommonModule } from '@angular/common';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { Router } from '@angular/router';
import { CollectionNames } from '../../../../models/ICollection';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
 gallery: Project[] = [
    { image: 'http://localhost:8080/api//upload/uploads/img_1748511021_350b5737.png', name: 'Custom Branded Apparel' },
    { image: 'http://localhost:8080/api//upload/uploads/img_1748511021_350b5737.png', name: 'Workwear in Action' },
    { image: 'http://localhost:8080/api//upload/uploads/img_1748511021_350b5737.png', name: 'Promo Gifts Display' },
    { image: 'http://localhost:8080/api//upload/uploads/img_1748511021_350b5737.png', name: 'Event Branding' },
    { image: 'http://localhost:8080/api//upload/uploads/img_1748511021_350b5737.png', name: 'Printed Banners' },
    { image: 'http://localhost:8080/api//upload/uploads/img_1748511021_350b5737.png', name: 'Corporate Merchandise' },
    // Add as many as you want, or even fetch dynamically later
  ];
loading = false;
   constructor(
    private dataService: CollectionDataService<Project>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.dataService
      .getDataByCollectionId(CollectionNames.Projects)
      .subscribe((res) => {
        this.gallery = res.map(x=>x.data as Project) || [];
        this.loading = false;
      });
  }
}
