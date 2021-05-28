import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'

import { ActivityHistoryComponent } from './activity-history.component'

describe( 'ActivityHistoryComponent', () => {
  let component: ActivityHistoryComponent
  let fixture: ComponentFixture<ActivityHistoryComponent>

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
      declarations: [ ActivityHistoryComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    } ).compileComponents()
  } ) )

  beforeEach( () => {
    fixture = TestBed.createComponent( ActivityHistoryComponent )
    component = fixture.componentInstance
    fixture.detectChanges()
  } )

  it( 'should compile', () => {
    expect( component ).toBeTruthy()
  } )
} )
