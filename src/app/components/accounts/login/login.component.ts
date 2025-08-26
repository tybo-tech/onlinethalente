import { Component, OnInit } from '@angular/core';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormInput } from '../../../../models/FormInput';
import { UserService } from '../../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [DynamicFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  showPassword = false;
  private offerId: string | null = null;

  formInputs: FormInput[] = [
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      icon: 'fa-envelope',
      placeholder: 'Enter your email address',
      validators: [
        {
          name: 'email',
          message: 'Please enter a valid email address'
        }
      ],
      errorMessages: {
        required: 'Email is required to log in'
      }
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      icon: 'fa-lock',
      rightIcon: 'fa-eye',
      placeholder: 'Enter your password',
      validators: [
        {
          name: 'minLength',
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      ],
      errorMessages: {
        required: 'Password is required to log in'
      }
    },
  ];
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.updatePasswordVisibility();
  }

  ngOnInit() {
    this.offerId = this.route.snapshot.queryParamMap.get('offerId');
  }

  private updatePasswordVisibility() {
    const passwordInput = this.formInputs[1]; // Password is second input
    passwordInput.type = this.showPassword ? 'text' : 'password';
    passwordInput.rightIcon = this.showPassword ? 'fa-eye-slash' : 'fa-eye';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.updatePasswordVisibility();
  }
  onLogin({ email, password }: any): void {
    this.userService.login({ email, password }).subscribe({
      next: (response) => {
        if (response && response.id) {
          console.log('User logged successfully:', response);
          this.userService.updateUserState(response);
          if (this.offerId) {
            this.router.navigate(['/apply'], { queryParams: { offerId: this.offerId } });
          } else {
            this.router.navigate(['/profile']);
          }
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        // Update the form inputs with error state
        this.formInputs = this.formInputs.map(input => ({
          ...input,
          errorMessages: {
            ...input.errorMessages,
            server: 'Invalid email or password'
          }
        }));
      },
    });
  }
}
