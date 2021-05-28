import { Component, Inject, OnInit } from '@angular/core'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'

@Component( {
  selector: 'plutus-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
} )
export class SuccessMessageComponent implements OnInit {

  constructor( @Inject( MAT_SNACK_BAR_DATA ) public data: { message: string, action: string }, public snackBarRef: MatSnackBarRef<SuccessMessageComponent>, ) { }

  ngOnInit(): void {
  }


  onActionClick(): void {
    this.snackBarRef.dismissWithAction()
  }
}
