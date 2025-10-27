import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Chat Icon -->
    <div class="chat-icon" (click)="toggleChat()" [class.open]="isChatOpen">
      <span class="material-icons-round">{{ isChatOpen ? 'close' : 'chat' }}</span>
    </div>

    <!-- Chat Modal -->
    <div class="chat-modal" [class.open]="isChatOpen">
      <div class="chat-header">
        <h3>Chat Assistant</h3>
        <button class="close-btn" (click)="toggleChat()">
          <span class="material-icons-round">close</span>
        </button>
      </div>
      
      <div class="chat-messages" #messageContainer>
        <div *ngFor="let message of chatMessages" 
             [ngClass]="{'user-message': message.isUser, 'bot-message': !message.isUser}"
             class="message">
          <div class="message-content">
            <span class="message-text">{{ message.text }}</span>
          </div>
        </div>
        <div *ngIf="isLoading" class="loading-message">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input type="text" 
               [(ngModel)]="userMessage" 
               (keyup.enter)="sendMessage()"
               placeholder="Type your message..."
               [disabled]="isLoading">
        <button (click)="sendMessage()" 
                [disabled]="!userMessage.trim() || isLoading">
          <span class="material-icons-round">send</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
      z-index: 1000;
    }

    .chat-icon {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #2196f3;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    }

    .chat-icon:hover {
      transform: scale(1.1);
    }

    .chat-icon.open {
      background-color: #f44336;
    }

    .chat-modal {
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 350px;
      height: 500px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      visibility: hidden;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

    .chat-modal.open {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    .chat-header {
      padding: 15px;
      background-color: #2196f3;
      color: white;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 15px;
      margin: 2px 0;
    }

    .user-message {
      align-self: flex-end;
      background-color: #2196f3;
      color: white;
    }

    .bot-message {
      align-self: flex-start;
      background-color: #f5f5f5;
      color: #333;
    }

    .chat-input {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }

    .chat-input input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
    }

    .chat-input button {
      background-color: #2196f3;
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .chat-input button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .loading-message {
      align-self: flex-start;
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 15px;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #888;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `]
})
export class ChatComponent {
  isChatOpen = false;
  userMessage = '';
  isLoading = false;
  chatMessages: Array<{text: string, isUser: boolean}> = [];

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  async sendMessage() {
    if (!this.userMessage.trim() || this.isLoading) return;

    const message = this.userMessage;
    this.chatMessages.push({
      text: message,
      isUser: true
    });
    this.userMessage = '';
    this.isLoading = true;

    try {
      const response = await this.chatService.sendMessage(message);
      this.chatMessages.push({
        text: response,
        isUser: false
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.chatMessages.push({
        text: 'Sorry, there was an error processing your message.',
        isUser: false
      });
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messageContainer = document.querySelector('.chat-messages');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    });
  }
}