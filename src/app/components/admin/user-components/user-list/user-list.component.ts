import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../models/User';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  users: User[] = [];
  loading = true;
  constructor(private userService: UserService) {
    this.loadUsers();
  }
  loadUsers() {
    this.loading = true;
    this.userService.users().subscribe({
      next: (users) => {
        this.users = users || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      },
    });
  }
  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.loading = true;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.loading = false;
      },
    });
  }
}
