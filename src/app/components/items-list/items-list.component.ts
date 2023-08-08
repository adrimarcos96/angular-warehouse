import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CategoriesService, ProductsService } from "../../services";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})

export class ItemsListComponent {
  @Input() id = '';
  @Input() listType = '';
  @Input() pageSize = 9;
  currentPage = 0;
  isLoading = true;
  itemDeatilsBaseUrl = '';
  itemsToShow = 0;
  totalItems = 0;
  itemsPages: any[][] = [];
  subscription: Subscription | undefined;
  lastItem: any;
  intersectionObserver = new IntersectionObserver((elements) => {
    elements.forEach((element: any) => {
      if (element.isIntersecting && this.itemsToShow < this.totalItems) {
        switch (this.listType) {
          case 'Category':
            this.categoriesService.getCategories(this.currentPage + 1, this.pageSize);
            break;
          case 'Product':
            this.productsService.getProducts(this.currentPage + 1, this.pageSize);
            break;
        }
      }
    });
  }, {
    'rootMargin': '0px 0px 100px 0px',
    threshold: 1.0
  })

  constructor(private categoriesService: CategoriesService, private productsService: ProductsService) {}

  ngOnInit() {
    console.log(`#### Showing list for type: ${this.listType}`);
    switch (this.listType) {
      case 'Category':
        this.itemDeatilsBaseUrl = 'categories/';
        this.subscription = this.categoriesService.getCategoriesDataUpdadateListener().subscribe((data: any) => {
          if (data.pages.length > this.itemsPages.length) {
            this.currentPage = data.page;
          }
          this.itemsPages = data.pages;
          this.itemsToShow = data.categoriesToShow;
          this.totalItems = data.total;
          this.isLoading = false;
        });
        break;

      case 'CategoryItems':
        this.itemDeatilsBaseUrl = 'products/';
        this.subscription = this.categoriesService.getCategoryDetailsUpdadateListener().subscribe((data: any) => {
          if (data.pages.length > this.itemsPages.length) {
            this.currentPage = data.page;
          }

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

  ngAfterViewChecked() {
    const lastPage: any = this.itemsPages.length > 0 ? this.itemsPages[this.itemsPages.length - 1] : null;

    if (lastPage !== null) {
      const lastItem = lastPage.length > 0 ? lastPage[lastPage.length - 1] : null;

      if (lastItem) {
        this.lastItem = lastItem;
        const desktopElement = document.getElementById(`desktop-item-${this.lastItem.id}`);
        if (desktopElement) {
          this.intersectionObserver.observe(desktopElement);
        }

        const mobileElement = document.getElementById(`mobile-item-${this.lastItem.id}`);
        if (mobileElement) {
          this.intersectionObserver.observe(mobileElement);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription ) {
      this.subscription.unsubscribe();
      switch (this.listType) {
        case 'Category':
          this.categoriesService.clearCategoriesData();
          break;
        case 'CategoryItems':
          this.categoriesService.clearCategoryDetails();
          break;
      }
    }
  }
}
