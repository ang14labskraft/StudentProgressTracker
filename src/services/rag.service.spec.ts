import { TestBed } from '@angular/core/testing';
import { RagService } from './rag.service';
import { environment } from '../environments/environment';

describe('RagService', () => {
  let service: RagService;

  const mockData = {
    students: [
      {
        id: '1',
        name: 'John Doe',
        class: 10,
        section: 'A',
        math: 85,
        science: 90,
        english: 88,
        total: 263,
        grade: 'A'
      },
      {
        id: '2',
        name: 'Jane Smith',
        class: 10,
        section: 'B',
        math: 92,
        science: 88,
        english: 95,
        total: 275,
        grade: 'A+'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RagService]
    });
    service = TestBed.inject(RagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Vector Store Initialization', () => {
    it('should initialize vector store with student data', async () => {
      await service.initializeVectorStore(mockData);
      expect(service['vectorStore']).toBeTruthy();
    });

    it('should handle initialization errors', async () => {
      try {
        await service.initializeVectorStore(null);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('Context Retrieval', () => {
    beforeEach(async () => {
      await service.initializeVectorStore(mockData);
    });

    it('should retrieve relevant context for a query', async () => {
      const query = 'performance in math';
      const context = await service.retrieveRelevantContext(query);
      
      expect(context).toContain('Math Score');
      expect(context).toBeTruthy();
    });

    it('should include student names in context', async () => {
      const query = 'John Doe performance';
      const context = await service.retrieveRelevantContext(query);
      
      expect(context).toContain('John Doe');
    });

    it('should handle empty vector store', async () => {
      service['vectorStore'] = null;
      
      try {
        await service.retrieveRelevantContext('test query');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Vector store not initialized');
      }
    });

    it('should return multiple relevant contexts', async () => {
      const query = 'class 10 students';
      const context = await service.retrieveRelevantContext(query, 2);
      
      expect(context).toContain('John Doe');
      expect(context).toContain('Jane Smith');
    });
  });

  describe('Document Preparation', () => {
    it('should properly format student data into documents', () => {
      const documents = service['prepareDocuments'](mockData);
      
      expect(documents.length).toBe(2);
      expect(documents[0].pageContent).toContain('Student ID: 1');
      expect(documents[0].metadata).toBeTruthy();
    });

    it('should handle empty data', () => {
      const documents = service['prepareDocuments']({ students: [] });
      expect(documents.length).toBe(0);
    });

    it('should include all relevant fields in document content', () => {
      const documents = service['prepareDocuments'](mockData);
      const content = documents[0].pageContent;
      
      expect(content).toContain('Math Score');
      expect(content).toContain('Science Score');
      expect(content).toContain('English Score');
      expect(content).toContain('Grade');
    });

    it('should set correct metadata', () => {
      const documents = service['prepareDocuments'](mockData);
      const metadata = documents[0].metadata;
      
      expect(metadata.studentId).toBe('1');
      expect(metadata.class).toBe(10);
      expect(metadata.section).toBe('A');
      expect(metadata.grade).toBe('A');
    });
  });
});