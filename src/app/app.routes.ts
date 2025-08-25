import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { UserManageComponent } from './components/admin/user-components/user-manage/user-manage.component';
import { UserListComponent } from './components/admin/user-components/user-list/user-list.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { ProfileComponent } from './components/accounts/profile/profile.component';
import { EditProfileComponent } from './components/accounts/edit-profile/edit-profile.component';
import { LogoutComponent } from './logout/logout.component';
import { ApplicationsComponent } from './components/admin/applications/applications.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminDashboardComponent } from './app/admin/dashboard/admin-dashboard.component';
import { ReportsPageComponent } from './components/admin/reports/reports-page.component';
import { BankingDetailsPageComponent } from './components/admin/banking/banking-details-page.component';
import { adminRoutes } from './routes/admin.routes';
import { ApplyComponent } from './components/home/apply/apply.component.new';
import { LandingComponent } from './components/landing/landing.component';
import { LandingGoodLogicComponent } from './components/home/landing/landing.good.logic';
import { LandingHeroComponent } from './components/home/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingHeroComponent },
  // { path: '', component: LandingGoodLogicComponent },
  { path: 'apply', component: ApplyComponent },
  {
    path: 'application/:id/done',
    loadComponent: () =>
      import('./components/home/thank-you/thank-you.component').then(
        (m) => m.ThankYouComponent
      ),
  },
  {
    path: 'status',
    loadComponent: () =>
      import('./components/home/status/status.component').then(
        (m) => m.StatusComponent
      ),
  },
  { path: 'logout', component: LogoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  ...adminRoutes,
];
