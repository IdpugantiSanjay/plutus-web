import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'

import { BusyService } from '../services/busy.service'


@Injectable( {
  providedIn: 'root'
} )
export class BusyHttpInterceptor implements HttpInterceptor {
  constructor( private busyService: BusyService ) { }

  intercept( req: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
    this.busyService.increment()
    return next.handle( req ).pipe( finalize( () => this.busyService.decrement() ) ) as Observable<HttpEvent<unknown>>
  }
}
