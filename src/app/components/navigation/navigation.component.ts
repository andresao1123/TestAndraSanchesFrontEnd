import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent implements OnInit {
  isLoggedIn:boolean = false;

  constructor(private authService: AuthService) {
    // Iterate through all keys in localStorage and remove items with keys related to tokens
   
  }

  ngOnInit(): void {
    // Subscribe to the isUserLoggedIn$ observable
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    }
  }

  getIsLoggedIn(){
    console.log(this.authService.isUserLoggedIn$.getValue())
    return this.authService.isUserLoggedIn$.getValue();
  }
  

  logout() {
    this.authService.logout();
  }
}
