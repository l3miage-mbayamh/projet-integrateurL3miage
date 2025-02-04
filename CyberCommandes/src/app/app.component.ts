import { Component } from '@angular/core';
import { PlanificateurComponent } from './components/planificateur/planificateur.component';
import { LivreurComponent } from './components/livreur/livreur.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    PlanificateurComponent,
    LivreurComponent
  ],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CyberCommandes';
}
