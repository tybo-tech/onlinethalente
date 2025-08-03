import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { AdminComponent } from './components/admin/admin.component';
import { OverviewComponent } from './components/overview/overview.component';
import { UserManageComponent } from './components/admin/user-components/user-manage/user-manage.component';
import { UserListComponent } from './components/admin/user-components/user-list/user-list.component';
import { AboutUsComponent } from './components/home/about-us/about-us.component';
import { ContactUsComponent } from './components/home/contact-us/contact-us.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { ProfileComponent } from './components/accounts/profile/profile.component';
import { EditProfileComponent } from './components/accounts/edit-profile/edit-profile.component';
import { LogoutComponent } from './logout/logout.component';
import { ApplyComponent } from './components/home/apply/apply.component';
import { ApplicationsComponent } from './components/admin/applications/applications.component';

import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LandingComponent,
      },
      {
        path: 'apply',
        component: ApplyComponent,
      },

      {
        path: 'about',
        component: AboutUsComponent,
      },
      {
        path: 'contact',
        component: ContactUsComponent,
      },

      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: OverviewComponent,
      },

      {
        path: 'applications',
        component: ApplicationsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },


      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'user/:id',
        component: UserManageComponent,
      },

    ],
  },
];
