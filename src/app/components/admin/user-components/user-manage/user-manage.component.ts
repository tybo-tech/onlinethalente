import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { FormInput } from '../../../../../models/FormInput';
import { initUser, ROLES, User } from '../../../../../models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-manage',
  imports: [DynamicFormComponent, CommonModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss',
})
export class UserManageComponent {
  id: string = 'add';
  isEdit = false;
  userId: number = 0;
  loading = false;
  initialData: User = initUser();
  formInputs: FormInput[] = [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name',
    },
    {
      key: 'email',
      label: 'Email ',
      type: 'email',
      placeholder: 'Enter your email address',
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter your phone number',
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter your address',
    },
  ];
  roles = ROLES;
  currentUser: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.formInputs.push({
      key: 'role',
      label: 'Role',
      type: 'select',
      options: this.roles.map((role) => ({
        value: role.name,
        label: role.name,
      })),
      required: true,
      placeholder: 'Select user role',
    });
    this.loading = true;
    this.id = this.route.snapshot.paramMap.get('id') || 'add';
    this.isEdit = this.id !== 'add' && !isNaN(+this.id);
    if (this.isEdit) {
      this.userId = +this.id;
      this.userService.getUserById(this.userId).subscribe((res) => {
        this.loading = false;
        if (res && res.id) {
          this.initialData = res;
        }
      });
    } else {
      this.initialData = initUser();
      this.loading = false;
    }
  }

  onSave(data: any) {
    this.loading = true;
    const updatedUser: User = {
      ...this.initialData,
      ...data,
      updated_by: this.currentUser?.id || 0,
    };

    const save$ = this.userService.save(updatedUser);

    save$.subscribe({
      next: () => {
        this.router.navigate(['/admin/users']);
        this.loading = false;
      },
      error: () => {
        alert('Something went wrong while saving.');
        this.loading = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/admin/categories']);
  }
}
