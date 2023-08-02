import { Component } from '@angular/core';
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
  imports: [NgbDropdownModule, NgbAccordionModule],
  providers: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
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
