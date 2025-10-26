import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="toast-container" [@fadeInOut]>
      <div [class]="'toast toast-' + currentToast.type">
        {{ currentToast.message }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }

    .toast {
      padding: 15px 20px;
      border-radius: 4px;
      margin-bottom: 10px;
      min-width: 200px;
      max-width: 400px;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    }

    .toast-success {
      background-color: #4caf50;
    }

    .toast-error {
      background-color: #f44336;
    }

    .toast-info {
      background-color: #2196f3;
    }

    .toast-warning {
      background-color: #ff9800;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  visible = false;
  currentToast: { message: string; type: string } = { message: '', type: 'info' };
  private subscription?: Subscription;
  private timeout?: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.show(toast);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private show(toast: { message: string; type: string }) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.currentToast = toast;
    this.visible = true;

    this.timeout = setTimeout(() => {
      this.visible = false;
    }, 3000);
  }
}