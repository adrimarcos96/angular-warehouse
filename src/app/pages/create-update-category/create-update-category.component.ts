import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services';
import { Category } from '../../models/category';
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-update-category',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicFormComponent],
  templateUrl: './create-update-category.component.html',
  styleUrls: ['./create-update-category.component.scss']
})
export class CreateUpdateCategoryComponent {
  isLoading = true;
  action = ''
  categoryId = '';
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

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    this.categoryId = categoryId
    if (categoryId) {
      this.action = 'update';
      this.categoriesService.getCategoryById(categoryId, this.productsPageSize);
      this.categoriesService.getCategoryDetailsUpdadateListener().subscribe((response: any) => {
        const category: Category = response.category
        if (category) {
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
        } else {
          console.log('Cataegory not found. Redirecting to 404 page ...');
        }
        this.isLoading = false;
      });
    } else {
      this.action = 'create';
      this.isLoading = false;
    }
  }
}
