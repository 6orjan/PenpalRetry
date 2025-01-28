import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, HttpClientModule, FormsModule], // Include HttpClientModule and FormsModule
  providers: [UserService], 
  
})
export class ProfileComponent implements OnInit {
  user!: User;
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    const userId = Number(sessionStorage.getItem('userId'));
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
      });
    }
  }

  login() {
    this.userService.getUsers().subscribe(users => {
      const user = users.find(u => u.username === this.username && u.password === this.password);
      if (user) {
        sessionStorage.setItem('userId', user.id.toString());
        this.user = user;
        this.loginError = '';
      } else {
        this.loginError = 'Invalid username or password';
      }
    });
  }

  logoff() {
    sessionStorage.removeItem('userId');
    this.user = null!;
    this.username = '';
    this.password = '';
  }
}
