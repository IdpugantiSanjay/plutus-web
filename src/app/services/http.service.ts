import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AbstractAuthenticationStore } from '../modules/authentication/services/abstract-authentication-store'
import { AuthenticationInfo } from '../types/authentication-info'
import { Observable } from 'rxjs'

@Injectable( {
  providedIn: 'root',
} )
export class HttpService {
  options = {}

  constructor( private http: HttpClient, private authStore: AbstractAuthenticationStore ) {
    const authenticationInfo = this.authStore.getAuthenticationInfo<AuthenticationInfo>() as AuthenticationInfo

    this.options = {
      headers: new HttpHeaders( {
        Authorization: `Bearer ${authenticationInfo.token}`,
      } ),
    }
  }

  post<T, R>( url: string, postBody: T ): Observable<R> {
    return this.http.post<R>( url, postBody, this.options )
  }

  delete<R>( url: string ): Observable<R> {
    return this.http.delete<R>( url, this.options )
  }

  get<R>( url: string, params?: { [p: string]: string } ): Observable<R> {
    params = params || {}

    for ( const param of Object.keys( params ).filter( p => !params[p] ) ) {
      delete params[param]
    }

    const options = { ...this.options, params: params }
    return this.http.get<R>( url, options )
  }

  put<T, R>( url: string, putBody: T ): Observable<R> {
    return this.http.put<R>( url, putBody, this.options )
  }
}
