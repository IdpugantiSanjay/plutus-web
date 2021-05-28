import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core'
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { find, flatMap } from 'rxjs/operators'
import { CategoryService } from '../services/category.service'
import { Category } from '../types/category'

type CategoryGroup = {
  name: string
  categories: Observable<Category[]>
}

@Component( {
  selector: 'plutus-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => CategoriesComponent ),
      multi: true,
    },
  ],
} )
export class CategoriesComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input( 'categories' ) categories: Observable<Category[]>
  @Input( 'showAllCategories' ) showAllCategories = false

  categoryGroups: Observable<CategoryGroup[]>

  categoryControl = new FormControl()

  compareFunction( o1: Category, o2: Category ): boolean {
    return ( o1.name == o2.name && o1.id == o2.id )
  }

  public emitCategoryChange: ( $event: unknown ) => void = () => {}

  constructor( public categoryService: CategoryService ) {
    this.categories = of( [] )
    this.categoryGroups = of( [
      { name: 'Debit', categories: this.categoryService.debitCategories$ },
      { name: 'Credit', categories: this.categoryService.creditCategories$ },
    ] )
  }

  ngAfterViewInit(): void {
  }

  writeValue( value: Category | string ): void {
    const isCategoryId = ( value: Category | string  ): boolean =>  typeof value == 'string'

    if ( value && isCategoryId( value ) ) {
      this.categoryService.categories().pipe( flatMap( x => x ), find( c => c.id == value ) ).subscribe( found => {
        this.categoryControl.setValue( found )
      } )
    } else {
      this.categoryControl.setValue( value )
    }
  }

  onValueChange( $event: Category ): void {
    this.emitCategoryChange(  $event?.['id'] )
  }

  registerOnChange( fn: ( $event: unknown ) => void ): void {
    this.emitCategoryChange = fn
  }

  registerOnTouched(): void {}

  setDisabledState?(): void {}

  ngOnInit(): void {}
}
