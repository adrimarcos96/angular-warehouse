import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from "../../services";
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';
import { ItemsListComponent } from "../../components/items-list/items-list.component";

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, ItemsListComponent],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})

export class CategoryDetailsComponent {
  isLoding = true;
  itemsToShow = 0;
  totalItems = 0;
  category: Category | undefined;
  pageSize = 3;

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) {}

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    const { category, totalItems} = this.categoriesService.getCategoryById(categoryId, 0, this.pageSize);

    if (category) {
      this.category = category;
      this.itemsToShow = category.items && category.items.length ? category.items.length : 0
      this.totalItems = totalItems
    } else {
      console.log('Redirecting to 404 page');
    }

    this.isLoding = false;
  }
}
