import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit, OnDestroy {
  @Input() user: User;
  destroySubscription$: Subject<boolean> = new Subject();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).pipe(
      takeUntil(this.destroySubscription$)
    ).subscribe(data => {
      this.alertify.success('You have liked: ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }

}
