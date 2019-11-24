import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  signForm: FormGroup;
  destroySubscription$: Subject<boolean> = new Subject();
  photoUrl: string;
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) { }
  ngOnInit() {
    this.initializeForm();
    this.authService.currentPhotoUrl$.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }
  initializeForm() {
    this.signForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }
  onSubmit() {
    this.authService
      .login(this.signForm.value)
      .pipe(
        takeUntil(this.destroySubscription$)
      )
      .subscribe(
        v => this.alertify.success('Login successfully'),
        e => this.alertify.error(e),
        () => this.router.navigate(['/members']));
  }
  loggenIn() {
    return this.authService.loggedIn();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }
}
