import { Injectable } from '@angular/core'
import { TransactionListFilters } from '../types/transactionlist-filters'
import { Api } from '../ApiRoutes'
import { HttpService } from './http.service'
import { Observable, Subject } from 'rxjs'
import { Transaction } from '../types/transaction'
import { filter, map, tap } from 'rxjs/operators'
import { CategoryService } from './category.service'
import { HttpParams } from '@angular/common/http'

@Injectable( {
  providedIn: 'root',
} )
export class TransactionService {
  constructor( private http: HttpService, private categoryService: CategoryService ) {
    this.#deleted$ = this.#deletedSubject.asObservable()
  }

  areTransactionsEqual( t1: Transaction, t2: Transaction ): boolean {
    if ( !t1 || !t2 ) return false

    return (
      t1['amount'] == t2['amount'] &&
      t1['category'] == t2['category'] &&
      t1['id'] == t2['id'] &&
      t1['isCredit'] == t2['isCredit'] &&
      new Date( t1['dateTime'] ).toLocaleDateString() == new Date( t2['dateTime'] ).toLocaleDateString() &&
      t1['description'] == t2['description']
    )
  }

  create( transaction: Transaction ): Observable<{ id: string }> {
    return this.http.post( Api.transactions.toString(), transaction )
  }

  list( filters?: TransactionListFilters ): Observable<Transaction[]> {
    filters = filters || {}
    return this.http.get<Transaction[]>( Api.transactions.toString(), filters as { [p: string]: string } ).pipe(
      filter( t => !!( t && t.length ) ),
      map( ( t: Transaction[] ) => t.map( t => this.assignCategoryIcon( t ) ) ),
    )
  }

  private assignCategoryIcon( transaction: Transaction ): Transaction {
    const categoryWithIcon = this.categoryService.assignIconToCategory( transaction.category )
    transaction.category = categoryWithIcon
    return transaction
  }


  #deletedSubject = new Subject<{ id: string }>();
  #deleted$: Observable<{ id: string }>;

  get deleted$(): Observable<{ id: string }> {
    return this.#deleted$
  }

  delete( id: string ): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>( Api.transactions.withId( id ) ).pipe( tap( ( r ) => this.#deletedSubject.next( r ) ) )
  }

  findById( id: string ): Observable<Transaction> {
    return this.http.get( Api.transactions.withId( id ) )
  }

  update( transaction: Transaction ): Observable<Transaction> {
    return this.http.put( Api.transactions.withId( transaction.id ), transaction )
  }
}
