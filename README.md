# Courier Demo Platform

A comprehensive interactive demo showcasing Courier's complete notification platform ecosystem, including Inbox, Create, and messaging capabilities. This demo is designed for customer presentations, developer onboarding, and learning Courier's features.

## 🚀 Features

This demo showcases all three core Courier products:

### 1. **Courier Inbox** - Real-time Notifications
- Live notification feed with WebSocket connections
- JWT authentication with correct Courier scopes
- Message history and interaction capabilities
- Real-time updates and notifications

### 2. **Courier Create** - Embeddable Template Designer
- Visual template editor for creating notifications
- Brand customization and management
- Multi-channel template support (email, SMS, in-app)
- Template versioning and management

### 3. **Complete Messaging System**
- Send messages through multiple channels
- Demo notification scenarios (order confirmation, shipping updates)
- User profile management via Courier
- JWT token generation for all Courier services

## 🏗️ Architecture

### Backend (Django + SQLite)
- **Django REST Framework** for API endpoints
- **SQLite** for minimal local data storage
- **Courier as primary user store** - leverages their user management APIs
- **JWT generation** with correct Courier scopes:
  - `user_id:<user-id>` - User access
  - `read:messages` - Read messages from inbox
  - `read:brands[:<brand_id>]` - Read brand information
  - `write:brands[:<brand_id>]` - Write brand information
- **CORS configuration** for frontend communication
- **Environment variable management** for API keys

### Frontend (React + Material UI)
- **Material UI** for clean, modern interface
- **Courier React SDK** components:
  - `@trycourier/react-provider` - Authentication wrapper
  - `@trycourier/react-inbox` - Real-time notification feed
  - `@trycourier/react-designer` - Template designer
- **TypeScript** for type safety
- **React Router** for navigation
- **Axios** for API communication

## 📁 Project Structure

```
bayer-demo/
├── backend/                       # Django API
│   ├── backend/                   # Django settings
│   │   ├── settings.py           # Main configuration
│   │   ├── courier_client.py     # Courier API client
│   │   ├── jwt_utils.py          # JWT token generation
│   │   └── urls.py               # Main URL routing
│   ├── users/                     # User management
│   │   ├── models.py             # User model
│   │   ├── views.py              # API views
│   │   ├── serializers.py        # Data serialization
│   │   └── tests.py              # User tests
│   ├── templates/                 # Template management
│   │   ├── views.py              # Template API views
│   │   └── tests.py              # Template tests
│   ├── messaging/                 # Message sending
│   │   ├── views.py              # Messaging API views
│   │   └── tests.py              # Messaging tests
│   ├── requirements.txt           # Python dependencies
│   └── manage.py                 # Django management
├── frontend/                      # React app
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── Layout/           # Main layout component
│   │   ├── pages/                # Page components
│   │   │   ├── Auth/             # Login/Register pages
│   │   │   ├── Dashboard/        # Main dashboard
│   │   │   ├── Inbox/            # Courier Inbox
│   │   │   ├── Designer/         # Courier Create
│   │   │   └── Messaging/       # Message sending
│   │   ├── contexts/             # React contexts
│   │   │   └── AuthContext.tsx   # Authentication context
│   │   ├── App.tsx               # Main app component
│   │   └── setupTests.ts         # Test configuration
│   ├── package.json              # Node dependencies
│   └── Dockerfile                # Frontend container
├── env.example                    # Environment variables template
├── docker-compose.yml            # Docker orchestration
├── README.md                     # This file
├── COMPREHENSIVE_REVIEW.md       # Detailed analysis & improvements
└── IMPLEMENTATION_SUMMARY.md     # Implementation details
```

## 🛠️ Quick Start

### Prerequisites
- **Python 3.8+** (tested with Python 3.13)
- **Node.js 16+** (tested with Node.js 23.11.0)
- **Courier account** with API keys
- **Git** for cloning the repository

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd bayer-demo
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your actual Courier API keys
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp ../env.example .env
   # Edit .env with your actual Courier API keys
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Start the backend server:**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Courier client key and tenant ID
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```bash
# Courier API Configuration (REQUIRED)
COURIER_API_KEY=your_courier_api_key_here
COURIER_CLIENT_KEY=your_courier_client_key_here
COURIER_TENANT_ID=your_courier_tenant_id_here

# Django Configuration
SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (.env.local)
```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api

