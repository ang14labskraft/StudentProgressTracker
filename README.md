# Student Progress Tracker

A comprehensive web application for tracking and managing student academic progress, built with Angular and modern web technologies.

## Features

- **Student Management**
  - View list of students with filtering and sorting capabilities
  - Add new students
  - Edit existing student information
  - Delete students
  - View detailed student information

- **Academic Progress Tracking**
  - Track scores in multiple subjects (Math, Science, English)
  - Automatic grade calculation
  - Performance analytics

- **Modern UI/UX**
  - Material Design inspired interface
  - Responsive layout
  - Interactive data tables
  - Toast notifications for user feedback

## Technical Stack

- **Frontend**: Angular 20+
- **Backend**: REST API (http://localhost:3000)
- **State Management**: RxJS
- **UI Components**: Custom components with Material Design principles
- **Form Handling**: Reactive Forms with validation
- **Routing**: Angular Router with named routes
- **API Integration**: HttpClient
- **AI Integration**: Google Gemini API with RAG implementation

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── chat/
│   │   ├── navbar/
│   │   ├── student-details/
│   │   ├── student-form/
│   │   ├── student-list/
│   │   └── toast/
│   ├── models/
│   │   └── student.ts
│   ├── services/
│   │   ├── chat.service.ts
│   │   ├── rag.service.ts
│   │   ├── student.service.ts
│   │   └── toast.service.ts
│   └── app.routes.ts
```

## Routes

- `/students` - Home page with student list
- `/add-student` - Form to add new student
- `/edit-student/:id` - Form to edit existing student
- `/details/:id` - Detailed view of student information

## Development History

### Phase 1: Initial Setup and Navigation
- Implemented navbar component with Material Design styling
- Set up routing with meaningful paths
- Created responsive layout

### Phase 2: Student Management
- Created Student interface with comprehensive properties
- Implemented CRUD operations via HTTP client
- Added student listing with name parsing

### Phase 3: Data Display and Forms
- Enhanced student list with multiple columns
- Added view and edit capabilities
- Implemented reactive forms with validation

### Phase 4: AI Integration
- Integrated Google Gemini API
- Implemented RAG for context-aware responses
- Enhanced data analysis capabilities

## Installation

1. Clone the repository
```bash
git clone https://github.com/ang14labskraft/StudentProgressTracker.git
```

2. Install dependencies
```bash
cd StudentProgressTracker
npm install
```

3. Set up environment variables
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
# Add your Gemini API key to environment.ts
```

4. Start the development server
```bash
ng serve
```

## Testing

Comprehensive test suite covering:
- Components
- Services
- Integration tests
- Error handling

Run tests with:
```bash
ng test
```

Generate coverage report:
```bash
ng test --code-coverage
```

## Error Resolution

Common errors and their solutions:

1. Gemini API Error (404):
   - Ensure correct API version in configuration
   - Verify API key validity
   - Check model availability using ListModels endpoint

2. Component Loading Issues:
   - Check import statements
   - Verify component declarations
   - Clear browser cache

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
