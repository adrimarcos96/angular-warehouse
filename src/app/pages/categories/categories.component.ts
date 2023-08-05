import { Component } from '@angular/core';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { categories } from '../../mock/categories'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent {
  pageSize = 9;
  totalCategories = 155;
  categoriesToShow = 0;
  categoryPages: Category[][] = [];

  ngOnInit() {
    const groupedCategories = this.groupCategoriesByPages();
    this.categoryPages = groupedCategories.pages;
    this.categoriesToShow = groupedCategories.total;
  }

  groupCategoriesByPages() {
    const categoriesGroupedByPages = []
    let page: Category[] = []
    let currentPage = 1

    for (let i = 0; i < categories.length; i++) {
      const category: Category = categories[i];
      if (i < (this.pageSize) * currentPage) {
        page.push(category)
      }

      if (i >= this.pageSize * currentPage || i === categories.length -1) {
        categoriesGroupedByPages.push(page)
        page = [category]

        if (i !== categories.length -1) {
          currentPage++;
        } else if (i >= this.pageSize * currentPage)  {
          categoriesGroupedByPages.push(page)
        }
      }

    }

    console.log(categoriesGroupedByPages)
    return { pages: categoriesGroupedByPages, total: categories.length  }
  }
}
