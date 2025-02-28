import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningdayComponent } from './composants/planificateur/planningday/planningday.component';
import { DashboardComponent } from './composants/planificateur/dashboard/dashboard.component';
import { AjusterdayComponent } from './composants/planificateur/ajusterday/ajusterday.component';
import { SuivicarteComponent } from './composants/planificateur/suivicarte/suivicarte.component';
import { VisualiserdayComponent } from './composants/planificateur/visualiserday/visualiserday.component';
import { PlanificateurComponent } from './composants/planificateur/planificateur.component';



const routes: Routes = [
  {path: "", component: PlanificateurComponent},
  {path:"planificateur/planningday", component:PlanningdayComponent},
  {path:"dashbord", component:DashboardComponent},
  {path:"ajusterday",component:AjusterdayComponent},
  {path:"suivicarte",component:SuivicarteComponent},
  {path:"visualiser",component:VisualiserdayComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
