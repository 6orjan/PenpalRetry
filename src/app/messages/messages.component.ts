import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { User, Message } from '../user.model';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [UserService],
})
export class MessagesComponent implements OnInit {
  user: User | null = null;
  receivedMessages: Message[] = [];
  newMessage: string = '';
  recipientUsername: string = '';
  messageError: string = '';
  sendMessageError: string = '';
  loading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userId = Number(sessionStorage.getItem('userId'));
    if (userId) {
      this.loading = true;
      this.userService.getUserById(userId).pipe(
        tap(user => {
          this.user = user;
          this.loadReceivedMessages(userId);
        }),
        catchError(error => {
          console.error('Error fetching user:', error);
          this.messageError = 'Error loading user data';
          return of(null);
        }),
        finalize(() => this.loading = false)
      ).subscribe();
    }
  }

  loadReceivedMessages(userId: number) {
    this.loading = true;
    this.messageError = '';
    
    this.userService.getUserById(userId).pipe(
      tap(user => {
        if (user && user.messageReceived) {
          this.receivedMessages = user.messageReceived.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        } else {
          this.messageError = 'No messages found';
        }
      }),
      catchError(error => {
        console.error('Error loading messages:', error);
        this.messageError = 'Error loading messages';
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }

  sendMessage() {
    if (!this.user) {
      this.sendMessageError = 'You must be logged in to send messages';
      return;
    }

    if (!this.recipientUsername || !this.newMessage) {
      this.sendMessageError = 'Recipient and message content are required';
      return;
    }

    this.loading = true;
    this.sendMessageError = '';

    this.userService.getUsers().pipe(
      tap(users => {
        const recipientUser = users.find(u => u.username === this.recipientUsername);
        if (!recipientUser) {
          throw new Error('Recipient not found');
        }

        const message: Message = {
          from: this.user!.username,
          to: recipientUser.username,
          content: this.newMessage,
          timestamp: new Date().toISOString()
        };

        // Update recipient's messageReceived array
        if (!recipientUser.messageReceived) {
          recipientUser.messageReceived = [];
        }
        recipientUser.messageReceived.push(message);

        // Update sender's messageSent array
        if (!this.user!.messageSent) {
          this.user!.messageSent = [];
        }
        this.user!.messageSent.push(message);

        // Update both users in the database
        return Promise.all([
          this.userService.updateUser(recipientUser.id, recipientUser).toPromise(),
          this.userService.updateUser(this.user!.id, this.user!).toPromise()
        ]);
      }),
      catchError(error => {
        console.error('Error sending message:', error);
        this.sendMessageError = error.message || 'Error sending message';
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
        if (!this.sendMessageError) {
          this.newMessage = '';
          this.recipientUsername = '';
          // Reload messages to show the new message
          this.loadReceivedMessages(this.user!.id);
        }
      })
    ).subscribe();
  }
}