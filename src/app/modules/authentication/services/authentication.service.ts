import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { tap } from 'rxjs/operators'
import { AbstractAuthenticationStore } from './abstract-authentication-store'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LOGIN_URL, REGISTRATION_URL } from 'src/app/di-tokens/auth-url-tokens'
import { Observable } from 'rxjs'

@Injectable( {
  providedIn: 'root',
} )
export class AuthenticationService {
  #isUserAuthenticated = false;

  constructor(
    private http: HttpClient,
    private authenticationStore: AbstractAuthenticationStore,
    @Inject( LOGIN_URL ) private LOGIN_URL: string,
    @Inject( REGISTRATION_URL ) private REGISTRATION_URL: string
  ) {}

  get isUserAuthenticated(): boolean {
    return this.#isUserAuthenticated
  }

  authenticate<T>( authenticationInfo: T ) : Observable<unknown>  {
    return this.http
      .post( this.LOGIN_URL, authenticationInfo )
      .pipe( tap( { next: resp => this.cacheAuthenticationResponse( resp as T ) } ) )
  }

  registerUser<T>( registrationInfo: T ): Observable<unknown> {
    return this.http.post( this.REGISTRATION_URL, registrationInfo )
  }

  public clearCachedAuthenticationResponse(): void {
    this.authenticationStore.clearAuthenticationInfo()
    this.#isUserAuthenticated = false
  }

  private cacheAuthenticationResponse<T>( authenticationResponse: T | undefined ) {
    this.authenticationStore.saveAuthenticationInfo( authenticationResponse )
    this.#isUserAuthenticated = true
    return authenticationResponse
  }
}
