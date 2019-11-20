import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  user: User;
  destroySubscription$: Subject<boolean> = new Subject();

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadUser();
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  loadUser() {
    this.userService.getUser(+this.route.snapshot.params.id).pipe(
      takeUntil(this.destroySubscription$)
    ).subscribe((user: User) => {
      this.user = user;
    }, error => this.alertify.error(error));
  }

}
