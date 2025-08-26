import { Routes } from '@angular/router';
import { RegisterComponent } from './components/accounts/register/register.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { ProfileComponent } from './components/accounts/profile/profile.component';
import { EditProfileComponent } from './components/accounts/edit-profile/edit-profile.component';
import { LogoutComponent } from './logout/logout.component';
import { adminRoutes } from './routes/admin.routes';
import { LandingComponent } from './components/landing/landing.component';
import { ApplyPageComponent } from './components/home/apply/apply';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,

    children: [
      { path: '', component: LandingComponent },
      { path: 'apply', component: ApplyPageComponent },
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
      { path: 'accounts/login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'accounts/register', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent },
    ],
  },

  ...adminRoutes,
];
