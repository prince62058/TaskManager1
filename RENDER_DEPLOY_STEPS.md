# Render Deployment - Step by Step Guide (हिंदी में)

## 📋 Prerequisites (आवश्यक चीजें)

1. ✅ GitHub repository ready है: https://github.com/prince62058/TaskManager1
2. ⚠️ MongoDB Atlas account चाहिए
3. ⚠️ Render account चाहिए

---

## Step 1: MongoDB Atlas Setup (पहले करें)

### 1.1 MongoDB Atlas Account बनाएं
1. https://www.mongodb.com/cloud/atlas पर जाएं
2. "Try Free" button click करें
3. Email और password से account बनाएं

### 1.2 Free Cluster बनाएं
1. "Build a Database" click करें
2. **FREE** (M0) plan select करें
3. Cloud Provider: **AWS** (या कोई भी)
4. Region: **Mumbai (ap-south-1)** या nearest region
5. Cluster name: `Cluster0` (default)
6. "Create" click करें

### 1.3 Database User बनाएं
1. "Database Access" (left menu) पर click करें
2. "Add New Database User" click करें
3. Authentication Method: **Password**
4. Username: अपना username (जैसे: `taskmanager`)
5. Password: Strong password बनाएं (⚠️ **SAVE करें!**)
6. Database User Privileges: **Atlas admin**
7. "Add User" click करें

### 1.4 Network Access Setup करें
1. "Network Access" (left menu) पर click करें
2. "Add IP Address" click करें
3. "Allow Access from Anywhere" click करें (0.0.0.0/0)
4. "Confirm" click करें

### 1.5 Connection String लें
1. "Database" (left menu) पर click करें
2. "Connect" button click करें
3. "Connect your application" select करें
4. Driver: **Node.js**, Version: **5.5 or later**
5. Connection string copy करें:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. `<username>` और `<password>` replace करें (जो आपने बनाया था)
7. Database name add करें:
   ```
   mongodb+srv://taskmanager:yourpassword@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```
8. ⚠️ **यह connection string SAVE करें!** आपको चाहिए होगी

---

## Step 2: Render Account Setup

### 2.1 Render Account बनाएं
1. https://render.com पर जाएं
2. "Get Started for Free" click करें
3. "Sign up with GitHub" click करें (recommended)
4. GitHub account से authorize करें

---

## Step 3: Backend Deploy करें

### 3.1 New Web Service बनाएं
1. Render dashboard में "New +" button click करें
2. "Web Service" select करें

### 3.2 GitHub Repository Connect करें
1. "Connect account" या "Connect GitHub" click करें (अगर पहली बार)
2. GitHub से authorize करें
3. Repository search करें: `TaskManager1`
4. Repository select करें
5. "Connect" click करें

### 3.3 Service Settings Configure करें
- **Name**: `taskmanager-backend`
- **Region**: `Mumbai (Mumbai)` या nearest
- **Branch**: `main`
- **Root Directory**: (खाली छोड़ें)
- **Runtime**: `Node`
- **Build Command**: 
  ```
  cd backend && npm install
  ```
- **Start Command**: 
  ```
  cd backend && npm start
  ```

### 3.4 Environment Variables Add करें
"Advanced" section में "Add Environment Variable" click करें:

1. **MONGO_URI**
   - Key: `MONGO_URI`
   - Value: MongoDB Atlas connection string (Step 1.5 से)
   - Example: `mongodb+srv://taskmanager:password@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority`

2. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

3. **FRONT_END_URL** (अभी temporary, बाद में update करेंगे)
   - Key: `FRONT_END_URL`
   - Value: `https://taskmanager-frontend.onrender.com` (temporary)

4. **PORT** (optional, Render automatically set करता है)
   - Key: `PORT`
   - Value: `10000`

### 3.5 Deploy करें
1. "Create Web Service" click करें
2. Build start होगा (5-10 minutes लग सकते हैं)
3. ⏳ Wait करें...
4. Deploy complete होने पर URL note करें:
   - जैसे: `https://taskmanager-backend.onrender.com`
   - ⚠️ **यह URL SAVE करें!**

---

## Step 4: Frontend Deploy करें

