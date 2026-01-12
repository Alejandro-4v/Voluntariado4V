import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../services/activities.service';
import { VolunteersService } from '../../../services/volunteers.service';
import { EntitiesService } from '../../../services/entities.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-management-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './management-home.component.html',
  styleUrls: ['./management-home.component.scss']
})
export class ManagementHomeComponent implements OnInit {
  private activitiesService = inject(ActivitiesService);
  private volunteersService = inject(VolunteersService);
  private entitiesService = inject(EntitiesService);

  stats = {
    totalVolunteers: 0,
    activeActivities: 0,
    totalEntities: 0,
    pendingApprovals: 0
  };

  recentActivities: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    forkJoin({
      volunteers: this.volunteersService.getAll(),
      activities: this.activitiesService.getAll(),
      entities: this.entitiesService.getAll()
    }).subscribe({
      next: (data) => {
        this.stats.totalVolunteers = data.volunteers.length;

        // Filter activities
        const activeActivities = data.activities.filter(a => a.estado === 'A');
        const pendingActivities = data.activities.filter(a => a.estado === 'P');

        this.stats.activeActivities = activeActivities.length;
        this.stats.pendingApprovals = pendingActivities.length;
        this.stats.totalEntities = data.entities.length;

        // Mock recent activity log based on fetched data
        this.recentActivities = [
          {
            action: 'Nueva solicitud de voluntariado',
            user: data.volunteers[0]?.nombre || 'Usuario',
            time: 'Hace 2 horas',
            type: 'info'
          },
          {
            action: 'Actividad creada',
            user: 'Administrador',
            target: activeActivities[0]?.nombre || 'Actividad',
            time: 'Hace 5 horas',
            type: 'success'
          },
          {
            action: 'Entidad registrada',
            user: data.entities[0]?.nombre || 'Entidad',
            time: 'Ayer',
            type: 'primary'
          }
        ];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading = false;
      }
    });
  }
}
