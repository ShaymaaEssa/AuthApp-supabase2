import { IUser } from './../../shared/interfaces/iuser';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterLink,Router } from '@angular/router';
import { environment, userToken } from '../../core/environment/environment';
import { take } from 'rxjs';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  loginForm : FormGroup = new FormGroup({
    email:new FormControl(null, [Validators.required, Validators.email]),
    password:new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][\w@]{7,}$/)])
  })

  submitForm(){
    if(this.loginForm.invalid) {
      alert("Fix Form Error!");
      return;
    }

    this.supabaseService.loginUser(this.loginForm.value)
    .pipe(take(1))
    .subscribe({
      next:(res)=>{
        localStorage.setItem(userToken.token, res.profile.name)
        this.router.navigate(['/home']);
      }, 
      error:(err)=>{
        alert(`Error: ${err.message}`);
      }
    })
  }
}
