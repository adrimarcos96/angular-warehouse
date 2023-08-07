import { Component } from '@angular/core';
import {
  NgbDropdownConfig,
  NgbDropdown,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
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
        { text: 'Show all categories', url: '/categories' },
        { text: 'Add a new category', url: '/categories/create' }
      ]
    },
    {
      title: 'Products',
      url: "#",
      sectionId: 'productsSection',
      options: [
        { text: 'Show all products', url: '/products' },
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
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    this.mobileMenu.close();
    this.isMobileMenuOpen = false
  }

  closeMobileMenuOnDesktop() {
    if (window.screen.width > 980 && this.isMobileMenuOpen && this.mobileMenu) {
      this.mobileMenu.close();
    }
  }
}
