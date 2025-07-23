import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { AdminComponent } from './components/admin/admin.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ListCategoriesComponent } from './components/admin/category-components/list-categories/list-categories.component';
import { CategoryFormComponent } from './components/admin/category-components/category-form/category-form.component';
import { UserManageComponent } from './components/admin/user-components/user-manage/user-manage.component';
import { UserListComponent } from './components/admin/user-components/user-list/user-list.component';
import { OrderManageComponent } from './components/admin/order-components/order-manage/order-manage.component';
import { OrderListComponent } from './components/admin/order-components/order-list/order-list.component';
import { ProductManageComponent } from './components/admin/product-components/product-manage/product-manage.component';
import { ProductListComponent } from './components/admin/product-components/product-list/product-list.component';
import { CategoryPageComponent } from './components/home/category-page/category-page.component';
import { ListPrintablesComponent } from './components/admin/product-components/list-printables/list-printables.component';
import { ManagePrintableComponent } from './components/admin/product-components/manage-printable/manage-printable.component';
import { GalleryListComponent } from './components/admin/settings/gallery-list/gallery-list.component';
import { GalleryManageComponent } from './components/admin/settings/gallery-manage/gallery-manage.component';
import { DetailsPageComponent } from './components/home/details-page/details-page.component';
import { AboutUsComponent } from './components/home/about-us/about-us.component';
import { ContactUsComponent } from './components/home/contact-us/contact-us.component';
import { ShopCategoriesComponent } from './components/home/shop-categories/shop-categories.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { ProfileComponent } from './components/accounts/profile/profile.component';
import { EditProfileComponent } from './components/accounts/edit-profile/edit-profile.component';
import { LogoutComponent } from './logout/logout.component';
import { VariationListComponent } from './components/admin/variations/variation-list/variation-list.component';
import { ManageVariationComponent } from './components/admin/variations/manage-variation/manage-variation.component';
import { ApplyComponent } from './components/home/apply/apply.component';
import { ApplicationsComponent } from './components/admin/applications/applications.component';

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
        path: 'categories',
        component: ListCategoriesComponent,
      },
      {
        path: 'category/:id',
        component: CategoryPageComponent,
      },
      {
        path: 'details/:id',
        component: DetailsPageComponent,
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
        path: 'shop',
        component: ShopCategoriesComponent,
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
        path: 'categories',
        component: ListCategoriesComponent,
      },
      {
        path: 'applications',
        component: ApplicationsComponent,
      },
      {
        path: 'category/:id',
        component: CategoryFormComponent,
      },
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'product/:id',
        component: ProductManageComponent,
      },
      {
        path: 'printables',
        component: ListPrintablesComponent,
      },
      {
        path: 'printable/:id',
        component: ManagePrintableComponent,
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'order/:id',
        component: OrderManageComponent,
      },
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'user/:id',
        component: UserManageComponent,
      },
      {
        path: 'projects',
        component: GalleryListComponent,
      },
      {
        path: 'project/:id',
        component: GalleryManageComponent, // Assuming this is the same component for managing projects
      },
      {
        path: 'variations',
        component: VariationListComponent,
      },
      {
        path: 'variation/:id',
        component: ManageVariationComponent,
      },
    ],
  },
];
