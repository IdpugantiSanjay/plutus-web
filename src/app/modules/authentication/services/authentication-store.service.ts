import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {AbstractAuthenticationStore} from './abstract-authentication-store'

@Injectable( {
  providedIn: 'root',
} )
export class DefaultAuthenticationStoreService
implements AbstractAuthenticationStore {

  authenticationInfo: unknown;
  readonly #localStorageKey = 'authInfo';

  constructor() {
  }

  public saveAuthenticationInfo<T>(
    authenticationResponse: T
  ): T | Observable<T> | Promise<T> {

    this.authenticationInfo = authenticationResponse

    localStorage.setItem(
      this.#localStorageKey,
      JSON.stringify( authenticationResponse )
    )

    return authenticationResponse
  }

  public getAuthenticationInfo<T>():
    | T
    | undefined
    | Observable<T | undefined>
    | Promise<T | undefined> {


    if ( this.authenticationInfo ) return this.authenticationInfo as T

    const cachedAuthenticationInfoString = localStorage.getItem(
      this.#localStorageKey
    )

    if ( cachedAuthenticationInfoString ) {
      const parsedAuthenticationInfo = JSON.parse( cachedAuthenticationInfoString )
      if ( !this.authenticationInfo ) {
        this.authenticationInfo = parsedAuthenticationInfo
      }
      return parsedAuthenticationInfo
    }
    return undefined
  }

  public clearAuthenticationInfo(): void {
    this.authenticationInfo = undefined
    localStorage.removeItem( this.#localStorageKey )
  }
}
