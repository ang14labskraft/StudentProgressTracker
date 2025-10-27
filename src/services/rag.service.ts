import { Injectable } from '@angular/core';
// import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from '@langchain/core/documents';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RagService {
  // private vectorStore: HNSWLib | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: environment.geminiApiKey,
      modelName: "embedding-001"
    });
  }

  async initializeVectorStore(data: any) {
    try {
      const documents = this.prepareDocuments(data);
      // this.vectorStore = await HNSWLib.fromDocuments(
      //   documents,
      //   this.embeddings
      // );
      console.log('Vector store initialized successfully');
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw error;
    }
  }

  private prepareDocuments(data: any): Document[] {
    const documents: Document[] = [];
    
    // Convert student data into documents
    if (data.students) {
      data.students.forEach((student: any) => {
        // Create a document for each student
        const content = `
          Student ID: ${student.id}
          Name: ${student.name}
          Class: ${student.class}
          Section: ${student.section}
          Math Score: ${student.math}
          Science Score: ${student.science}
          English Score: ${student.english}
          Total Score: ${student.total}
          Grade: ${student.grade}
        `;

        documents.push(
          new Document({
            pageContent: content,
            metadata: {
              studentId: student.id,
              class: student.class,
              section: student.section,
              grade: student.grade
            }
          })
        );
      });
    }

    return documents;
  }

  async retrieveRelevantContext(query: string, k: number = 3): Promise<string> {
    // if (!this.vectorStore) {
    //   throw new Error('Vector store not initialized');
    // }

    try {
      // const results = await this.vectorStore.similaritySearch(query, k);
      
      // Format the context in a more structured way
      let formattedContext = 'Here is the relevant student data for your analysis:\n\n';
      // results.forEach((doc: Document, index: number) => {
      //   formattedContext += `Student ${index + 1}:\n${doc.pageContent.trim()}\n\n`;
      // });
      
      return formattedContext;
    } catch (error) {
      console.error('Error retrieving context:', error);
      throw error;
    }
  }
}