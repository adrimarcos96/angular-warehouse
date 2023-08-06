import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CategoriesService } from "../../services";
import { groupByPages } from "../../utils/index.util";

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})

export class ItemsListComponent {
  itemDeatilsBaseUrl = ''
  itemsPages: any[][] = [];
  @Input() listType = '';
  @Input() pageSize = 9;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    console.log(`Showing list fot type: ${this.listType}`);
    switch (this.listType) {
      case 'Category':
        this.itemDeatilsBaseUrl = 'categories/'
        this.itemsPages = this.categoriesService.categories.pages;
        break;

      case 'CategoryItems':
        this.itemDeatilsBaseUrl = 'products/'
        if (this.categoriesService.category) {
          const items = this.categoriesService.category.items || []
          const { pages } = groupByPages(this.pageSize, items);
          this.itemsPages = pages;
        }
        break;

      case 'Item':
        console.log('Using itemsService')
        break;
    }
  }
}
