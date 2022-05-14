import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LicensesComponent } from './components/licenses/licenses.component';
import { LogsComponent } from './components/logs/logs.component';
import { PanelsComponent } from './components/panels/panels.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: "", component: DashboardComponent , canActivate: [LoginGuard]  },
  { path: "licenses", component: LicensesComponent, canActivate: [LoginGuard] },
  { path: "login", component: LoginComponent },
  { path: "panels", component: PanelsComponent, canActivate: [LoginGuard] },
  { path: "logs", component: LogsComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
