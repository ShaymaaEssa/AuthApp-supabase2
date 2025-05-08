import { IUser } from './../../shared/interfaces/iuser';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterLink,Router } from '@angular/router';


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
    try{
      console.log("hello from login submit form!");
      const result =  this.supabaseService.selectUser(this.loginForm.value).subscribe(
        {
          next:(user)=>{
            if(user){
              alert(`Successful login!`);
              localStorage.setItem("userToke", JSON.stringify( user));
              setTimeout(()=>{
                //navigate login path
              this.router.navigate(['/home']);
              }, 1000)
            }else{
              alert('Invalid email or password!')
            }
          },
          error: (err) => {
            console.error('Login error:', err);
            alert( 'Login failed. Please try again.');
          }
        }
      );
      

    } catch(error){
      if(error instanceof Error){
        alert(error.message);
        console.log('Error inserting user:', error);
      } else{
        alert('An unexpected error occurred');
        console.log('Unknown error:', error);
      }
    }
  }
}
