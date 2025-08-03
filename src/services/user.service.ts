import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from '../Constants';
import { User } from '../models/User';
import { CollectionNames } from '../models/ICollection';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string;
  private userBehaviorSubject?: BehaviorSubject<User>;
  public $user?: Observable<User>;

  private userListBehaviorSubject?: BehaviorSubject<User[]>;
  public userListObservable?: Observable<User[]>;

  constructor(private http: HttpClient) {
    this.url = `${Constants.ApiBase}/users`;

    let _user = localStorage.getItem(Constants.LocalUser);
    let user = undefined;
    if (_user && _user !== 'undefined') {
      user = JSON.parse(_user);
    }
    this.userBehaviorSubject = new BehaviorSubject<User>(user);
    this.$user = this.userBehaviorSubject.asObservable();

    this.userListBehaviorSubject = new BehaviorSubject<User[]>(user);
    this.userListObservable = this.userListBehaviorSubject.asObservable();
  }
  updateUserState(user: User) {
    if (this.userBehaviorSubject) this.userBehaviorSubject.next(user);
    if (user) localStorage.setItem(Constants.LocalUser, JSON.stringify(user));
    else localStorage.removeItem(Constants.LocalUser);
  }
  updateUserListState(users: User[]) {
    if (this.userListBehaviorSubject) this.userListBehaviorSubject.next(users);
  }
  public get getUser() {
    return this.userBehaviorSubject?.value;
  }
  save(data: User): Observable<User> {
    return this.http.post<User>(`${this.url}/save.php`, data);
  }

  getStat(): Observable<any> {
    return this.http.get<any>(`${this.url}/get-admin-stat.php`);
  }
  getUserById(userId: number | string): Observable<User> {
    return this.http.get<User>(`${this.url}/get.php?UserId=${userId}`);
  }
  deleteUser(userId: number | string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/delete.php?UserId=${userId}`);
  }
  draft_order(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/draft-order.php?Id=${id}`);
  }
  users() {
    return this.http.get<User[]>(
      `${this.url}/users.php?websiteId=${CollectionNames.WebsiteId}&companyId=${CollectionNames.WebsiteId}`
    );
  }

  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.url}/login.php`, {
      ...data,
      website_id: CollectionNames.WebsiteId,
    });
  }
  verifyEmail(Email: string): Observable<User> {
    return this.http.get<User>(`${this.url}/get-by-email.php?Email=${Email}`);
  }
  logout(e: any = undefined) {
    if (this.userBehaviorSubject) this.userBehaviorSubject.next(e);
    localStorage.removeItem(Constants.LocalUser);
  }
  // Get user by token
  getUserByToken(token: string): Observable<User> {
    return this.http.get<User>(`${this.url}/get-by-token.php?token=${token}`);
  }

  // Get user by ID number
  getUserByIdNumber(id_number: string): Observable<User> {
    return this.http.get<User>(
      `${this.url}/get-by-id-number.php?IdNumber=${id_number}`
    );
  }

  // Get user by email or ID
  getUserByEmailOrId(value: string): Observable<User> {
    return this.http.get<User>(
      `${this.url}/get-by-id-email.php?value=${value}`
    );
  }

  // Generate login token
  generateToken(userId: number): Observable<User> {
    return this.http.get<User>(
      `${this.url}/generate-user-token.php?UserId=${userId}`
    );
  }

  // Clear login token
  clearToken(userId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.url}/clear-user-token.php?UserId=${userId}`
    );
  }

  // Update user password
  updatePassword(
    userId: number,
    newPassword: string,
    updatedBy: number
  ): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/update-password.php`, {
      UserId: userId,
      NewPassword: newPassword,
      UpdatedBy: updatedBy,
    });
  }
}
