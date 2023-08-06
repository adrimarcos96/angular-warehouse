import { Injectable } from '@angular/core';
import { Category } from "../../models/category";
import { categories } from "../../mock/categories";
import { items } from "../../mock/items";
import { groupByPages } from "../../utils/index.util";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  category: Category | undefined;
  categories: { pages: Category[][], categoriesToShow: number, total: number } = {
    pages: [],
    categoriesToShow: 0,
    total: 0
  }

  constructor() { }

  getCategoriesByPages(startIndex: number, pageSize: number): { pages: Category[][], categoriesToShow: number, total: number } {
    const finish = startIndex + pageSize > categories.length ? categories.length : startIndex + pageSize;
    const fetchedCategories = categories.slice(startIndex, finish)
    const response = groupByPages(pageSize, fetchedCategories);
    this.categories = {
      pages: response.pages,
      categoriesToShow: response.itemsToShow,
      total: response.total
    };

    return this.categories;
  }

  getCategoryById(categoryId: string, startIndex:number, itemsSize: number): { totalItems: number, category: Category | undefined} {
    const category: Category | undefined = categories.find(cat => cat.id === categoryId);
    if (category) {
      const itemsFetched = items.filter(item => item.category === category.id)
      const finish = startIndex + itemsSize > itemsFetched.length ? itemsFetched.length : startIndex + itemsSize;
      category.items = itemsFetched.slice(startIndex, finish)
    }

    this.category = category;
    return { category: this.category, totalItems: 92 };
  }
}
