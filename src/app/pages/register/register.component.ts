import { Component, inject } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly supabaseService = inject(SupabaseService);

  registerForm : FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]), 
    email:new FormControl(null, [Validators.required, Validators.email]),
    password:new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][\w@]{7,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  }, this.confirmPassword) 

  confirmPassword(group: AbstractControl){
    const password =  group.get('password')?.value;
    const rePassword =  group.get('rePassword')?.value;
    return password === rePassword ? null : {mismatch:true};
  
  }

  submitForm(){
    this.supabaseService.updateProfile(this.registerForm.value).subscribe({
      
    })
  }

}
