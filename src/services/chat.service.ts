import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, from, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RagService } from './rag.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private genAI!: GoogleGenerativeAI;
  private model: any;
  private chatHistory: { role: 'user' | 'assistant', content: string }[] = [];
  private dataContext: any = null;
  
  private readonly systemPrompt = `You are an AI assistant specialized in analyzing student data and providing insights.

IMPORTANT: You have direct access to actual student data in the context provided below. Always base your responses on this specific data.

When analyzing the data, you should:
1. Use actual numbers and scores from the provided student data
2. Make specific references to student names and their performance
3. Compare scores across subjects when relevant
4. Identify patterns in the data provided
5. Provide concrete, data-backed recommendations

The student data includes:
- Name, Class, and Section
- Individual subject scores (Math, Science, English)
- Total scores and overall grades

Always refer to specific data points in your responses to show that you're using the actual information provided.`;

  constructor(
    private http: HttpClient,
    private ragService: RagService
  ) {
    if (!environment.geminiApiKey) {
      console.error('Gemini API key is not configured');
      return;
    }
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.initializeChat();
    this.loadDataContext();
  }

  private initializeChat() {
    this.chatHistory = [{
      role: 'assistant',
      content: this.systemPrompt
    }];
  }

  private async loadDataContext() {
    try {
      this.dataContext = await this.http.get('assets/data.json').toPromise();
      // Initialize the RAG service with the loaded data
      await this.ragService.initializeVectorStore(this.dataContext);
      console.log('Data context and vector store initialized successfully');
    } catch (error) {
      console.error('Error loading data context:', error);
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Retrieve relevant context using RAG
      const relevantContext = await this.ragService.retrieveRelevantContext(message);
      
      const enhancedMessage = `
STUDENT DATA FOR ANALYSIS:
------------------------
${relevantContext}

YOUR TASK:
------------------------
Question: ${message}

INSTRUCTIONS:
1. Use ONLY the student data provided above
2. Include specific numbers and scores in your analysis
3. Reference student names when discussing their performance
4. Make clear comparisons between students or subjects where relevant
5. Base all insights and recommendations on the actual data shown

Please provide a detailed analysis based on this specific student data.`;

      this.chatHistory.push({ role: 'user', content: enhancedMessage });
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: this.formatChatHistory() }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });

      const response = result.response?.text();
      
      if (!response) throw new Error('Empty response from API');

      this.chatHistory.push({ role: 'assistant', content: response });
      return response;

    } catch (error: any) {
      const errorMessage = this.handleError(error);
      return Promise.reject(errorMessage);
    }
  }

  private formatChatHistory(): string {
    // Only include the last few messages to keep context focused
    const relevantHistory = this.chatHistory.slice(-4);
    return relevantHistory
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n---\n\n');
  }

  private handleError(error: any): string {
    console.error('Chat service error:', error);
    
    if (error.message?.includes('API key')) {
      return 'API key configuration error. Please check your settings.';
    }
    if (error.message?.includes('quota')) {
      return 'API quota exceeded. Please try again later.';
    }
    return 'An error occurred while processing your request.';
  }

  getChatHistory(): Observable<Array<{ role: 'user' | 'assistant', content: string }>> {
    return from([this.chatHistory]);
  }

  clearChat(): void {
    this.initializeChat();
  }

  analyzeData(specificQuery: string): Observable<string> {
    const analyticsPrompt = `Based on the provided data, please analyze: ${specificQuery}
Focus on:
- Relevant statistical patterns
- Key performance indicators
- Actionable recommendations
- Supporting data points`;
    
    return from(this.sendMessage(analyticsPrompt));
  }
}
