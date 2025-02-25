import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PlanificateurComponent } from './planificateur/planificateur.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { CommandeService } from './services/commande.service';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './planificateur/dashboard/dashboard.component';
import { PlanningdayComponent } from './planificateur/planningday/planningday.component';
import { VisualiserdayComponent } from './planificateur/visualiserday/visualiserday.component';
import { AjusterdayComponent } from './planificateur/ajusterday/ajusterday.component';
import { SuivicarteComponent } from './planificateur/suivicarte/suivicarte.component';
import { ListCommandeComponent } from './planificateur/planningday/list-commande/list-commande.component';


@NgModule({
  declarations: [
    AppComponent,
    PlanificateurComponent,
    DashboardComponent,
    PlanningdayComponent,
    VisualiserdayComponent,
    AjusterdayComponent,
    SuivicarteComponent,
    ListCommandeComponent,
   
  ],
  imports: [
  
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    HttpClientModule ,
    MatTableModule,
    
     MatCheckboxModule,
     MatFormFieldModule, 
     MatInputModule, 
     MatSortModule, 
     MatPaginatorModule,
     MatSort,
     
     
  ],
  providers: [
    provideAnimationsAsync(),
    CommandeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
