// src/app/components/ai-assistant/ai-assistant.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat'

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="messages">
        <div *ngFor="let msg of messages()"
             [class]="'message ' + msg.role">
          <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}:</strong>
          {{ msg.text }}
        </div>
        <div *ngIf="isLoading()" class="loading">AI is typing...</div>
      </div>

      <div class="input-area">
        <input [(ngModel)]="userInput"
               (keyup.enter)="sendMessage()"
               placeholder="Ask me anything..."
               [disabled]="isLoading()">
        <button (click)="sendMessage()" [disabled]="isLoading() || !userInput">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container { 
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    width: 350px;
    z-index: 9999;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 12px;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .messages { 
    height: 300px; 
    overflow-y: auto; 
    padding: 1rem; 
    background: #f9f9f9; 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
  }
  
  .message { padding: 8px 12px; border-radius: 8px; max-width: 80%; font-size: 0.9rem; }
  .message.user { align-self: flex-end; background: #007bff; color: white; }
  .message.bot { align-self: flex-start; background: #e9ecef; color: black; }
  
  .input-area { display: flex; border-top: 1px solid #eee; }
  input { flex: 1; padding: 12px; border: none; outline: none; }
  button { padding: 0 16px; border: none; background: #007bff; color: white; cursor: pointer; font-weight: bold; }
  button:disabled { background: #ccc; }
  `]
})
export class AiAssistantComponent {
  userInput = '';
  isLoading = signal(false);
  messages = signal<ChatMessage[]>([]);

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    // 1. Add user message immediately
    const userMsg = this.userInput;
    this.messages.update(msgs => [...msgs, { role: 'user', text: userMsg }]);
    this.userInput = '';
    this.isLoading.set(true);

    // 2. Call the server
    this.chatService.sendMessage(userMsg).subscribe({
      next: (response) => {
        // OpenAI structure: response.choices[0].message.content
        const botText = response.choices[0].message.content;
        this.messages.update(msgs => [...msgs, { role: 'bot', text: botText }]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.messages.update(msgs => [...msgs, { role: 'bot', text: 'Error connecting to AI.' }]);
        this.isLoading.set(false);
      }
    });
  }
}