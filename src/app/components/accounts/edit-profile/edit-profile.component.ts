import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormInput } from '../../../../models/FormInput';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [DynamicFormComponent, CommonModule],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent {
  formInputs: FormInput[] = [];
  currentUser?: User;

  constructor(private userService: UserService, private router: Router) {
    this.currentUser = this.userService.getUser;

    this.formInputs = [
      {
        key: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
      },
      {
        key: 'email',
        label: 'Email (Not Editable)',
        type: 'email',
        readonly: true, // Email should not be editable
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
  }

  onSubmit(update: any) {
    if (!this.currentUser) return;
    const updatedUser: User = {
      ...this.currentUser,
      ...update,
      updated_by: this.currentUser.id,
    };
    updatedUser.email = '***********'; // Mask email for security, as it should not be editable
    this.userService.save(updatedUser).subscribe({
      next: (response) => {
        if(response && response.id) {
        this.userService.updateUserState(response); // Update local state
        this.router.navigate(['/profile']);
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      },
    });
  }
}
