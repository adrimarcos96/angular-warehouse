import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { http, serverUrls } from "../../config/httpConfig";
import { Product } from "../../models/product";
import { products } from '../../mock/items';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productsData: any = {
    page: 0,
    pages: [],
    productsToShow: 0,
    total: 0
  }

  private productsDataUpdated = new BehaviorSubject<{ pages: any; productsToShow: number; page: number; total: number }>({
    pages: [],
    productsToShow: 0,
    page: 0,
    total: 0
  });

  constructor() { }

  async getProducts(page: number, pageSize: number) {
    const requestBody = {
      pageNo: page,
      pageSize: pageSize,
      filters: [{ Alias: "IsActive", Value: "True"}]
    };

    try {
      const { data: productsResponse } = await http.post(serverUrls.searchProducts, requestBody);

      if (productsResponse.success) {
        const products: Product[] = this.mapProductsData(productsResponse.items);
        const page = productsResponse.pageNo;
        const total = productsResponse.total;
        const { pages, productsToShow } = this.getProductsByPages(page, products);

        this.productsData = {
          page,
          pages,
          productsToShow,
          total
        }
        this.productsDataUpdated.next(this.productsData)

      } else {
        console.error('Error getting products');
      }
    } catch (error) {
      console.error('Error getting products', requestBody, error);
    }
  }

  async getProductById(id: string) {
    try {
      const { data: productResponse } = await http.post(`${serverUrls.getProductDetails}/${id}`, {})

      if (productResponse.success) {
        return {
          id: productResponse.data.id,
          name: productResponse.data.name,
          code: productResponse.data.code,
          category: productResponse.data.category,
          description: productResponse.data.description,
          image: productResponse.data.image || 'assets/images/no-image.png',
          defaultPrice: productResponse.data.defaultPrice,
          defaultCost: productResponse.data.defaultCost
        }
      } else {
        console.error('Error getting product:', id);
        return null;
      }
    } catch (error) {
      console.error('Error getting product:', id, error);
      return null;
    }
  }

  async createProduct(data: Product) {
    try {
      const { data: productResponse } = await http.post(serverUrls.getProductDetails, data);

      if (productResponse.success) {
        const newProduct: Product = {
          id: productResponse.data.id,
          name: productResponse.data.name,
          code: productResponse.data.code,
          defaultPrice: productResponse.data.defaultPrice,
          defaultCost: productResponse.data.defaultCost,
          description: productResponse.data.description,
          category: productResponse.data.category,
          image: productResponse.data.image || 'assets/images/no-image.png',
        };

        return { error: false, newProduct };
      } else {
        console.error(`Error creating product. ${productResponse.message}`);
        return { error: true };
      }
    } catch (error) {
      console.error(`Error creating product`, error);
      return { error: true };
    }
  }

  // Maps
   mapProductsData(products: any[]): Product[] {
    if (products && products.length > 0) {
      return products.map((product: any) => {
        return {
          id: product.id,
          code: product.code,
          name: product.name,
          category: product.category,
          description: product.description,
          image: product.image || 'assets/images/no-image.png'
        };
      });
    }

    return [];
  }

  getProductsByPages(currentPage: number, products: Product[]) {
    let pages: Product[][] = [];
    let productsToShow = 0;

    if (this.productsData.pages.length > 0 && currentPage === this.productsData.page) {
      this.productsData.pages.forEach((page: Product[], index: number) => {
        if (index === currentPage) {
          productsToShow += products.length;
          pages.push(products);
        } else {
          productsToShow += page.length;
          pages.push(page);
        }
      });
    } else {
      productsToShow = this.productsData.categoriesToShow + products.length
      pages = [...this.productsData.pages, products];
    }

    return { pages, productsToShow };
  }

  getProductsDataUpdadateListener() {
    return this.productsDataUpdated;
  }
}
