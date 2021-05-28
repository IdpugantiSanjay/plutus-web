import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {AuthenticationService} from '../modules/authentication/services/authentication.service'
import {NotificationService} from '../services/notification.service'
import { LoginInfo } from '../types/LoginInfo'

@Component( {
  selector: 'plutus-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
} )
export class LoginComponent implements OnInit {

  authenticationInfo: LoginInfo = {
    username: '',
    password: ''
  }


  constructor( private router: Router, private authenticationService: AuthenticationService, private notifications: NotificationService ) {
  }

  ngOnInit(): void {
  }

  onLoginClick(): void {
    this.authenticationService
      .authenticate( this.authenticationInfo )
      .subscribe( () => this.router.navigateByUrl( '/home' ) )
  }
}