### 4.1 New Static Site बनाएं
1. Render dashboard में "New +" button click करें
2. "Static Site" select करें

### 4.2 GitHub Repository Connect करें
1. Repository: `TaskManager1` select करें
2. "Connect" click करें

### 4.3 Static Site Settings Configure करें
- **Name**: `taskmanager-frontend`
- **Branch**: `main`
- **Root Directory**: (खाली छोड़ें)
- **Build Command**: 
  ```
  cd frontend && npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  frontend/dist
  ```

### 4.4 Environment Variables Add करें
"Add Environment Variable" click करें:

1. **VITE_API_URL**
   - Key: `VITE_API_URL`
   - Value: Backend URL + `/api`
   - Example: `https://taskmanager-backend.onrender.com/api`
   - ⚠️ Backend URL यहाँ paste करें (Step 3.5 से)

### 4.5 Deploy करें
1. "Create Static Site" click करें
2. Build start होगा (5-10 minutes)
3. ⏳ Wait करें...
4. Deploy complete होने पर URL note करें:
   - जैसे: `https://taskmanager-frontend.onrender.com`
   - ⚠️ **यह URL SAVE करें!**

---

## Step 5: Backend में Frontend URL Update करें

### 5.1 Backend Service Settings में जाएं
1. Render dashboard में `taskmanager-backend` service पर click करें
2. "Environment" tab पर click करें

### 5.2 FRONT_END_URL Update करें
1. `FRONT_END_URL` variable find करें
2. Edit करें
3. Value update करें: Frontend URL (Step 4.5 से)
   - Example: `https://taskmanager-frontend.onrender.com`
4. "Save Changes" click करें
5. Service automatically restart होगी

---

## Step 6: Test करें

### 6.1 Frontend Open करें
1. Frontend URL open करें: `https://taskmanager-frontend.onrender.com`
2. Page load होना चाहिए

### 6.2 Sign Up / Login Test करें
1. Sign Up page पर जाएं
2. New account बनाएं
3. Login करें
4. अगर error आए तो:
   - Browser console check करें (F12)
   - Render logs check करें

### 6.3 Common Issues Check करें
- **CORS Error**: Backend में `FRONT_END_URL` सही है या नहीं check करें
- **API Error**: `VITE_API_URL` frontend में सही है या नहीं check करें
- **Database Error**: MongoDB connection string verify करें

---

## ✅ Deployment Complete!

अगर सब कुछ सही है, तो आपका app live है! 🎉

### Your URLs:
- **Frontend**: `https://taskmanager-frontend.onrender.com`
- **Backend**: `https://taskmanager-backend.onrender.com`

---

## 🔧 Troubleshooting

### Backend Issues:
1. **Service not starting**
   - Logs check करें: Service → Logs tab
   - MongoDB connection string verify करें
   - PORT check करें

2. **Database connection error**
   - MongoDB Atlas में Network Access check करें (0.0.0.0/0)
   - Connection string में username/password सही हैं या नहीं
   - Database name सही है या नहीं

### Frontend Issues:
1. **Build failing**
   - Logs check करें
   - `npm install` errors देखें
   - Dependencies check करें

2. **API calls not working**
   - Browser console check करें (F12)
   - `VITE_API_URL` environment variable verify करें
   - Backend URL accessible है या नहीं check करें

3. **CORS errors**
   - Backend में `FRONT_END_URL` सही set करें
   - Frontend URL include करें (https:// के साथ)

---

## 📝 Quick Reference

### Environment Variables Checklist:

**Backend:**
- ✅ `MONGO_URI` - MongoDB connection string
- ✅ `FRONT_END_URL` - Frontend URL
- ✅ `NODE_ENV` - production
- ✅ `PORT` - 10000 (optional)

**Frontend:**
- ✅ `VITE_API_URL` - Backend URL + `/api`

---

## 🎯 Next Steps

1. ✅ Test करें कि सब कुछ काम कर रहा है
2. ⚠️ File uploads के लिए cloud storage (S3/Cloudinary) setup करें
3. 🔒 Production के लिए security best practices follow करें
4. 📊 Monitoring setup करें

---

**Good luck with your deployment! 🚀**

