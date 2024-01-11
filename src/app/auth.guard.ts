// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    const token = localStorage.getItem('token');
    const routePath = route.routeConfig ? route.routeConfig.path : '';
    if (token) {
      if(routePath == "login"){
        return this.router.parseUrl('/home');
      }
      return true;
    } else {
      // Redirect to the login page or any other page as needed
      if(routePath != "login"){
        return this.router.parseUrl('/login');
      }
      else{
        return true;
      }
      
    }
  }
}
