import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signForm : FormGroup;
  @Output() cancelRegister = new EventEmitter();

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.signForm = new FormGroup({
      username : new FormControl(null,[Validators.required]),
      password : new FormControl(null,[Validators.required,Validators.minLength(4),Validators.maxLength(8)])
    });
  }

  register() {
    this.authService.register(this.signForm.value).subscribe(
      v => console.log('Resgister successfully'),
      e => console.log(e)
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
