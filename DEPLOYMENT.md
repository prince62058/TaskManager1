# Render Deployment Guide (हिंदी में)

यह guide आपको TaskManager project को Render पर deploy करने में मदद करेगा।

## Prerequisites (आवश्यक चीजें)

1. **Render Account**: [render.com](https://render.com) पर account बनाएं
2. **MongoDB Database**: MongoDB Atlas (free tier) पर database बनाएं
3. **GitHub Repository**: Code को GitHub पर push करें

---

## Step 1: MongoDB Atlas Setup

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) पर जाएं और account बनाएं
2. Free cluster बनाएं
3. Database User बनाएं (username और password)
4. Network Access में अपना IP address add करें (या 0.0.0.0/0 सभी IPs के लिए)
5. "Connect" button पर click करें और "Connect your application" चुनें
6. Connection string copy करें (जैसे: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

---

## Step 2: Backend Deployment

### Option A: Using render.yaml (Recommended)

1. Render dashboard में जाएं
2. "New +" → "Blueprint" चुनें
3. GitHub repository connect करें
4. `render.yaml` file automatically detect होगी
5. Environment variables set करें:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `FRONT_END_URL`: Frontend URL (पहले deploy करने के बाद update करें)

### Option B: Manual Setup

1. Render dashboard में "New +" → "Web Service" चुनें
2. GitHub repository connect करें
3. Settings configure करें:
   - **Name**: `taskmanager-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (project root)

4. **Environment Variables** add करें:
   ```
   NODE_ENV=production
   MONGO_URI=your-mongodb-atlas-connection-string
   FRONT_END_URL=https://your-frontend-url.onrender.com
   PORT=10000
   ```

5. "Create Web Service" पर click करें

---

## Step 3: Frontend Deployment

### Option A: Using render.yaml (Recommended)

render.yaml file में frontend service already configured है। Blueprint deploy करने पर automatically create होगी।

### Option B: Manual Setup

1. Render dashboard में "New +" → "Static Site" चुनें
2. GitHub repository connect करें
3. Settings configure करें:
   - **Name**: `taskmanager-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. **Environment Variables** add करें:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. "Create Static Site" पर click करें

---

## Step 4: Update Environment Variables

### Backend में:
1. Backend service के settings में जाएं
2. Environment variables में `FRONT_END_URL` update करें:
   ```
   FRONT_END_URL=https://taskmanager-frontend.onrender.com
   ```
3. Service restart करें

### Frontend में:
1. Frontend service के settings में जाएं
2. Environment variables में `VITE_API_URL` update करें:
   ```
   VITE_API_URL=https://taskmanager-backend.onrender.com/api
   ```
3. Service rebuild करें

---

## Step 5: File Uploads (Important!)

⚠️ **Note**: Render की free tier में file uploads persist नहीं होते क्योंकि filesystem ephemeral है।

### Solutions:

1. **Cloud Storage Use करें** (Recommended):
   - AWS S3
   - Cloudinary
   - Google Cloud Storage

2. **Database में store करें** (small files के लिए)

3. **External storage service** integrate करें

---

## Important Notes (महत्वपूर्ण बातें)

1. **Free Tier Limitations**:
   - Services 15 minutes inactivity के बाद sleep हो जाते हैं
   - First request slow हो सकता है (cold start)
   - File uploads persist नहीं होते

2. **CORS Configuration**:
   - Backend में `FRONT_END_URL` सही set करें
   - Frontend URL include करें (with https://)

3. **Environment Variables**:
   - Production में sensitive data environment variables में रखें
   - Never commit `.env` files

4. **Build Time**:
   - First build 5-10 minutes ले सकता है
   - Subsequent builds faster होते हैं

---

## Troubleshooting (समस्या निवारण)

### Backend issues:
- Check logs: Render dashboard → Service → Logs
- Verify MongoDB connection string
- Check CORS settings
- Verify PORT environment variable

### Frontend issues:
- Check build logs
- Verify `VITE_API_URL` environment variable
- Check browser console for errors
- Ensure backend URL is accessible

### Common Errors:
- **503 Service Unavailable**: Service sleep हो गई है, wait करें
- **CORS Error**: `FRONT_END_URL` check करें
- **Database Connection Error**: MongoDB Atlas connection string verify करें

---

## URLs Structure

After deployment, आपके URLs कुछ इस तरह होंगे:
- Backend: `https://taskmanager-backend.onrender.com`
- Frontend: `https://taskmanager-frontend.onrender.com`

---

## Support

अगर कोई problem आए तो:
1. Render dashboard में logs check करें
2. Browser console में errors check करें
3. MongoDB Atlas connection verify करें

Good luck with your deployment! 🚀

