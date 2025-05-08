import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { pages } from './core/environment/pages';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {path: '', redirectTo:  '/login', pathMatch: 'full' },
    {path:pages.Login, component:LoginComponent, title:'login'},
    {path:pages.Register, component:RegisterComponent, title:'register'},
    {path:pages.Home, component:HomeComponent, title:'Home'}
];
