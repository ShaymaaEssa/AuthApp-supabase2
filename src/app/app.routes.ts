import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { pages } from './core/environment/pages';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { loggeduserGuard } from './core/guards/logged/loggeduser.guard';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo:  'home', pathMatch: 'full' },

    {path:'', component:AuthLayoutComponent, canActivate:[loggeduserGuard],
        children:[
                {path:pages.Login, component:LoginComponent, title:'login'},
                {path:pages.Register, component:RegisterComponent, title:'register'}
        ]
     },

     {path:'', component:BlankLayoutComponent, canActivate:[authGuard], 
        children:[
        {path:pages.Home, component:NavbarComponent, title:'Home'}
        ]
     }

    
];
