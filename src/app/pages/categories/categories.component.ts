import { Component } from '@angular/core';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { CategoriesService } from "../../services";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent {
  pageSize = 6;
  totalCategories = 155;
  categoriesToShow = 0;
  categoryPages: Category[][] = [];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    const { pages, total } = this.categoriesService.getCategoriesByPages(this.pageSize);
    this.categoryPages = pages;
    this.categoriesToShow = total;
  }
}
