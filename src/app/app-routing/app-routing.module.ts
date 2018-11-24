import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteComponent } from '../infinite/infinite.component';
import { GroupingComponent } from '../grouping/grouping.component';

const routes: Routes = [
  {
    path: '',
    component: GroupingComponent,
  },
  {
    path: 'infinite',
    component: InfiniteComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
