import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-management-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <main class="container-fluid py-4">
        <h1 class="h3 mb-4 text-gray-800">Panel de Gestión</h1>
        <p>Bienvenido al área de gestión.</p>
    </main>
  `
})
export class ManagementHomeComponent { }
