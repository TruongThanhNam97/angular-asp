import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  signForm: FormGroup;
  constructor(private authService : AuthService) {}
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
    this.authService.login(this.signForm.value).subscribe(
      v => console.log('Login successfully'),
      e => console.log('something went wrong')
    ); 
  }
  loggenIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }
  logout() {
    localStorage.removeItem('token');
    console.log('logged out');
  }
}
