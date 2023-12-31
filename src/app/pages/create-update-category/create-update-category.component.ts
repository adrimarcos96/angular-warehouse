import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services';
import { Category } from '../../models/category';
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-update-category',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicFormComponent],
  templateUrl: './create-update-category.component.html',
  styleUrls: ['./create-update-category.component.scss']
})
export class CreateUpdateCategoryComponent {
  isLoading = true;
  error = false;
  action = ''
  categoryId = '';
  category: Category | null | undefined;
  productsPageSize = 5;
  formType = 'Category';
  formFields = [
    {
      type: 'text',
      property: 'name',
      label: 'Name',
      placeholder: 'Categoy name',
      value: '',
      validators: [
        Validators.required,
        Validators.minLength(4)
      ],
      required: true
    },
    {
      type: 'textarea',
      property: 'description',
      label: 'Description',
      placeholder: 'Categoy description',
      value: '',
      validators: [
        Validators.required,
        Validators.minLength(4)
      ],
      required: true
    }
  ];
  categoryDetailsSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    this.categoryId = categoryId;
    if (categoryId) {
      this.action = 'update';
      this.categoriesService.getCategoryById(categoryId, this.productsPageSize);
      this.categoryDetailsSubscription = this.categoriesService.getCategoryDetailsUpdadateListener().subscribe((response: any) => {
        const category = response.category;

        if (category) {
          this.category = category;
          this.formFields = [
            {
              type: 'text',
              property: 'name',
              label: 'Name',
              placeholder:
              'Categoy name',
              value: category.name,
              validators: [
                Validators.minLength(4)
              ],
              required: true
            },
            {
              type: 'textarea',
              property: 'description',
              label: 'Description',
              placeholder: 'Categoy name',
              value: category.description,
              validators: [
                Validators.minLength(4)
              ],
              required: true
            }
          ];
          this.isLoading = false;
        }

        if (response.error) {
          this.isLoading = false;
          this.error = true;
        }
      });
    } else {
      this.action = 'create';
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    if (this.categoryDetailsSubscription) {
      this.categoryDetailsSubscription.unsubscribe();
      this.categoriesService.clearCategoryDetails();
    }
  }
}
