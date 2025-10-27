import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { Toast } from '../models/toast.model';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Toast Messages', () => {
    it('should emit success message', (done) => {
      const testMessage = 'Success message';
      
      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe(testMessage);
        expect(toasts[0].type).toBe('success');
        done();
      });

      service.showSuccess(testMessage);
    });

    it('should emit error message', (done) => {
      const testMessage = 'Error message';
      
      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe(testMessage);
        expect(toasts[0].type).toBe('error');
        done();
      });

      service.showError(testMessage);
    });

    it('should remove toast after delay', (done) => {
      jasmine.clock().install();
      
      service.showSuccess('Test');
      
      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(0);
        jasmine.clock().uninstall();
        done();
      });

      jasmine.clock().tick(3100); // Default delay is 3000ms
    });

    it('should handle multiple toasts', (done) => {
      service.showSuccess('Success 1');
      service.showError('Error 1');
      service.showSuccess('Success 2');

      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(3);
        expect(toasts[0].message).toBe('Success 1');
        expect(toasts[1].message).toBe('Error 1');
        expect(toasts[2].message).toBe('Success 2');
        done();
      });
    });

    it('should remove specific toast', (done) => {
      service.showSuccess('Toast 1');
      service.showSuccess('Toast 2');

      service.toasts$.subscribe(toasts => {
        const initialLength = toasts.length;
        const toastToRemove = toasts[0];
        
        service.remove(toastToRemove);
        
        expect(toasts.length).toBe(initialLength - 1);
        expect(toasts.find(t => t === toastToRemove)).toBeUndefined();
        done();
      });
    });
  });
});