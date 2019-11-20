import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  signForm: FormGroup;
  destroySubscription$: Subject<boolean> = new Subject();
  @Output() cancelRegister = new EventEmitter();

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.signForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ])
    });
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  register() {
    this.authService
      .register(this.signForm.value)
      .pipe(
        takeUntil(this.destroySubscription$)
      )
      .subscribe(
        v => this.alertify.success('Resgister successfully'),
        e => this.alertify.error(e)
      );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
