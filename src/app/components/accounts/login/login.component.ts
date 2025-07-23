import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormInput } from '../../../../models/FormInput';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [DynamicFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formInputs: FormInput[] = [
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter your password',
    },
  ];
  constructor(private userService: UserService, private router: Router) {}
  onLogin({ email, password }: any): void {
    this.userService.login({ email, password }).subscribe({
      next: (response) => {
        if (response && response.id) {
          console.log('User logged successfully:', response);
          this.userService.updateUserState(response);
          this.router.navigate(['/profile']);
        }
      },
      error: (error) => {
        console.error('Error registering user:', error);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
}
