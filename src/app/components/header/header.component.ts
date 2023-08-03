import { Component,  } from '@angular/core';
import { CommonModule } from "@angular/common";
import {
  NgbDropdownModule,
  NgbDropdownConfig,
  NgbDropdown,
  NgbModal,
  NgbAccordionModule
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, NgbAccordionModule],
  providers: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  links = [
    {
      title: 'Categories',
      url: "#",
      sectionId: 'categoriesSection',
      options: [
        { text: 'Show all categories', url: '#' },
        { text: 'Add a new category', url: '#' }
      ]
    },
    {
      title: 'Products',
      url: "#",
      sectionId: 'productsSection',
      options: [
        { text: 'Show all products', url: '#' },
        { text: 'Add a new product', url: '#' }
      ]
    }
  ]
  isMobileMenuOpen : boolean = false;
  mobileMenu : any;

  constructor(bsDropdownConfig: NgbDropdownConfig, private modalService: NgbModal) {
    bsDropdownConfig.autoClose = true;
  }

  ngOnInit() {
    addEventListener('resize', () => this.closeMobileMenuOnDesktop())
  }

  openDropdown(dropdown: NgbDropdown) {
    if (!dropdown.isOpen()) {
      dropdown.open();
    }
  }

  openMobileMenu(mobileMenu: any) {
    this.mobileMenu = this.modalService.open(mobileMenu, { fullscreen: true, backdrop: false, windowClass: 'mobile-menu' });
    this.isMobileMenuOpen = true
  }

  closeMobileMenuOnDesktop() {
    if (window.screen.width > 980 && this.isMobileMenuOpen && this.mobileMenu) {
      this.mobileMenu.close()
    }
  }
}
