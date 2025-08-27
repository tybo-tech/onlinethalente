import { Routes } from '@angular/router';
import { adminGuard } from '../guards/admin.guard';
import { AdminComponent } from '../components/admin/admin.component';
import { AdminDashboardComponent } from '../app/admin/dashboard/admin-dashboard.component';
import { ApplicationsComponent } from '../components/admin/applications/applications.component';
import { BankingDetailsPageComponent } from '../components/admin/banking/banking-details-page.component';
import { ReportsPageComponent } from '../components/admin/reports/reports-page.component';
import { PayCyclesPageComponent } from '../components/admin/pay-cycles/pay-cycles-page.component';
import { LoanOffersPageComponent } from '../components/admin/loan-offers/loan-offers-page.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent
      },
      {
        path: 'pay-cycles',
        component: PayCyclesPageComponent
      },
      {
        path: 'loan-offers',
        component: LoanOffersPageComponent
      },
      {
        path: 'applications',
        component: ApplicationsComponent
      },
      {
        path: 'banking',
        component: BankingDetailsPageComponent
      },
      {
        path: 'reports',
        component: ReportsPageComponent
      }
    ]
  }
];
