import { Component, ContentChild, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms'
import { Observable, Subscription } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { CategoryService } from 'src/app/services/category.service'
import { Category } from 'src/app/types/category'
import { Transaction } from 'src/app/types/transaction'
import { TransactionType } from 'src/app/types/transaction-type'

type ActivityFormControls = 'amount' | 'categoryId' | 'description' | 'transactionType' | 'dateTime' | 'id'

@Component( {
  selector: 'plutus-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => ActivityFormComponent ),
      multi: true,
    },
  ],
} )
export class ActivityFormComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input( 'formName' ) formName: string
  @Input( 'transaction' ) transactionInfo: Transaction

  @Output( 'onSubmitButtonClick' )
  onSubmitButtonClick = new EventEmitter<Transaction>()

  @ContentChild( 'createButtonTemplate', { static: false } )
  submitButtonTemplateRef: TemplateRef<any>

  @ContentChild( 'updateButtonTemplate', { static: false } )
  updateButtonTemplateRef: TemplateRef<any>

  activityForm: FormGroup

  #componentSubscriptions: Subscription[]

  readonly #formControlNames: ActivityFormControls[] = ['amount', 'categoryId', 'description', 'transactionType', 'dateTime', 'id']

  onFormChange: ( state: unknown ) => undefined = () => undefined

  categories$: Observable<Category[]>

  compareWith( o1: Category, o2: Category ): boolean {
    return o1.name == o2.name
  }

  constructor( private categoryService: CategoryService ) {}

  ngOnDestroy(): void {
    this.#componentSubscriptions.forEach( s => s.unsubscribe() )
  }

  writeValue( obj: Transaction ): void {
    // TODO: Move this to a service
    if ( !obj ) return

    for ( const formControlName of this.#formControlNames ) {
      if ( formControlName != 'categoryId' ) this.activityForm.get( formControlName ).setValue( obj[formControlName] )
    }

    if ( obj['categoryId'] ) {
      this.activityForm.get( 'categoryId' ).setValue( obj['categoryId'] )
    }
  }

  private initializeCategories( transactionType: TransactionType ) {
    if ( transactionType == TransactionType.Credit ) {
      this.categories$ = this.categoryService.creditCategories$
    } else {
      this.categories$ = this.categoryService.debitCategories$
    }
    return this.categories$.pipe( tap( categories => this.activityForm.get( 'categoryId' ).setValue( categories[0].id ) ) )
  }

  registerOnChange( fn: ( state: unknown ) => undefined ): void {
    this.onFormChange = fn		      
  }

  registerOnTouched(): void {}     
  setDisabledState?(): void {}

  ngOnInit(): void {
    this.activityForm = new FormGroup( {
      id: new FormControl(),
      amount: new FormControl( '', Validators.compose( [Validators.min( 1 ), Validators.required, ] ) ),
      dateTime: new FormControl( new Date(), Validators.compose( [Validators.required] ) ),
      categoryId: new FormControl( '', Validators.compose( [Validators.required] ) ),
      description: new FormControl( '' ),
      transactionType: new FormControl( false ),
    } )

    this.#componentSubscriptions = [this.subscribeToFormChanges(), this.subscribeToCreditCheckboxChange()]
  }

  private subscribeToFormChanges() {
    return this.activityForm.valueChanges.pipe( tap( state => this.onFormChange( state ) ) ).subscribe()
  }

  private subscribeToCreditCheckboxChange() {
    return this.activityForm
      .get( 'transactionType' )
      .valueChanges.pipe( map( tt => ( ( tt && +tt ) || 0 ) ), tap( ( transactionType: TransactionType ) => this.#componentSubscriptions.push( this.initializeCategories( transactionType ).subscribe() ) ) )
      .subscribe()
  }
}

