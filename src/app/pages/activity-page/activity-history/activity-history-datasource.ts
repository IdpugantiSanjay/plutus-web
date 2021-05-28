import { DataSource } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { map } from 'rxjs/operators'
import { Observable, merge, BehaviorSubject } from 'rxjs'
import { Transaction } from 'src/app/types/transaction'


/**
 * Data source for the ActivityHistory view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ActivityHistoryDataSource extends DataSource<Transaction> {
  paginator: MatPaginator
  sort: MatSort

  public activities$: BehaviorSubject<Transaction[]>

  constructor( activities: Transaction[] ) {
    super()
    this.activities$ = new BehaviorSubject<Transaction[]>( activities )
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Transaction[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    if ( this.paginator && this.sort ) {
      const dataMutations = [this.activities$.asObservable(), this.paginator.page, this.sort.sortChange]

      return merge( ...dataMutations ).pipe(
        map( () => {
          return this.getPagedData( this.getSortedData( [...this.activities$.value] ) )
        } )
      )
    }

    return this.activities$.asObservable()
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData( data: Transaction[] ) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize
    return data.splice( startIndex, this.paginator.pageSize )
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData( data: Transaction[] ) {
    if ( !this.sort.active || this.sort.direction === '' ) {
      return data
    }

    return data.sort( ( a, b ) => {
      const isAsc = this.sort.direction === 'asc'

      switch ( this.sort.active ) {
      case 'description':
        return compare( a.description, b.description, isAsc )
      case 'category':
        return compare( a.category.name, b.category.name, isAsc )
      case 'amount': {
        const aAmount = Number( a.amount.toString().replace( '₹', '' ) )
        const bAmount = Number( b.amount.toString().replace( '₹', '' ) )
        return compare( aAmount, bAmount, isAsc )
      }
      case 'dateTime':
        return compare( +a.dateTime, +b.dateTime, isAsc )
      default:
        return 0
      }
    } )
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare( a: string | number, b: string | number, isAsc: boolean ) {
  return ( a < b ? -1 : 1 ) * ( isAsc ? 1 : -1 )
}
