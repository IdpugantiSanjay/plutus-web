import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { iif } from 'rxjs'
import { filter, switchMap, tap } from 'rxjs/operators'
import { NotificationService } from 'src/app/services/notification.service'
import { TransactionService } from 'src/app/services/transaction.service'
import { Transaction } from 'src/app/types/transaction'
import { TransactionType } from 'src/app/types/transaction-type'

@Component( {
  selector: 'plutus-new-activity',
  templateUrl: './new-activity.component.html',
  styleUrls: ['./new-activity.component.css'],
} )
export class NewActivityComponent implements OnInit {
  activityFormGroup: FormGroup

  private readonly defaultFormValues: Transaction = {
    amount: 0,
    category: { name: '', transactionType: TransactionType.Debit, icon: '', id: '' },
    dateTime: new Date(),
    description: '',
    transactionType: 0,
    categoryId: '',
  }

  constructor( private transactionService: TransactionService, private router: Router, private notificationService: NotificationService ) {
    const activityFormData = new FormControl( this.defaultFormValues )
    this.activityFormGroup = new FormGroup( {
      activityFormData,
    } )
  }

  ngOnInit(): void {}

  onCreateButtonClick( transaction: Transaction ): void {
    transaction.transactionType = +( transaction.transactionType || false )
    this.transactionService
      .create( transaction )
      .pipe(
        tap( () => this.router.navigateByUrl( '/home/activity/history' ) ),
        switchMap( ( createdTransaction ) =>
          this.notificationService.showSuccessMessage( { message: 'Transaction Created Successfully', data: createdTransaction.id, action: 'Undo' } )
        ),
        filter( ( r: string | undefined ) => !!r ),
        switchMap( ( r ) => this.transactionService.delete( r ) ),
        switchMap( ( dr ) =>
          iif(
            () => !!dr.id,
            this.notificationService.showSuccessMessage( {
              message: 'Undo Successful',
            } )
          )
        )
      )
      .subscribe()
  }
}
