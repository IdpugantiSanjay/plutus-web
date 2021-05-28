import {Injectable} from '@angular/core'
import {CanActivate, Router, UrlTree,} from '@angular/router'
import {Observable} from 'rxjs'
import {AuthenticationService} from '../modules/authentication/services/authentication.service'
import {AbstractAuthenticationStore} from '../modules/authentication/services/abstract-authentication-store'

@Injectable( {
  providedIn: 'root',
} )
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor( private router: Router, private authenticationService: AuthenticationService, private authenticationStore: AbstractAuthenticationStore ) {
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if ( this.authenticationService.isUserAuthenticated || this.authenticationStore.getAuthenticationInfo() ) {
      return true
    }
    this.router.navigateByUrl( '/login' )
    return false
  }
}
