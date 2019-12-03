import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  destroySubscription$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userSerivice: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
    });
  }

  loadMessages() {
    this.userSerivice.getMessages(this.authService.decodedToken.nameid,
      this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
      .pipe(takeUntil(this.destroySubscription$))
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => this.alertify.error(error));
  }

  deleteMessage(id: number, event: any) {
    event.stopPropagation();
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.userSerivice.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        const removeIndex = this.messages.findIndex(m => m.id === id);
        this.messages = this.messages.filter((value, index) => index !== removeIndex);
        this.alertify.success('Message has been deleted');
      }, error => this.alertify.error('Failed to delete the message'));
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
