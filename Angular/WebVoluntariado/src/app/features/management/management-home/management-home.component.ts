import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../services/activities.service';
import { VolunteersService } from '../../../services/volunteers.service';
import { EntitiesService } from '../../../services/entities.service';
import { forkJoin, of } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
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
  private authService = inject(AuthService);

  stats = {
    totalVolunteers: 0,
    activeActivities: 0,
    totalEntities: 0,
    pendingApprovals: 0
  };

  entitiesGrowth = 0;
  recentActivities: any[] = [];
  isLoading = true;
  userRole: string = '';

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || '';
    const isEntity = this.userRole === 'entity';

    forkJoin({
      volunteers: isEntity ? of([]) : this.volunteersService.getAll(),
      activities: this.activitiesService.getAll(),
      entities: this.entitiesService.getAll()
    }).subscribe({
      next: (data) => {
        this.stats.totalVolunteers = data.volunteers.length;


        if (isEntity) {
          // Filter activities for the logged-in entity
          const entityId = currentUser?.id;
          if (entityId) {
            data.activities = data.activities.filter((a: any) => a.convoca?.idEntidad === entityId);
          }
        }

        const activeActivities = data.activities.filter(a => a.estado === 'A');
        const pendingActivities = data.activities.filter(a => a.estado === 'P');

        this.stats.activeActivities = activeActivities.length;
        this.stats.pendingApprovals = pendingActivities.length;
        this.stats.totalEntities = data.entities.length;


        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const currentYear = now.getFullYear();
        const lastMonthYear = thisMonth === 0 ? currentYear - 1 : currentYear;

        const entitiesThisMonth = data.entities.filter(e => {
          const date = new Date(e.fechaRegistro);
          return date.getMonth() === thisMonth && date.getFullYear() === currentYear;
        }).length;

        const entitiesLastMonth = data.entities.filter(e => {
          const date = new Date(e.fechaRegistro);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;

        if (entitiesLastMonth > 0) {
          this.entitiesGrowth = Math.round(((entitiesThisMonth - entitiesLastMonth) / entitiesLastMonth) * 100);
        } else {
          this.entitiesGrowth = entitiesThisMonth > 0 ? 100 : 0;
        }


        const latestActivities = data.activities
          .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime())
          .slice(0, 3)
          .map(a => ({
            action: 'Actividad programada',
            user: 'Sistema',
            target: a.nombre,
            time: new Date(a.inicio).toLocaleDateString(),
            type: 'success'
          }));

        const latestEntities = data.entities
          .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
          .slice(0, 2)
          .map(e => ({
            action: 'Nueva entidad registrada',
            user: e.nombre,
            time: new Date(e.fechaRegistro).toLocaleDateString(),
            type: 'primary'
          }));


        this.recentActivities = [...latestActivities, ...latestEntities]
          .sort((a, b) => {
            return 0;
          });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading = false;
      }
    });
  }
  private router = inject(Router);

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  downloadReport() {
    const reportData = [
      ['Métrica', 'Valor'],
      ['Voluntarios Totales', this.stats.totalVolunteers],
      ['Actividades Activas', this.stats.activeActivities],
      ['Entidades Colaboradoras', this.stats.totalEntities],
      ['Pendientes de Aprobación', this.stats.pendingApprovals]
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
      + reportData.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_dashboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
