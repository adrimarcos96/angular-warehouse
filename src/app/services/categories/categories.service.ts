import { Injectable } from '@angular/core';
import { Category } from "../../models/category";
import { categories } from "../../mock/categories";
import { groupByPages } from "../../utils/index.util";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() { }

  getCategoriesByPages(pageSize: number): { pages: Category[][], total: number } {
    return groupByPages(pageSize, categories);
  }
}
