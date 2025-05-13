import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { IUser } from '../../shared/interfaces/iuser';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase!: SupabaseClient;
  private readonly ID = inject( PLATFORM_ID) ;
  constructor() { 
    if(isPlatformBrowser(this.ID)){
    this.supabase = createClient(environment.supabaseUrl , environment.supabaseKey);

    }
  }

  async insertUser(userData:IUser){
    const{data, error} = await this.supabase
    .from('Users')
    .insert(userData);

    if (error) {
      throw error;
    }
    return data;

  }

   selectUser(userData:IUser):Observable<IUser | null>{
    return from (
      this.supabase
      .from("Users")
      .select("*")
      .eq("email", userData.email)
      .eq("password", userData.password)
      .maybeSingle()
    ) .pipe (
      map((response)=>{
        if(response.error){
          console.error('Error fetching user:', response.error.message);
          return null;
        }
        return response.data as IUser | null ;
      }),
      catchError((error) => {
        console.error('Error fetching user:', error.message);
        return of(null);
      })
    )

  }


  uploadAvatarDB(file:File, filePath:string):Observable<any>{
    const upload$ = from(this.supabase.storage
                          .from('avatars')
                          .upload(filePath, file, {
                            cacheControl:'3600', // tells the browser how long (in seconds) it can cache the file
                            upsert:true //if a file with the same name already exists at that location, it replaces it
                          })
    );

    return upload$;

  }
}
