import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { EMPTY, Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AbstractAuthenticationStore } from '../modules/authentication/services/abstract-authentication-store'
import { NotificationService } from '../services/notification.service'
import { AuthenticationInfo } from '../types/authentication-info'

@Injectable( {
  providedIn: 'root'
} )
export class AuthHttpService implements HttpInterceptor {

  constructor( private authStore: AbstractAuthenticationStore, private notification: NotificationService, private router: Router ) { }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const authenticationInfo = this.authStore.getAuthenticationInfo<AuthenticationInfo>() as AuthenticationInfo
    if ( authenticationInfo ) {
      const headers = { Authorization: `Bearer ${authenticationInfo.token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      req = req.clone( {
        setHeaders: headers,
      } )

      // if ( ( req.method == 'POST' || req.method == 'PUT' ) && authenticationInfo.username && !req.body?.username ) {
      //   req = req.clone( {
      //     body: { ...req.body, username: authenticationInfo.username }
      //   } )
      // } else
      if ( ~req.url.indexOf( 'api/users' ) && authenticationInfo.username && !req.url.includes( '/api/users/authenticate' )  ) {
        req = req.clone( {
          url: req.url.replace( 'api/users', `api/users/${authenticationInfo.username}` )
        } )
      }

      if ( ( ['POST', 'PUT'].includes( req.method )  ) && authenticationInfo.username ) {
        req = req.clone( {
          body: { ...req.body, username: authenticationInfo.username }
        } )
      }
    }
    return next.handle( req ).pipe( this.handleAuthorizationErrors.bind( this ) )
  }

  handleAuthorizationErrors( source: Observable<HttpEvent<unknown>> ): Observable<HttpEvent<unknown>> {
    return source.pipe(
      catchError( ( error ) => {
        return error.status === 401 ? this.handle401( error ) : throwError( error )
      } )
    )
  }

  handle401( httpError: HttpErrorResponse ): Observable<never> {
    if ( httpError.error && httpError.error.message ) {
      this.notification.showErrorMessage( httpError.error.message )
    } else {
      this.notification.showErrorMessage( 'Authentication Error Please Login Again' )
      this.router.navigateByUrl( '/login' )
    }
    return EMPTY
  }
}
