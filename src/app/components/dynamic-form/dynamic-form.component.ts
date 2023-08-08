import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../../models/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService, ProductsService } from '../../services';
import { Category } from '../../models/category';
import { products } from '../../mock/items';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent {
  @Input() action = '';
  @Input() id = '';
  @Input() formType = '';
  @Input() formFields: { type: string; property: string; label: string; placeholder: string; value: any; validators: any[], required: boolean }[]= [];

  formGroup: FormGroup = new FormGroup({});
  productFormGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    code: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    defaultPrice: new FormControl('', [Validators.required, Validators.min(0)]),
    defaultCost: new FormControl('', [Validators.required, Validators.min(0)])
  });

  productsToAdd: Product[] = []
  productFormModal: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private categoryServices: CategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    addEventListener('resize', () => this.changeSizeProductFormModal())

    for (const formField of this.formFields) {
      const formControl = new FormControl(
        formField.value,
        formField.validators
      );
      this.formGroup.addControl(formField.property, formControl);
    }
  }

  getFormControl(property: string) {
    return this.formGroup.get(property);
  }

  getProductFormControl(property: string) {
    return this.productFormGroup.get(property);
  }

  mapDataToUpdateRequest(data: any) {
    const propertiesToDelete: string[] = [];

    Object.keys(data).forEach((key: string) => {
      if (!data[key]) {
        propertiesToDelete.push(key);
      }
    });

    propertiesToDelete.forEach((property: string) => {
      delete data[property]
    });

    return data
  }

  async sendUpdateRequest(data: any) {
    switch (this.formType) {
      case 'Category':
        const result = await this.categoryServices.updateCategory(this.id, data);

        if (!result.error) {
          console.log('Category successfully updated', result.categoryUpdated);
          this.router.navigateByUrl('/categories');
        } else {
          console.error('Show error message');
        }
        break;
      case 'Product':
        console.log('Using categoryService to update the product');
        console.log(data)
        break;
    }
  }

  async sendCreateRequest(data: any) {
    switch (this.formType) {
      case 'Category':
        let progress = 0;
        let totalObjectsToCreate = this.productsToAdd.length + 1;
        const result = await this.categoryServices.createCategory(data);

        if (!result.error && result.newCategory) {
          progress = 100 / totalObjectsToCreate;
          totalObjectsToCreate--;
          console.log(`Progress: ${progress}%`)

          const newCategory: Category = result.newCategory;
          for await (const product of this.productsToAdd) {
            product.categoryId = newCategory.id;
            const productResponse = await this.productsService.createProduct(product);
            if (!productResponse.error && productResponse.newProduct) {
              console.log(`Product created: ${productResponse.newProduct.name} - ${productResponse.newProduct.code}`);
              progress += 100 / totalObjectsToCreate - 1;
              totalObjectsToCreate--;
            } else {
              console.error('Show error message');
            }
          }
          console.log('Category successfully created', newCategory);


          this.router.navigateByUrl('/categories');
        } else {
          console.error('Show error message');
        }
        break;
      case 'Product':
        console.log('Using categoryService to create the product');
        console.log(data)
        break;
    }
  }

  openProductFormModal(modal: any) {
    const fullscreen = window.innerWidth <= 980;
    const size = !fullscreen ? { size: 'lg' } : {};
    this.productFormModal = this.modalService.open(modal, { fullscreen, backdrop: true, ...size, windowClass: 'product-form-modal' });
  }

  closeProductFormModal() {
    this.productFormModal.close();
    this.productFormModal = null;
  }

  changeSizeProductFormModal() {
    if (this.productFormModal) {
      const fullscreen = window.innerWidth <= 980;
      const size = !fullscreen ? { size: 'lg' } : {};
      this.productFormModal.update({ fullscreen, ...size });
    }
  }

  addProduct() {
    if (this.productFormGroup.valid) {
      console.log('Adding product');

      const data: Product = this.productFormGroup.value;
      data.id = (this.productsToAdd.length + 1).toString();
      console.log(data);

      this.productsToAdd.push(data);
      this.productFormGroup.reset();
    } else {
      console.log('Product not valid')
    }
  }

  deleteProduct(productId: string) {
    let productToDelete: number | undefined;
    this.productsToAdd.forEach((product: any, index: number) => {
      if (product.id === productId) {
        productToDelete = index;
        return;
      }
    });

    if (productToDelete !== undefined) {
      this.productsToAdd.splice(productToDelete, 1);
    } else {
      console.log('Product not found')
    }
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;

      if (this.action === 'update') {
        const dataToSend = this.mapDataToUpdateRequest(data);
        await this.sendUpdateRequest(dataToSend);
      } else if (this.action === 'create') {
        this.sendCreateRequest(data);
      }
    } else {
      console.log('Form not vailid')
    }
  }
}
