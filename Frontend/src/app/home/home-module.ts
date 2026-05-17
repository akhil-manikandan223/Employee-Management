import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: '', component: Dashboard },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
