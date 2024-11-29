import { AuthRequest, AuthResponse } from "@/models/login.model";
import { LoginRest } from "@/service/rest/login.rest";
import { Observable, Subject } from "rxjs";

export class LoginService {
  constructor(private _loginRest = new LoginRest()) {}
  private loginSubject$: Subject<AuthRequest> = new Subject<AuthRequest>();
  loginSubject: Observable<AuthRequest> = this.loginSubject$.asObservable();

  loginRest(body: AuthRequest) {
    this._loginRest
      .login(body)
      .pipe()
      .subscribe({
        next: (response) => {
          this.loginSubject$.next(response as AuthRequest);
        },error(err) {
          return err
        }
      });
  }
}
