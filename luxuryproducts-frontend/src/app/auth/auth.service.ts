import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "./auth-response.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthRequest } from "./auth-request.model";
import { TokenService } from "./token.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private base_url = environment.base_url;
  private _loginEndpoint: string = this.base_url + "/auth/login";
  private _registerEndpoint: string = this.base_url + "/auth/register";

  public $userIsLoggedIn: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _role: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
    if (this.tokenService.isValid()) {
      this.$userIsLoggedIn.next(true);
      this._role.next(this.tokenService.getRole() || "");
    }
  }

  public login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this._loginEndpoint, authRequest).pipe(
      tap((authResponse: AuthResponse) => {
        this.tokenService.storeToken(authResponse.token);
        this.$userIsLoggedIn.next(true);
        this._role.next(this.tokenService.getRole() || "");
      }),
    );
  }

  public register(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this._registerEndpoint, authRequest)
      .pipe(
        tap((authResponse: AuthResponse) => {
          this.tokenService.storeToken(authResponse.token);
          this.$userIsLoggedIn.next(true);
          this._role.next(this.tokenService.getRole() || "");
        }),
      );
  }

  public logOut(): void {
    this.tokenService.removeToken();
    this.$userIsLoggedIn.next(false);
    this._role.next("");
  }

  public getRole(): Observable<string> {
    return this._role.asObservable();
  }
}
