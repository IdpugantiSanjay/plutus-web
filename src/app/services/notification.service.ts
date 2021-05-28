import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { SuccessMessageComponent } from '../success-message/success-message.component'

@Injectable( {
  providedIn: 'root',
} )
export class NotificationService {
  constructor( private snackbar: MatSnackBar ) {}

  public showErrorMessage( errorMessage: string ): void {
    this.snackbar.open( errorMessage, '', { duration: 2_000, horizontalPosition: 'center', verticalPosition: 'top' } )
  }

  public showSuccessMessage<T>( { message, data, action }: { message: string; data?: T; action?: string } ): Observable<T | undefined> {
    const ref = this.snackbar.openFromComponent( SuccessMessageComponent, {
      data: { message, action },
      duration: 3_000,
      verticalPosition: 'bottom', 
      horizontalPosition: 'center',
    } )
    return ref.onAction().pipe( map( () => data ? data : undefined ) )
  }
}
