import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { GroupsComponent } from './groups/groups.component'

import { AuthGuard } from '../app/guards/auth.guard'
import { ActivityFormComponent } from 'src/app/pages/activity-page/activity-form/activity-form.component'

import { EditActivityComponent } from 'src/app/pages/activity-page/edit-activity/edit-activity.component'

import { NewActivityComponent } from 'src/app/pages/activity-page/new-activity/new-activity.component'

import { ActivityPageComponent } from 'src/app/pages/activity-page/activity-page.component'
import { ActivityHistoryComponent } from 'src/app/pages/activity-page/activity-history/activity-history.component'
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'groups', component: GroupsComponent },
      {
        path: 'activity',
        component: ActivityPageComponent,
        children: [
          {
            path: 'history',
            component: ActivityHistoryComponent,
          },
          {
            path: 'form',
            component: ActivityFormComponent,
          },
          {
            path: 'edit/:transactionId',
            component: EditActivityComponent,
          },
          {
            path: 'add',
            component: NewActivityComponent,
          },
          {
            path: '',
            redirectTo: '/home/activity/history',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'dashboard', component: DashboardPageComponent
      }
    ],
  },
]

@NgModule( {
  imports: [RouterModule.forRoot( routes )],
  exports: [RouterModule],
} )
export class AppRoutingModule {}
