import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CategoriesService, ProductsService } from "../../services";

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})

export class ItemsListComponent {
  isLoading = true;
  itemDeatilsBaseUrl = ''
  itemsPages: any[][] = [];
  @Input() id = '';
  @Input() listType = '';
  @Input() pageSize = 9;

  constructor(private categoriesService: CategoriesService, private productsService: ProductsService) {}

  ngOnInit() {
    console.log(`#### Showing list for type: ${this.listType}`);
    switch (this.listType) {
      case 'Category':
        this.itemDeatilsBaseUrl = 'categories/';
        this.categoriesService.getCategoriesDataUpdadateListener().subscribe((data: any) => {
          this.itemsPages = data.pages;
          this.isLoading = false;
        });
        break;

      case 'CategoryItems':
        this.itemDeatilsBaseUrl = 'products/';
        this.categoriesService.getCategoryById(this.id, this.pageSize);
        this.categoriesService.getCategoryDetailsUpdadateListener().subscribe((data: any) => {
          this.itemsPages = [data.category.products];
          this.isLoading = false;
        });
        break;

      case 'Product':
        this.itemDeatilsBaseUrl = 'products/';
        this.productsService.getProductsDataUpdadateListener().subscribe((data: any) => {
          this.itemsPages = data.pages;
          this.isLoading = false;
        });
        break;
    }
  }
}
