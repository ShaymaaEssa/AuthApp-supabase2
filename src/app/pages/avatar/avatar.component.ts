import { Component, inject } from '@angular/core';
import { privateDecrypt } from 'crypto';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  private readonly supabaseService = inject(SupabaseService);


  uploadAvatar(event:any){ 
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.error('No file selected.');
      return;
    }

    const file = input.files[0];

    const user = localStorage.getItem('userToken-AuthApp')
    if(user != null){
      const userId = JSON.parse( user).id;
      const filePath = `${userId}/${file.name}`;
      console.log(`filepath:${filePath}`)
      this.supabaseService.uploadAvatarDB(file, filePath);
      // this.supabaseService.uploadAvatarDB(file, filePath).subscribe({
      //   next:(response)=>{
      //     console.log('Upload successful:', response);
      //   }, 
      //   error:(error)=>{
      //     console.error('Upload failed:', error.message);
      //   }
      // })
    }

  }

}
