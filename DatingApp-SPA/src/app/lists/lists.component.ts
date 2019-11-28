import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit, OnDestroy {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  destroySubscription$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });
    this.likesParam = 'Likers';
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam).pipe(
        takeUntil(this.destroySubscription$)
      ).subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

}
