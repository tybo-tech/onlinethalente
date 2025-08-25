import { Routes } from '@angular/router';
import { adminGuard } from '../guards/admin.guard';
import { AdminComponent } from '../components/admin/admin.component';
import { ReportsPageComponent } from '../components/admin/reports/reports-page.component';
import { BankingDetailsPageComponent } from '../components/admin/banking/banking-details-page.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'reports',
        component: ReportsPageComponent
      },
      {
        path: 'banking',
        component: BankingDetailsPageComponent
      }
    ]
  }
];
