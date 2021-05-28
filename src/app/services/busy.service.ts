import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable( {
  providedIn: 'root'
} )
export class BusyService {

  #working = 0

  private state = new BehaviorSubject( this.#working )

  isBusy$: Observable<boolean>

  constructor() {
    this.isBusy$ = this.state.pipe( map( s => s > 0 ) )
  }

  increment(): void {
    this.state.next( ++this.#working )
  }

  decrement(): void {
    this.state.next( --this.#working )
  }
}
