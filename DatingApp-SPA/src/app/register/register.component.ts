import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  signForm: FormGroup;
  destroySubscription$: Subject<boolean> = new Subject();
  @Output() cancelRegister = new EventEmitter();
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.configDatepicker();
    this.initForm();
  }

  configDatepicker(): void {
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD-MM-YYYY'
    };
  }

  initForm(): void {
    this.signForm = this.fb.group({
      gender: ['male'],
      username: [null, [Validators.required]],
      knownAs: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      city: [null, [Validators.required]],
      country: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: [null, [Validators.required]]
    }, { validators: [this.passwordMatchValidator] });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };
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
