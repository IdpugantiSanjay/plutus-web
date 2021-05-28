import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router'
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  defaultIfEmpty,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators'
import { merge, Observable, of, Subject, Subscription } from 'rxjs'
import { FormBuilder, FormGroup } from '@angular/forms'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { MatTooltip } from '@angular/material/tooltip'
import { Transaction } from 'src/app/types/transaction'
import { CategoryService } from 'src/app/services/category.service'
import { TransactionService } from 'src/app/services/transaction.service'
import { Category } from 'src/app/types/category'
import { TransactionType } from 'src/app/types/transaction-type'
import { TransactionListFilters } from 'src/app/types/transactionlist-filters'

import { ActivityHistoryDataSource } from 'src/app/pages/activity-page/activity-history/activity-history-datasource'
import { NotificationService } from 'src/app/services/notification.service'
import { Location } from '@angular/common'
import { HttpParams } from '@angular/common/http'

@Component( {
  selector: 'plutus-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.css'],
} )
export class ActivityHistoryComponent implements OnInit, OnDestroy {
  @ViewChild( MatPaginator ) paginator: MatPaginator
  @ViewChild( MatSort ) sort: MatSort
  @ViewChild( MatTable ) table: MatTable<Transaction>
  dataSource: ActivityHistoryDataSource

  filters: TransactionListFilters = {}
  categories: Observable<Category[]>

  @Output( 'filtersChanged' ) filtersChanged = new EventEmitter<TransactionListFilters>()

  #componentSubscriptions: Subscription[] = []

  filtersGroup: FormGroup

  isHandset$: Observable<boolean>

  transactions$: Observable<Transaction[]> = of( [] )

  #dataChange: Subject<{ from: string; to: string }>
  dateChange$: Observable<{ from: string; to: string }>

  private filtersValue(): TransactionListFilters {
    const filters: TransactionListFilters = {
      from: new Date( this.filtersGroup.get( 'from' ).value ).toLocaleDateString(),
      to: new Date( this.filtersGroup.get( 'to' ).value ).toLocaleDateString(),
      categoryId: this.filtersGroup.get( 'categoryId' ).value,
      description: this.filtersGroup.get( 'description' ).value,
    }
    return filters
  }
  /**
   *
   */
  constructor(
    private transaction: TransactionService,
    private router: Router,
    public categoryService: CategoryService,
    private fb: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.#dataChange = new Subject()
    this.dateChange$ = this.#dataChange.asObservable()
    this.categories = categoryService.categories()

    const [presentYear, presentMonth] = [new Date().getFullYear(), new Date().getMonth()]

    this.filtersGroup = this.fb.group( {
      categoryId: [''],
      from: [new Date( presentYear, presentMonth, 1 )],
      to: [new Date( presentYear, presentMonth + 1, 0 )],
      description: '',
    } )

    this.isHandset$ = breakpointObserver.observe( Breakpoints.Handset ).pipe(
      map( ( result ) => result.matches ),
      shareReplay()
    )

    this.route.queryParams.subscribe( ( params ) => {
      if ( params['from'] ) {
        this.filtersGroup.get( 'from' ).setValue( new Date( params['from'] ) )
      }

      if ( params['to'] ) {
        this.filtersGroup.get( 'to' ).setValue( new Date( params['to'] ) )
      }

      if ( params['categoryId'] ) {
        this.filtersGroup.get( 'categoryId' ).setValue( params['categoryId'] )
      }

      if ( params['description'] ) {
        this.filtersGroup.get( 'description' ).setValue( params['description'] )
      }
    } )
  }

  ngOnDestroy(): void {
    this.#componentSubscriptions.forEach( ( cs ) => cs.unsubscribe() )
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['dateTime', 'category', 'amount', 'description', 'options']

  ngOnInit(): void {
    const categoryValueChange$ = this.filtersGroup.get( 'categoryId' ).valueChanges
    const descriptionValueChange$ = this.filtersGroup.get( 'description' ).valueChanges.pipe(
      filter( ( d: string ) => d.length > 3 || d.length === 0 ),
      distinctUntilChanged(),
      debounceTime( 500 )
    )

    const filtersChanged$ = merge( categoryValueChange$, descriptionValueChange$, this.dateChange$ ).pipe(
      tap( () => {
        const path = this.location.path()

        const filters = this.filtersValue()

        const valuedFilterKeys = Object.keys( this.filtersValue() ).filter( ( k ) => Boolean( filters[k] ) )

        const valuedFilters = {}
        valuedFilterKeys.forEach( ( f ) => ( valuedFilters[f] = filters[f] ) )

        console.log( valuedFilters )

        const pathWithoutQueryString = ~path.indexOf( '?' ) ? path.substring( 0, path.indexOf( '?' ) ) : path
        const params = new HttpParams( { fromObject: valuedFilters } ).toString()
        this.location.go( pathWithoutQueryString, params )
      } )
    )

    this.transactions$ = merge( filtersChanged$, this.transaction.deleted$ ).pipe(
      startWith( this.filtersValue() ),
      tap( () => this.filtersChanged.emit( this.filtersValue() ) ),
      switchMap( () => this.loadActivities( this.filtersValue() ) )
    )
  }

  private loadActivities( filters: TransactionListFilters ): Observable<Transaction[]> {
    return this.transaction.list( filters ).pipe(
      flatMap( ( x ) => x ),
      map( ( t ) => Object.assign( t, { dateTime: new Date( t.dateTime ).toDateString() } ) ),
      toArray(),
      share(),
      defaultIfEmpty( [] ),
      tap( ( transactions ) => {
        if ( !transactions || !transactions.length ) {
          this.notificationService.showErrorMessage( 'No Transactions Found Matching Applied Filters' )
        }
        this.dataSource = new ActivityHistoryDataSource( transactions )
        if ( this.table ) this.table.dataSource = this.dataSource
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      } )
    )
  }

  onEditClick( row: Transaction ): void {
    if ( row?.id ) {
      this.router.navigateByUrl( `/home/activity/edit/${row.id}` )
    }
  }

  onDeleteClick( row: Transaction ): void {
    const deleteTransaction$ = this.transaction
      .delete( row.id )
      .pipe( tap( () => this.notificationService.showSuccessMessage( { message: 'Deleted Successfully' } ) ) )
      .subscribe()
    this.#componentSubscriptions.push( deleteTransaction$ )
  }

  onDateChanged( startDate: Date | string, endDate: Date | string ): void {
    if ( startDate && endDate ) {
      this.filtersGroup.get( 'from' ).setValue( new Date( startDate ) )
      this.filtersGroup.get( 'to' ).setValue( new Date( endDate ) )

      this.#dataChange.next( {
        from: new Date( startDate ).toLocaleDateString(),
        to: new Date( endDate ).toLocaleDateString(),
      } )
    }
  }

  showTooltipFor2Seconds( tooltip: MatTooltip ): void {
    tooltip.show()
    setTimeout( () => tooltip.hide(), 1_000 )
  }

  //TODO: Move this to directive or service
  transactionColor( transaction: Transaction ): string {
    if ( transaction.transactionType == TransactionType.Credit ) return 'credit'
    if ( transaction.amount < 100 ) return 'low'
    if ( transaction.amount > 100 && transaction.amount < 1_000 ) return 'medium'
    return 'high'
  }
}
