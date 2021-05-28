import {forwardRef, Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {DefaultAuthenticationStoreService} from './authentication-store.service'

@Injectable( {
  providedIn: 'root',
  useClass: forwardRef( () => DefaultAuthenticationStoreService ),
} )
export abstract class AbstractAuthenticationStore {
  public abstract saveAuthenticationInfo<T>(
    authenticationInfo: T
  ): Observable<T> | T | Promise<T>;

  public abstract getAuthenticationInfo<T>():
    | T
    | undefined
    | Observable<T | undefined>
    | Promise<T | undefined>;

  public abstract clearAuthenticationInfo(): void
}
