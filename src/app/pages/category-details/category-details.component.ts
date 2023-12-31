import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from "../../services";
import { Category } from '../../models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsListComponent } from "../../components/items-list/items-list.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, ItemsListComponent],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})

export class CategoryDetailsComponent {
  categoryId = '';
  error = false;
  isLoading = true;
  productsToShow = 0;
  totalProducts = 0;
  category: Category | undefined;
  pageSize = 5;
  categoryDetailsSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private categoriesService: CategoriesService) {}

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    this.categoryId = categoryId
    this.categoriesService.getCategoryById(categoryId, this.pageSize);
    this.categoryDetailsSubscription = this.categoriesService.getCategoryDetailsUpdadateListener().subscribe((response: any) => {
      const category = response.category
      if (category) {
        this.category = category;
        this.productsToShow = response.productsToShow;
        this.totalProducts = response.totalProducts;
        this.isLoading = false;
      }

      if (response.error) {
        this.isLoading = false;
        this.error = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.categoryDetailsSubscription) {
      this.categoryDetailsSubscription.unsubscribe();
      this.categoriesService.clearCategoryDetails();
    }
  }

  updateCategory() {
    if (this.category) {
      console.log(`Navigating to update product page. Category id: ${this.category.id}`);
      this.router.navigateByUrl(`/categories/update/${this.category.id}`);
    }
  }

  createNewProduct() {
    if (this.category) {
      console.log(`Creating a new product for category: ${this.category.id}`);
    }
  }

  deleteCategory() {
    if (this.category) {
      console.log(`Removing category: ${this.category.id}`);
    }
  }
}
