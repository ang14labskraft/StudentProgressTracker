import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';
import { RagService } from './rag.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let ragService: jasmine.SpyObj<RagService>;

  const mockContext = 'Test context';

  beforeEach(() => {
    const ragServiceSpy = jasmine.createSpyObj('RagService', ['retrieveRelevantContext']);
    ragServiceSpy.retrieveRelevantContext.and.returnValue(Promise.resolve(mockContext));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: RagService, useValue: ragServiceSpy }
      ]
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
    ragService = TestBed.inject(RagService) as jasmine.SpyObj<RagService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendMessage', () => {
    it('should send message and get response', async () => {
      const testMessage = 'Test message';
      const mockResponse = { text: () => 'AI response' };

      // Mock the Gemini API response
      spyOn(service['model'], 'generateContent').and.returnValue(Promise.resolve({
        response: mockResponse
      }));

      const response = await service.sendMessage(testMessage);

      expect(ragService.retrieveRelevantContext).toHaveBeenCalledWith(testMessage);
      expect(service['model'].generateContent).toHaveBeenCalled();
      expect(response).toBe('AI response');
    });

    it('should handle empty API response', async () => {
      const testMessage = 'Test message';

      // Mock the Gemini API response with null
      spyOn(service['model'], 'generateContent').and.returnValue(Promise.resolve({
        response: null
      }));

      try {
        await service.sendMessage(testMessage);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    it('should handle API errors', async () => {
      const testMessage = 'Test message';
      const mockError = new Error('API Error');

      spyOn(service['model'], 'generateContent').and.rejectWith(mockError);

      try {
        await service.sendMessage(testMessage);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('Chat History', () => {
    it('should maintain chat history', async () => {
      const testMessage = 'Test message';
      const mockResponse = { text: () => 'AI response' };

      spyOn(service['model'], 'generateContent').and.returnValue(Promise.resolve({
        response: mockResponse
      }));

      await service.sendMessage(testMessage);

      service.getChatHistory().subscribe(history => {
        expect(history.length).toBeGreaterThan(1); // Including system prompt
        expect(history[history.length - 2].content).toContain(testMessage);
        expect(history[history.length - 1].content).toBe('AI response');
      });
    });

    it('should clear chat history', () => {
      service.clearChat();
      
      service.getChatHistory().subscribe(history => {
        expect(history.length).toBe(1); // Only system prompt
        expect(history[0].role).toBe('assistant');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API key configuration error', () => {
      const error = new Error('API key not configured');
      const errorMessage = service['handleError'](error);
      expect(errorMessage).toContain('API key');
    });

    it('should handle quota exceeded error', () => {
      const error = new Error('quota exceeded');
      const errorMessage = service['handleError'](error);
      expect(errorMessage).toContain('quota');
    });

    it('should handle generic errors', () => {
      const error = new Error('Unknown error');
      const errorMessage = service['handleError'](error);
      expect(errorMessage).toContain('error occurred');
    });
  });
});