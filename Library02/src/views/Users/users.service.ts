import { User } from "@/models/user.model";
import { UserRest } from "@/service/rest/user.rest";
import { Observable, Subject } from "rxjs";

export class UserService {
  constructor(private _userRest = new UserRest()) {}
  private user$: Subject<any> = new Subject<any>();
  user: Observable<any> = this.user$.asObservable();

  getAllUsers(params?: {}) {
    this._userRest
      .getAllUsers(params)
      .pipe()
      .subscribe({
        next: (response) => {
          this.user$.next(response);
        },
      });
  }

  registerNewUser(body: User) {
    this._userRest
      .registerNewUser(body)
      .pipe()
      .subscribe({
        next: (response) => {
          this.user$.next(response);
        },
      });
  }

  deleteUser(id: string) {
    this._userRest
      .deleteUser(id)
      .pipe()
      .subscribe({
        next: (response) => {
          this.user$.next(response);
        },
      });
  }

  editUser(id: string, body: User) {
    this._userRest
    .editUser(id, body)
    .pipe()
    .subscribe({
      next: (response) => {
        this.user$.next(response)
      }
    })
  }
}
