import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  signForm: FormGroup;
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService
  ) {}
  ngOnInit() {
    this.initializeForm();
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
      .subscribe(v => this.alertify.success('Login successfully'), e => this.alertify.error(e));
  }
  loggenIn() {
    return this.authService.loggedIn();
  }
  logout() {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }
}
