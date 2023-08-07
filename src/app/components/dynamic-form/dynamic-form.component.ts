import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../../models/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})

export class DynamicFormComponent {
  @Input() action = '';
  @Input() formType = '';
  @Input() formFields: { type: string; property: string; label: string; placeholder: string; value: any; validators: any[], required: boolean }[]= [];

  formGroup: FormGroup = new FormGroup({});
  productFormGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    code: new FormControl('', [Validators.required, Validators.minLength(3)]),
    defaultPrice: new FormControl('', [Validators.required, Validators.min(0)]),
    defaultCost: new FormControl('', [Validators.required, Validators.min(0)]),
    category: new FormControl('')
  });

  productsToAdd: Product[] = []
  productFormModal: any;
  isProductFormModalOpen = false;
  mobileIsOpen = false;
  desktopIsOpen = false;
  modal: any;

  constructor(private router: Router, private modalService: NgbModal) {}

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

  onSubmit() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;

      if (this.action === 'update') {
        const dataToSend = this.mapDataToUpdateRequest(data);
        this.sendUpdateRequest(dataToSend);
      } else if (this.action === 'create') {
        this.sendCreateRequest(data);
      }
    } else {
      console.log('Form not vailid')
    }
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

  sendUpdateRequest(data: any) {
    switch (this.formType) {
      case 'Category':
        console.log('Using categoryService to update the category');
        console.log(data)
        break;
      case 'Product':
        console.log('Using categoryService to update the product');
        console.log(data)
        break;
    }
  }

  sendCreateRequest(data: any) {
    switch (this.formType) {
      case 'Category':
        console.log('Using categoryService to create the category');
        console.log(data)
        break;
      case 'Product':
        console.log('Using categoryService to create the product');
        console.log(data)
        break;
    }
  }

  openProductFormModal(modal: any) {
    this.modal = modal;
    const fullscreen = window.innerWidth <= 980;
    const size = !fullscreen ? { size: 'lg' } : {}
    this.productFormModal = this.modalService.open(modal, { fullscreen, backdrop: true, ...size, windowClass: 'product-form-modal' });
    this.isProductFormModalOpen = true;
    if (fullscreen) {
      this.mobileIsOpen = true;
      this.desktopIsOpen = false;
    } else {
      this.mobileIsOpen = false;
      this.desktopIsOpen = true;
    }
  }

  changeSizeProductFormModal() {
    if (this.modal && this.isProductFormModalOpen) {
      const fullscreen = window.innerWidth <= 980;

      if (fullscreen) {
        if (!this.mobileIsOpen) {
          this.modalService.dismissAll();
          this.productFormModal = this.modalService.open(this.modal, { fullscreen, backdrop: true, windowClass: 'product-form-modal' });
          this.mobileIsOpen = true;
          this.desktopIsOpen = false;
        }
      } else {
        if (!this.desktopIsOpen) {
          this.modalService.dismissAll();
          const size = !fullscreen ? { size: 'lg' } : {}
          this.productFormModal = this.modalService.open(this.modal, { fullscreen, backdrop: true, ...size, windowClass: 'product-form-modal' });
          this.mobileIsOpen = false;
          this.desktopIsOpen = true;
        }
      }

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
}
