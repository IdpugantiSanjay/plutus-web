import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'
import { TransactionService } from 'src/app/services/transaction.service'
import { Transaction } from 'src/app/types/transaction'


@Component( {
  selector: 'plutus-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css'],
} )
export class EditActivityComponent implements OnInit, OnDestroy {

  editActivityFormGroup: FormGroup

  #subscription: Subscription

  savedTransaction: Transaction

  activityFormControl: FormControl

  get transactionUnchanged(): boolean {
    return this.transactionService.areTransactionsEqual( this.savedTransaction, this.activityFormControl.value )
  }

  get disableUpdateButton(): boolean {
    const disableUpdateButton = ( this.activityFormControl && this.activityFormControl.invalid ) || this.transactionUnchanged
    return disableUpdateButton
  }

  constructor( route: ActivatedRoute, private transactionService: TransactionService, private router: Router ) {
    this.activityFormControl = new FormControl()
    this.editActivityFormGroup = new FormGroup( {activityFormData: this.activityFormControl} )

    this.#subscription = route.paramMap
      .pipe( switchMap( pMap => this.getTransactionInfo( transactionService, pMap ) ) )
      .subscribe( ( response: Transaction ) => this.activityFormControl.setValue( response ) )
  }

  ngOnDestroy(): void {
    this.#subscription.unsubscribe()
  }

  private getTransactionInfo( transactionService: TransactionService, pMap: ParamMap ) {
    return transactionService.findById( pMap.get( 'transactionId' ) ).pipe(
      tap( ( transaction: Transaction ) => {
        this.savedTransaction = transaction
      } )
    )
  }


  ngOnInit(): void {}

  onUpdateButtonClick(): void {
    const transaction = this.activityFormControl.value as Transaction
    transaction.dateTime = new Date( transaction.dateTime ).toJSON()
    
    this.transactionService
      .update( transaction )
      .pipe( tap( () => this.router.navigateByUrl( '/home/activity/history' ) ) )
      .subscribe()
  }
}
