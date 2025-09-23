# English Center - NestJS API

A comprehensive NestJS-based REST API for managing an English language learning center. This system provides complete management functionality for students, teachers, parents, classes, payments, and administrative operations.

## 🚀 Features

### Core Modules
- **User Management** - Students, Teachers, Parents, and Admins
- **Authentication & Authorization** - JWT-based auth with role-based permissions
- **Class Management** - Course scheduling and management
- **Payment Processing** - Student payments and teacher compensation
- **Registration System** - Course enrollment management
- **Session Management** - Class session tracking
- **File Management** - Document and media handling with Cloudinary
- **Content Management** - Articles, advertisements, and menus
- **Audit Logging** - Complete activity tracking
- **Dashboard & Analytics** - Administrative insights
- **Feedback System** - User feedback collection
- **Internationalization** - Multi-language support (EN/VI)

### Technical Features
- **Role-Based Access Control** - Dynamic permissions system
- **Real-time Processing** - BullMQ job queues with Redis
- **Caching** - Redis-based caching for performance
- **Database** - PostgreSQL with TypeORM
- **API Versioning** - URI-based versioning (v1)
- **Validation** - Comprehensive input validation with i18n
- **Logging** - Winston-based structured logging
- **Testing** - Jest test framework
- **Documentation** - Auto-generated API documentation

## 🛠 Technology Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 17.x
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT (Passport.js)
- **Cache/Queue**: Redis 7.x with BullMQ
- **File Storage**: Cloudinary
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Language**: TypeScript 5.x
- **Container**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 17+
- Redis 7+
- Docker & Docker Compose (optional)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/duongduyy004/eng-center-nestjs.git
cd eng-center-nestjs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env` file from the example:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Application
APP_PORT=8080
APP_NAME=english-center
NODE_ENV=development
FRONTEND_DOMAIN=http://localhost:3000
BACKEND_DOMAIN=http://localhost:8080

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=root
DATABASE_PASSWORD=123456
DATABASE_NAME=eng-center
DATABASE_TYPE=postgres

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRATION_MINUTES=30m
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRATION_DAYS=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Setup

#### Using Docker Compose (Recommended)
```bash
docker-compose up -d eng-center-db redis
```

#### Manual Setup
1. Create PostgreSQL database named `eng-center`
2. Start Redis server
3. Run database migrations and seeds:
```bash
npm run seed
```

### 5. Start the application

#### Development
```bash
npm run start:dev
```

#### Debug mode
```bash
npm run start:debug
```

#### Production
```bash
npm run build
npm run start:prod
```

## 🐳 Docker Deployment

### Full Stack with Docker Compose
```bash
docker-compose up -d
```

### Build Application Image
```bash
docker build -t eng-center-app .
```

## 📚 API Documentation

The API is versioned and follows RESTful conventions:
- Base URL: `http://localhost:8080/api/v1`
- Authentication: Bearer token required for protected routes
- Content-Type: `application/json`

### Authentication Endpoints

#### User Login
```http
POST /api/v1/auth/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

#### Admin Login
```http
POST /api/v1/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

#### Refresh Token
```http
GET /api/v1/auth/refresh
```

### Core Endpoints

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Users** | `/users` | User management (CRUD) |
| **Students** | `/students` | Student management |
| **Teachers** | `/teachers` | Teacher management |
| **Parents** | `/parents` | Parent management |
| **Classes** | `/classes` | Class management |
| **Payments** | `/payments` | Payment processing |
| **Sessions** | `/sessions` | Session management |
| **Registrations** | `/registrations` | Course registrations |
| **Articles** | `/articles` | Content management |
| **Menus** | `/menus` | Menu management |
| **Files** | `/files` | File upload/management |
| **Permissions** | `/permissions/grouped-by-module` | Permission management |
| **Roles** | `/roles` | Role management |

### Response Format

#### Success Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    // Response data
  }
}
```

#### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```

## 🔐 Authentication & Authorization

### JWT Authentication
- **Access Token**: 30 minutes expiration
- **Refresh Token**: 30 days expiration (HTTP-only cookie)
- **Token Refresh**: Automatic token renewal

### Role-Based Permissions
The system implements a dynamic role-permission system:

