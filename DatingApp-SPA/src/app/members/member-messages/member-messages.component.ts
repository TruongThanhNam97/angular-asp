import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  destroySubscription$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userServicce: UserService,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.userServicce.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(takeUntil(this.destroySubscription$))
      .subscribe(messages => { this.messages = messages; }, error => this.alertify.error(error));
  }

}
