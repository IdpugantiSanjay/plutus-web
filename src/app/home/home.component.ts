import { Component } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable, Subject } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { Router } from '@angular/router'
import { AuthenticationService } from '../modules/authentication/services/authentication.service'

import { LeftNavItem } from '../types/left-nav-item'
import { AbstractAuthenticationStore } from '../modules/authentication/services/abstract-authentication-store'
import { AuthenticationInfo } from '../types/authentication-info'

@Component( {
  selector: 'plutus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
} )
export class HomeComponent {
  username: string

  isHandset$: Observable<boolean> = this.breakpointObserver.observe( Breakpoints.Handset ).pipe(
    map( ( result ) => result.matches ),
    shareReplay()
  )

  public leftNavItems: LeftNavItem[] = [
    { name: 'Dashboard', routerLink: '/home/dashboard', iconClass: 'icon-home' },
    { name: 'Activity', routerLink: '/home/activity', iconClass: 'icon-activity' },
    { name: 'Goals', routerLink: '/home/goals', iconClass: 'icon-goal' },
    { name: 'Groups', routerLink: '/home/groups', iconClass: 'icon-users' },
  ]

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authStore: AbstractAuthenticationStore
  ) {
    const authenticationInfo = this.authStore.getAuthenticationInfo() as AuthenticationInfo
    this.username = authenticationInfo.username
  }

  logout(): void {
    this.authenticationService.clearCachedAuthenticationResponse()
    this.router.navigateByUrl( '/login' )
  }
}
