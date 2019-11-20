import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, OnDestroy {
  users: User[];
  destroySubscription$: Subject<boolean> = new Subject();

  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  loadUsers() {
    this.userService.getUsers().pipe(
      takeUntil(this.destroySubscription$),
    ).subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      this.alertify.error(error);
    });
  }

}
