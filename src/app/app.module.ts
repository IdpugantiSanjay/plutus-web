import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { SideNavComponent } from './side-nav/side-nav.component'
import { GroupsComponent } from './groups/groups.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'

import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule } from '@angular/material/tooltip'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { LayoutModule } from '@angular/cdk/layout'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { ActivityComponent } from './activity/activity.component'
import { ActivityHistoryComponent } from 'src/app/pages/activity-page/activity-history/activity-history.component'
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthenticationModule } from './modules/authentication/authentication.module'
import { LOGIN_URL, REGISTRATION_URL } from './di-tokens/auth-url-tokens'
import { Api } from './ApiRoutes'

import { CategoriesComponent } from './categories/categories.component'

import { ActivityFormComponent } from 'src/app/pages/activity-page/activity-form/activity-form.component'
import { NewActivityComponent } from 'src/app/pages/activity-page/new-activity/new-activity.component'
import { EditActivityComponent } from 'src/app/pages/activity-page/edit-activity/edit-activity.component'

import { MatRippleModule } from '@angular/material/core'
import { MatChipsModule } from '@angular/material/chips'

import { AuthHttpService } from './interceptors/auth-http.service'
import { BusyHttpInterceptor } from './interceptors/busy-http-interceptor.service'
import { ActivityPageComponent } from './pages/activity-page/activity-page.component'
import { SuccessMessageComponent } from './success-message/success-message.component'
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component'
import { ScrollingModule } from '@angular/cdk/scrolling'

@NgModule( {
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SideNavComponent,
    GroupsComponent,
    ActivityComponent,
    ActivityHistoryComponent,
    ActivityFormComponent,
    EditActivityComponent,
    NewActivityComponent,
    CategoriesComponent,
    ActivityPageComponent,
    SuccessMessageComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatMenuModule,
    AuthenticationModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatChipsModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: LOGIN_URL,
      useValue: Api.users.login,
    },
    {
      provide: REGISTRATION_URL,
      useValue: Api.users.register,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpService,
      multi: true 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BusyHttpInterceptor,
      multi: true 
    }
  ],
  bootstrap: [AppComponent],
} )
export class AppModule {}

// Components -> Angular 1.2 directives, Directives

// NgModules -> Componenets
