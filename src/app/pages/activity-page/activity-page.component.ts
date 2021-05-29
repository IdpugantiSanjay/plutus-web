import { Component, OnInit } from '@angular/core'
import { ActivityHistoryComponent } from './activity-history/activity-history.component'
import { NewActivityComponent } from './new-activity/new-activity.component'

type ActivatedComponent = 'ActivityHistoryComponent' | 'NewActivityComponent'

@Component( {
  selector: 'plutus-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.css'],
} )
export class ActivityPageComponent implements OnInit {
  #activatedComponent: ActivatedComponent;

  get activatedComponent(): ActivatedComponent {
    return this.#activatedComponent
  }

  constructor() {
    
  }

  ngOnInit(): void {
    
  }


  onRouterOutletActivate( event: any ): void {
    if ( event instanceof ActivityHistoryComponent ) {
      this.#activatedComponent = 'ActivityHistoryComponent'
    } else if ( event instanceof NewActivityComponent ) {
      this.#activatedComponent = 'NewActivityComponent'
    }
  }
}
