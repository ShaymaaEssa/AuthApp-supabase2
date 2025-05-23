import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthError, createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { IUser } from '../../shared/interfaces/iuser';
import { BehaviorSubject, catchError, from, map, Observable, of, retry, switchMap, tap } from 'rxjs';
import { response } from 'express';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase!: SupabaseClient;
  private readonly ID = inject(PLATFORM_ID);
  private currentUser = new BehaviorSubject<User | null>(null);
  constructor() {
    if (isPlatformBrowser(this.ID)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    // Check for existing session on service initialization
    this.checkCurrentSession();
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.currentUser.next(session.user);
      } else {
        this.currentUser.next(null);
      }
    });

  }

  private getClient(){
    return this.supabase;
  }

  registerUser(userData:IUser):Observable<any>{
    return from (this.supabase.auth.signUp({
      email: userData.email, 
      password: userData.password
    }).then(async (authResponse)=>{
      if(authResponse.error) throw authResponse.error;

      // Add debug logs
        console.log('Auth user ID:', authResponse.data.user?.id);
        console.log('Profile data:', {
          id: authResponse.data.user?.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });


      //insert into profiles table
      const{data, error}= await this.supabase
                                .from ('profiles')
                                .insert([{
                                  id: authResponse.data.user?.id,
                                  name: userData.name,
                                  email: userData.email,
                                  phone: userData.phone,
                                }]);

      if(error) {
         console.error('Database error details:', error);
         throw error;
      }
      return data;
    }))
  }

  loginUser(userData:IUser):Observable<any>{
    return from (this.supabase.auth.signInWithPassword({
      email:userData.email,
      password:userData.password
    }).then(async (authResponse)=>{
      if(authResponse.error) throw authResponse.error;

      const {data:profileData, error:profileError} = await this.supabase
                                                            .from('profiles')
                                                            .select('name')
                                                            .eq('id',authResponse.data.user?.id)
                                                            .single();

      if (profileError) throw profileError;
      console.log({ auth: authResponse.data, profile: profileData });
      return { auth: authResponse.data, profile: profileData };
    }))
  }
  
  
  
  private checkCurrentSession():void{
    from( this.supabase.auth.getSession()).pipe(
      map(response => response.data.session?.user || null),
      catchError(error => {
        console.error('Session check failed', error);
        return of(null); // Fallback to "not logged in" state
      })
    ).subscribe(user => {
      this.currentUser.next(user);
    })
  }

  // signup(userProfile:IUser): Observable<void> {
  //   return from(
  //     this.supabase.auth.signUp({email: userProfile.email,
  //     password: userProfile.password,
  //     options: {
  //       data: {
  //         name: userProfile.name,
  //         phone: userProfile.phone
  //       }}
  //     )
  //   ).pipe(
  //     switchMap((response) => {
  //       if (response.error) {
  //         throw response.error;
  //       }
  //       const user = response.data.user;
  //       if (!user) {
  //         throw new Error('User signup failed');
  //       }
  //       return from(
  //         this.supabase.from('profiles').update({ userProfile.name, userProfile.phone }).eq('id', user.id)
  //       );
  //     }),
  //     tap((result) => {
  //       if (result.error) {
  //         throw result.error;
  //       }
  //     }),
  //     map(() => {})
  //   );
  // }

  updateProfile(profile: any): Observable<void> {
    return from(this.supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return;
      })
    );
  }

  async insertUser(userData: IUser) {
    const { data, error } = await this.supabase
      .from('Users')
      .insert(userData);

    if (error) {
      throw error;
    }
    return data;

  }

  selectUser(userData: IUser): Observable<IUser | null> {
    return from(
      this.supabase
        .from("Users")
        .select("*")
        .eq("email", userData.email)
        .eq("password", userData.password)
        .maybeSingle()
    ).pipe(
      map((response) => {
        if (response.error) {
          console.error('Error fetching user:', response.error.message);
          return null;
        }
        return response.data as IUser | null;
      }),
      catchError((error) => {
        console.error('Error fetching user:', error.message);
        return of(null);
      })
    )

  }


 async uploadAvatarDB(file: File, filePath: string) {
    const upload$ = from(this.supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600', // tells the browser how long (in seconds) it can cache the file
        upsert: true //if a file with the same name already exists at that location, it replaces it
      })
    );

    const { data, error } = await this.supabase.storage
      .from('avatars')
      .upload('test-folder/test.jpg', file, {
        upsert: true
      });

    if (error) {
      console.error("Upload failed:", error.message);
    } else {
      console.log("Upload success:", data);
    }

    return upload$;

  }
}
