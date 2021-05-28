import { Component, OnInit } from '@angular/core'
import { TransactionService } from '../services/transaction.service'

@Component( {
  selector: 'plutus-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
} )
export class ActivityComponent implements OnInit {
  constructor( private transaction: TransactionService ) {}

  ngOnInit(): void {}
}
