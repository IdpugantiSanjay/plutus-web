import { Component, OnInit } from '@angular/core'

type ActivatedComponent = 'ActivityHistoryComponent' | 'NewActivityComponent'

@Component( {
  selector: 'plutus-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.css'],
} )
export class ActivityPageComponent implements OnInit {
  activatedComponent: ActivatedComponent;

  constructor() {
    
  }

  ngOnInit(): void {
    
  }

  onRouterOutletActivate( event: any ): void {
    this.activatedComponent = event.__proto__.constructor.name
  }
}
