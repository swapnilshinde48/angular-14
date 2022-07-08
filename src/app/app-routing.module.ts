import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {
  routes: Routes = [
    { path: '/', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashbordComponent },
  ];
}
