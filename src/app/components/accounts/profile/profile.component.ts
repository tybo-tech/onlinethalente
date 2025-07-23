import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { User } from '../../../../models/User';
import { Application } from '../../../../models/schema';
import { CollectionNames } from '../../../../models/ICollection';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user?: User;
  loans: Application[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private dataService: CollectionDataService<Application>
  ) {
    this.user = this.userService.getUser;
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit(): void {
    if (this.user?.id) {
      this.dataService
        .getChildren(this.user.id, CollectionNames.Applications)
        .subscribe((entries) => {
          this.loans = entries.map((e) => {
            return {
              ...e.data,
              created_at: e.created_at,
            };
          });
          this.loading = false;
        });
    }
  }
  viewLoan(loan: Application) {
    console.log('Loan clicked:', loan);
    // You could route to a detail page or open modal
  }

  logout() {
    this.userService.logout();
    location.href = '/login'; // Force reload to clear state
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }
}
