import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { CategoriesService } from "../../services";
import { ItemsListComponent } from "../../components/items-list/items-list.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemsListComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent {
  currentPage = 0;
  pageSize = 4;
  categoriesToShow = 0;
  total = 0;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService.getCategories(0, this.pageSize);
    this.categoriesService.getCategoriesDataUpdadateListener().subscribe((data: any) => {
      this.categoriesToShow = data.categoriesToShow;
      this.total = data.total;
    })
  }
}
