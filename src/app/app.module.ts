import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgbDropdownModule,
    NgbAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
