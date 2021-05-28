import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { filter, flatMap, map, share, toArray } from 'rxjs/operators'
import { Api } from '../ApiRoutes'
import { Category, CategoryWithIcon, CreditCategory, DebitCategory } from '../types/category'
import { TransactionType } from '../types/transaction-type'
import { HttpService } from './http.service'

@Injectable( {
  providedIn: 'root',
} )
export class CategoryService {
  public get debitCategories$(): Observable<DebitCategory[]> {
    return this.categories().pipe(
      flatMap( ( c ) => c ),
      filter( ( c ) => c.transactionType == TransactionType.Debit ),
      toArray<DebitCategory>()
    )
  }

  public get creditCategories$(): Observable<CreditCategory[]> {
    return this.categories().pipe(
      flatMap( ( c ) => c ),
      filter( ( c ) => c.transactionType == TransactionType.Credit ),
      toArray<CreditCategory>()
    )
  }

  #cachedCategories: Observable<CategoryWithIcon[]>

  constructor( private http: HttpService ) {}

  public categories(): Observable<CategoryWithIcon[]> {
    if ( this.#cachedCategories ) {
      return this.#cachedCategories
    }
    this.#cachedCategories = this.http.get<CategoryWithIcon[]>( Api.categories.toString() ).pipe(
      flatMap( ( c ) => c ),
      map( ( c ) => this.assignIconToCategory( c ) ),
      toArray(),
      share()
    )
    return this.#cachedCategories
  }

  public assignIconToCategory( category: Category ): CategoryWithIcon {
    const icon = {
      'Food & Drinks': 'fastfood',
      Travel: 'local_taxi',
      Bills: 'receipt',
      Salary: 'money',
    }

    let categoryIcon: string
    if ( category.name == 'Transfer' ) {
      categoryIcon = category.transactionType == 1 ? 'money_off' : 'attach_money'
    } else {
      categoryIcon = icon[category.name]
    }

    return { ...category, icon: categoryIcon }
  }
}
