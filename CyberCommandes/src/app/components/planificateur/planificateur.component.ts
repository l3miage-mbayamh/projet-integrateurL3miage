import { Component } from '@angular/core';

@Component({
  selector: 'app-planificateur',
  imports: [],
  standalone:true,
  templateUrl: './planificateur.component.html',
  styleUrl: './planificateur.component.css'
})
export class PlanificateurComponent {

  message :string = "Bienvenu sur la page du Planificateur"
}
