import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Category } from '../../models/category';
import { CategoriesService } from "../../services";
import { ItemsListComponent } from "../../components/items-list/items-list.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ItemsListComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent {
  currentPage = 0;
  pageSize = 5;
  categoriesToShow = 0;
  total = 0;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService.getCategoriesByPages(0, this.pageSize);
    this.categoriesService.getCategoriesDataUpdadateListener().subscribe(data => {
      this.categoriesToShow = data.categoriesToShow;
      this.total = data.total;
    })
  }
}
