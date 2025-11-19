# 📋 TaskManager - Full Stack Task Management Application

Live Link : https://taskmanager-frontend-k5lw.onrender.com

A modern, full-stack task management application built with React and Node.js. This application allows users to create, manage, and track tasks with role-based access control (Admin and User roles).

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication with secure HTTP-only cookies
- Role-based access control (Admin & User)
- Protected routes

### 📝 Task Management
- Create, update, and delete tasks
- Task status management (Pending, In Progress, Completed)
- Task assignment to multiple users
- Task priority levels
- Due date management
- Task attachments support
- Todo checklist within tasks

### 👥 User Management (Admin Only)
- View all users
- Manage user profiles
- User role management

### 📊 Dashboard & Analytics
- Admin dashboard with task statistics
- User dashboard with assigned tasks
- Visual charts and graphs (Bar charts, Pie charts)
- Task progress tracking
- Recent tasks display

### 📄 Reports (Admin Only)
- Generate Excel reports
- Task analytics and insights

### 🎨 Modern UI/UX
- Responsive design
- Tailwind CSS styling
- Interactive components
- Toast notifications
- Modal dialogs

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Moment.js** - Date handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File uploads
- **ExcelJS** - Excel report generation
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TaskManager-main/
├── backend/
│   ├── controller/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   ├── user.controller.js
│   │   └── report.controller.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   └── task.model.js
│   ├── routes/              # API routes
│   │   ├── auth.route.js
│   │   ├── task.route.js
│   │   ├── user.route.js
│   │   └── report.route.js
│   ├── utils/               # Utility functions
│   │   ├── verifyUser.js
│   │   ├── error.js
│   │   └── multer.js
│   ├── uploads/             # Uploaded files
│   ├── index.js             # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   └── user/        # User pages
│   │   ├── redux/           # Redux store
│   │   ├── routes/          # Route configuration
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── index.html
│   └── package.json
│
├── render.yaml              # Render deployment config
├── DEPLOYMENT.md            # Detailed deployment guide
├── QUICK_START.md           # Quick deployment guide
├── RENDER_DEPLOY_STEPS.md   # Step-by-step Render guide
├── IMPORTANT_FIXES.md       # Important fixes documentation
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prince62058/TaskManager1.git
   cd TaskManager-main
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/taskmanager
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Frontend URL (for CORS)
FRONT_END_URL=http://localhost:5173

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development

# Admin Join Code (optional)
ADMIN_JOIN_CODE=your-admin-code
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:3000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open Browser**
   Navigate to `http://localhost:5173`

## 🔑 Default Access

- **User Role**: Sign up normally
- **Admin Role**: Use the admin join code during signup (set in `ADMIN_JOIN_CODE`)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update-profile` - Update user profile

### Tasks
- `POST /api/tasks/create` - Create task (Authenticated)
- `GET /api/tasks` - Get all tasks (Authenticated)
- `GET /api/tasks/:id` - Get task by ID (Authenticated)
- `PUT /api/tasks/:id` - Update task (Authenticated)
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `PUT /api/tasks/:id/status` - Update task status (Authenticated)
- `PUT /api/tasks/:id/todo` - Update task checklist (Authenticated)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reports (Admin Only)
- `GET /api/reports` - Generate Excel report

## 🚀 Deployment

### Deploy on Render

This application is configured for easy deployment on Render. Follow these guides:

1. **Quick Start**: See [QUICK_START.md](./QUICK_START.md)
2. **Detailed Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Step-by-Step**: See [RENDER_DEPLOY_STEPS.md](./RENDER_DEPLOY_STEPS.md)

### Important Notes for Deployment

- Set all environment variables in Render dashboard
- **JWT_SECRET** is required for authentication
- Configure CORS with your frontend URL
- MongoDB Atlas is recommended for production
- File uploads won't persist on Render free tier (use cloud storage)

See [IMPORTANT_FIXES.md](./IMPORTANT_FIXES.md) for deployment fixes and troubleshooting.

## 🧪 Testing

1. Create a test user account
2. Login with credentials
3. Create a task
4. Assign task to users
5. Update task status
6. Test admin features (if admin role)

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized Error**
   - Check JWT_SECRET is set in environment variables
   - Verify cookies are enabled in browser
   - Check CORS configuration

2. **Database Connection Error**
   - Verify MongoDB connection string
   - Check network access in MongoDB Atlas
   - Ensure database is running

3. **CORS Errors**
   - Verify FRONT_END_URL matches your frontend URL
   - Check CORS configuration in backend

4. **File Upload Issues**
   - Check multer configuration
   - Verify uploads directory permissions
   - For production, use cloud storage (S3, Cloudinary)

## 📝 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Prince Kumar**

- GitHub: [@prince62058](https://github.com/prince62058)
- Repository: [TaskManager1](https://github.com/prince62058/TaskManager1)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- All open-source contributors

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Made with ❤️ using React and Node.js**

