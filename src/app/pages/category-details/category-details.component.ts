import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from "../../services";
import { Category } from '../../models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsListComponent } from "../../components/items-list/items-list.component";

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, ItemsListComponent],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})

export class CategoryDetailsComponent {
  categoryId = '';
  isLoading = true;
  productsToShow = 0;
  totalProducts = 0;
  category: Category | undefined;
  pageSize = 5;

  constructor(private route: ActivatedRoute, private router: Router, private categoriesService: CategoriesService) {}

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    this.categoryId = categoryId
    this.categoriesService.getCategoryById(categoryId, this.pageSize);
    this.categoriesService.getCategoryDetailsUpdadateListener().subscribe((response: any) => {
      const category = response.category
      if (category) {
        this.category = category;
        this.productsToShow = response.productsToShow;
        this.totalProducts = response.totalProducts;
      } else {
        console.log('Redirecting to 404 page');
      }
      this.isLoading = false;
    });
  }

  updateCategory() {
    if (this.category) {
      console.log(`Navigating to update product page. Category id: ${this.category.id}`);
      this.router.navigateByUrl(`/categories/update/${this.category.id}`);
    }
  }

  deleteCategory() {
    if (this.category) {
      console.log(`Removing category: ${this.category.id}`);
    }
  }
}
