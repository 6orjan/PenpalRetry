import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [UserService],
})
export class SearchComponent {
  searchQuery: string = '';
  searchType: string = 'name';
  searchResults: User[] = [];
  searchError: string = '';
  searchPerformed: boolean = false;  // Flag to track if search was performed

  constructor(private userService: UserService) {}

  search() {
    this.searchResults = []; // Clear previous search results
    this.searchError = '';   // Clear previous errors
    this.searchPerformed = true; // Set the flag to true when search is performed

    if (!this.searchQuery.trim()) {
      this.searchError = 'Please enter a search query';
      return;
    }

    console.log(`Searching for users by ${this.searchType} with query: ${this.searchQuery}`);

    if (this.searchType === 'name') {
      this.userService.searchUsersByName(this.searchQuery).subscribe(
        (results) => {
          console.log('Search results by name:', results); // Debugging log
          this.searchResults = results;
        },
        (error) => {
          console.error('Error searching for users by name:', error); // Debugging log
          this.searchError = 'Error searching for users by name';
        }
      );
    } else if (this.searchType === 'country') {
      this.userService.searchUsersByCountry(this.searchQuery).subscribe(
        (results) => {
          console.log('Search results by country:', results); // Debugging log
          this.searchResults = results;
        },
        (error) => {
          console.error('Error searching for users by country:', error); // Debugging log
          this.searchError = 'Error searching for users by country';
        }
      );
    }
  }
}
