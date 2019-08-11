import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesListComponent } from './messages-list/messages-list.component';
import {MessageNewComponent} from './message-new/message-new.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesListComponent
  },
  {
    path: 'new',
    component: MessageNewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
