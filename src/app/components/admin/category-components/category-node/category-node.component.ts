import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-node',
  imports: [CommonModule],
  templateUrl: './category-node.component.html',
  styleUrl: './category-node.component.scss'
})
export class CategoryNodeComponent {
 @Input() category: any;
}
