import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { delay } from 'rxjs/operators'

import { BusyService } from './services/busy.service'
@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
} )
export class AppComponent {
  showSpinner: Observable<boolean>
  constructor( busyService: BusyService ) {
    this.showSpinner = busyService.isBusy$.pipe( delay( 10 ) )
  }
}