#### Roles
- **Admin** - Full system access
- **Teacher** - Teaching and class management
- **Parent** - Child's progress monitoring
- **Student** - Course access and assignments

#### Permission Structure
```typescript
{
  id: number,
  path: string,        // API endpoint path
  method: string,      // HTTP method (GET, POST, etc.)
  module: string,      // Feature module (users, classes, etc.)
  version: number,     // API version
  description: string  // Permission description
}
```

## 🗄 Database Schema

### Key Entities

#### User Entity
```typescript
{
  id: string (UUID),
  name: string,
  email: string,
  password: string,
  phone?: string,
  address?: string,
  gender?: Gender,
  dayOfBirth?: Date,
  avatar?: string,
  role: Role,
  refreshToken?: string
}
```

#### Role Entity
```typescript
{
  id: number,
  name: string,
  description?: string,
  permissions: Permission[]
}
```

#### Article Entity
```typescript
{
  id: string (UUID),
  title: string,
  content: string,
  summary?: string,
  thumbnail?: string,
  order: number,
  isActive: boolean,
  menu: Menu
}
```

## 🚦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the application |
| `npm run start` | Start production server |
| `npm run start:dev` | Start development server |
| `npm run start:debug` | Start debug server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run seed` | Run database seeds |

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── configs/         # Environment configurations
│   └── types/           # Configuration type definitions
├── core/                # Core interceptors and utilities
├── database/            # Database configurations and seeds
├── decorator/           # Custom decorators
├── i18n/               # Internationalization files
├── logger/             # Logging configuration
├── modules/            # Feature modules
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── students/       # Student management
│   ├── teachers/       # Teacher management
│   ├── classes/        # Class management
│   ├── payments/       # Payment processing
│   ├── articles/       # Content management
│   ├── permissions/    # Permission management
│   ├── roles/          # Role management
│   └── .../           # Other modules
├── subscribers/        # TypeORM entity subscribers
└── utils/              # Utility functions and types
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Structure
```
test/
├── app.e2e-spec.ts     # End-to-end tests
└── jest-e2e.json       # E2E Jest configuration
```

## 🌐 Internationalization

The application supports multiple languages:
- English (en) - Default
- Vietnamese (vi)

Translation files are located in `src/i18n/`:
```
src/i18n/
├── en/
│   ├── auth.json
│   ├── common.json
│   ├── validation.json
│   └── ...
└── vi/
    ├── auth.json
    ├── common.json
    ├── validation.json
    └── ...
```

## 📊 Monitoring & Logging

### Logging
- **Winston Logger** - Structured logging
- **HTTP Request Logging** - Request/response logging
- **Error Tracking** - Comprehensive error logging

### Audit Trail
- **Entity Subscriber** - Automatic audit logging
- **User Actions** - Track all user activities
- **Data Changes** - Monitor data modifications

## 🚀 Performance Optimization

### Caching Strategy
- **Redis Cache** - Application-level caching
- **Query Optimization** - Database query optimization
- **Connection Pooling** - Database connection management

### Background Processing
- **BullMQ Queues** - Asynchronous job processing
- **Redis Backend** - Reliable job queue management

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt password encryption
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - API rate limiting (configurable)
- **Security Headers** - HTTP security headers

## 🐛 Error Handling

The application implements comprehensive error handling:

### Global Exception Filters
- **I18nValidationExceptionFilter** - Localized validation errors
- **HTTP Exception Filter** - Standardized error responses

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2025-09-23T10:30:00.000Z"
}
```

## 📈 Scalability Considerations

### Database
- **Connection Pooling** - Efficient connection management
- **Query Optimization** - Indexed queries and relations
- **Migration System** - Version-controlled schema changes

### Application
- **Modular Architecture** - Scalable module system
- **Async Processing** - Background job processing
- **Stateless Design** - Horizontal scaling ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow NestJS conventions
- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive tests
- Document API changes

## 📝 License

This project is licensed under the UNLICENSED License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue on GitHub
- Contact: [duongduyy004@gmail.com]

## 🔄 Version History

- **v0.0.1** - Initial release
  - Core modules implementation
  - Authentication & authorization
  - Role-based permission system
  - Multi-language support

---

**Note**: This README provides comprehensive information about the English Center NestJS API. For specific implementation details, refer to the source code and inline documentation.