# Courier Configuration (REQUIRED)
REACT_APP_COURIER_CLIENT_KEY=your_courier_client_key_here
REACT_APP_COURIER_TENANT_ID=your_courier_tenant_id_here
```

## 🎯 Demo Scenarios

### 1. **User Registration Flow**
1. Navigate to the Register page
2. Fill out the registration form
3. System automatically creates Courier user profile
4. Welcome notification is sent
5. View notification in the Inbox

### 2. **Template Design Workshop**
1. Login to the application
2. Navigate to the Designer page
3. Access Courier Create designer
4. Create/edit notification templates
5. Customize brand elements
6. Preview templates

### 3. **Multi-channel Messaging**
1. Navigate to the Messaging page
2. Send demo notifications (order confirmation, shipping updates)
3. Send custom messages
4. View delivery status
5. See real-time inbox updates

### 4. **Real-time Inbox Experience**
1. Login to the application
2. Navigate to the Inbox page
3. Send notifications from the Messaging page
4. Watch real-time updates in the inbox
5. Interact with messages

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `POST /api/users/logout/` - Logout user
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile

### JWT Tokens
- `GET /api/users/inbox-jwt/` - Get JWT for Courier Inbox
- `GET /api/users/create-jwt/` - Get JWT for Courier Create

### Messaging
- `POST /api/messaging/send/` - Send custom message
- `POST /api/messaging/send-welcome/` - Send welcome message
- `POST /api/messaging/send-demo/` - Send demo notification
- `GET /api/messaging/templates/` - Get message templates
- `GET /api/messaging/messages/` - Get user messages

### Templates
- `GET /api/templates/` - Get all templates
- `GET /api/templates/{id}/` - Get specific template
- `POST /api/templates/create/` - Create template
- `PUT /api/templates/{id}/update/` - Update template
- `DELETE /api/templates/{id}/delete/` - Delete template

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test                    # All tests
python manage.py test --coverage        # With coverage report
python manage.py test users             # User tests only
python manage.py test messaging         # Messaging tests only
```

### Frontend Tests
```bash
cd frontend
npm test                                # All tests
npm run test:coverage                   # With coverage
npm run test:unit                       # Unit tests only
npm run test:ci                         # CI/CD tests
```

### Test Coverage
- **Backend**: 23 tests covering all critical functionality
- **Frontend**: Basic setup tests ensuring framework works
- **Integration**: Complete user lifecycle testing

## 🎨 Customization

### Material UI Theme
The app uses a custom Material UI theme that can be customized in `frontend/src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
});
```

### Courier Component Themes
Courier components can be themed to match your brand:

```typescript
const courierTheme = {
  background: '#ffffff',
  foreground: '#292929',
  border: '#DCDEE4',
  primary: '#1976d2',
  primaryForeground: '#ffffff',
  radius: '8px',
};
```

## 🚀 Deployment

### Production Considerations

⚠️ **Important**: This demo is designed for development and demonstration purposes. For production deployment, consider the following:

#### Security Improvements Needed:
1. **Remove hardcoded secrets** from settings.py
2. **Separate JWT secret** from Django secret key
3. **Add input validation** to all API endpoints
4. **Configure proper CORS** for production domains
5. **Implement rate limiting** and security headers

#### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure production database (PostgreSQL recommended)
3. Set up proper CORS origins
4. Use environment variables for all secrets
5. Deploy to your preferred platform (Heroku, AWS, etc.)

#### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to your preferred platform (Vercel, Netlify, etc.)
3. Update API base URL for production
4. Configure environment variables

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
- **"Token has no attribute 'objects'"**: Ensure `rest_framework.authtoken` is in `INSTALLED_APPS`
- **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in settings
- **Courier API errors**: Verify API keys are correct and have proper permissions

#### Frontend Issues
- **"Cannot find module"**: Run `npm install` to ensure all dependencies are installed
- **Courier components not loading**: Check `REACT_APP_COURIER_CLIENT_KEY` and `REACT_APP_COURIER_TENANT_ID`
- **API connection issues**: Verify `REACT_APP_API_BASE_URL` points to running backend

#### Docker Issues
- **Port conflicts**: Ensure ports 3000 and 8000 are available
- **Build failures**: Check Docker and Docker Compose versions
- **Environment variables**: Ensure `.env` file is properly configured

### Getting Help
1. Check the [Comprehensive Review](COMPREHENSIVE_REVIEW.md) for detailed analysis
2. Review the [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for technical details
3. Check the Courier documentation: https://www.courier.com/docs/
4. Open an issue in this repository

## 📊 Performance & Monitoring

### Current Status
- **Backend**: 23 tests passing, comprehensive API coverage
- **Frontend**: Basic testing setup, Material UI integration
- **Security**: Development-ready, production improvements needed
- **Performance**: Optimized for demo purposes

### Monitoring Recommendations
- **Application Monitoring**: Sentry for error tracking
- **Performance Monitoring**: New Relic or DataDog
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Uptime Monitoring**: Pingdom or UptimeRobot

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Run the test suite: `python manage.py test && npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the [Comprehensive Review](COMPREHENSIVE_REVIEW.md) for detailed analysis
2. Review the [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for technical details
3. Check the Courier documentation: https://www.courier.com/docs/
4. Open an issue in this repository
5. Contact Courier support

## 🙏 Acknowledgments

- **Courier** for providing the notification platform
- **Material UI** for the component library
- **Django and React** communities for excellent frameworks
- **Contributors** who helped improve this demo

---

## 📈 Roadmap

### Immediate Improvements (Week 1)
- [ ] Fix security vulnerabilities
- [ ] Implement proper error handling
- [ ] Add comprehensive input validation

### Short-term Enhancements (Week 2-4)
- [ ] Add more frontend tests
- [ ] Implement caching strategy
- [ ] Add performance monitoring
- [ ] Create deployment guides

### Long-term Goals
- [ ] Microservices architecture
- [ ] Advanced analytics
- [ ] Multi-tenant support
- [ ] Mobile app integration

---

**Ready to showcase Courier's powerful notification platform!** 🚀