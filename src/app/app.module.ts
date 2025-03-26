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
import { PlanificateurComponent } from './composants/planificateur/planificateur.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { CommandeService } from './services/commande.service';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './composants/planificateur/dashboard/dashboard.component';
import { PlanningdayComponent } from './composants/planificateur/planningday/planningday.component';
import { VisualiserdayComponent } from './composants/planificateur/visualiserday/visualiserday.component';
import { AjusterdayComponent } from './composants/planificateur/ajusterday/ajusterday.component';
import { SuivicarteComponent } from './composants/planificateur/suivicarte/suivicarte.component';

import { ListCommandeComponent } from './composants/planificateur/planningday/list-commande/list-commande.component';
import { LeafletModule } from "@bluehalo/ngx-leaflet";
import { CarteComponent } from './composants/planificateur/suivicarte/carte/carte.component';
import { LivreurComponent } from './composants/livreur/livreur.component';
import {
  MatBottomSheet,MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { JourneeComponent } from './composants/planificateur/planningday/journee/journee.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatDialogModule, MatDialogActions , MatDialog,} from '@angular/material/dialog';
import { PlanifierComponent } from './composants/planificateur/planningday/planifier/planifier.component';
import {MatStepperModule} from '@angular/material/stepper';


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
    CarteComponent,
    LivreurComponent,
    JourneeComponent,
    PlanifierComponent,
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
     LeafletModule,
     MatBottomSheetModule,
     MatDatepickerModule,
     MatSelectModule,
     ReactiveFormsModule,
     FormsModule,
     MatDialogModule,
     MatDialogActions,
     MatStepperModule,
  ],
  providers: [
    provideAnimationsAsync(),
    CommandeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
