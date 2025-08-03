import { Component } from '@angular/core';
import { FormInput } from '../../../../models/FormInput';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { initUser } from '../../../../models/User';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { CollectionNames } from '../../../../models/ICollection';

@Component({
  selector: 'app-register',
  imports: [DynamicFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private userService: UserService, private router: Router) {}
  formInputs: FormInput[] = [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your last name',
    },
    {
      key: 'idNumber',
      label: 'ID Number',
      type: 'text',
      required: true,
      placeholder: 'Enter your South African ID',
    },
    {
      key: 'cellphone',
      label: 'Cellphone Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter your phone number',
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Create your password',
    },
  ];

  onSignUp({ email, password, firstName, lastName, idNumber }: any): void {
    const user = initUser();
    user.email = email;
    user.password = password;
    user.id_number = idNumber;
    user.name = `${firstName} ${lastName}`;
    user.created_by = 1; // Assuming 1 is the ID of the admin creating the user
    user.website_id = CollectionNames.WebsiteId;
    user.company_id = CollectionNames.WebsiteId;
    this.userService.save(user).subscribe({
      next: (response) => {
        if (response && response.id) {
          console.log('User registered successfully:', response);
          this.userService.updateUserState(response); // Update the user state in the service
          this.router.navigate(['/profile']); // Redirect to login page after successful registration
          // Optionally, redirect or show a success message
        }
      },
      error: (error) => {
        console.error('Error registering user:', error);
      },
    });
    console.log({
      email,
      password,
      firstName,
      lastName,
    });
  }
}
