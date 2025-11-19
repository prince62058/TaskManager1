# Quick Start - Render Deployment (तेज़ शुरुआत)

## 🚀 Fast Deployment Steps

### 1. MongoDB Atlas Setup (5 minutes)
```
1. https://www.mongodb.com/cloud/atlas पर जाएं
2. Free account बनाएं
3. Free cluster create करें
4. Database User बनाएं
5. Network Access में 0.0.0.0/0 add करें (सभी IPs)
6. Connection string copy करें
```

### 2. GitHub पर Code Push करें
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 3. Backend Deploy करें

**Render Dashboard में:**
1. "New +" → "Web Service"
2. GitHub repo connect करें
3. Settings:
   - **Name**: `taskmanager-backend`
   - **Root Directory**: (खाली छोड़ें)
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Environment Variables:
   ```
   MONGO_URI=your-mongodb-connection-string
   FRONT_END_URL=https://taskmanager-frontend.onrender.com
   NODE_ENV=production
   ```
5. "Create Web Service" click करें
6. Backend URL note करें (जैसे: `https://taskmanager-backend.onrender.com`)

### 4. Frontend Deploy करें

**Render Dashboard में:**
1. "New +" → "Static Site"
2. GitHub repo connect करें
3. Settings:
   - **Name**: `taskmanager-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://taskmanager-backend.onrender.com/api
   ```
   (Backend URL यहाँ paste करें + `/api` add करें)
5. "Create Static Site" click करें

### 5. Backend में Frontend URL Update करें

1. Backend service के settings में जाएं
2. Environment Variables में `FRONT_END_URL` update करें:
   ```
   FRONT_END_URL=https://taskmanager-frontend.onrender.com
   ```
3. "Save Changes" → Service automatically restart होगी

### 6. Test करें

1. Frontend URL open करें
2. Login/Signup try करें
3. अगर error आए तो browser console check करें

---

## ⚠️ Important Notes

1. **File Uploads**: Render free tier में files persist नहीं होते। Cloud storage (S3/Cloudinary) use करें।

2. **Sleep Mode**: Free tier services 15 min inactivity के बाद sleep हो जाते हैं। First request slow हो सकता है।

3. **Environment Variables**: 
   - Backend: `MONGO_URI` और `FRONT_END_URL` जरूरी हैं
   - Frontend: `VITE_API_URL` जरूरी है

4. **CORS**: Backend में `FRONT_END_URL` सही set करें, वरना CORS error आएगा।

---

## 🔧 Troubleshooting

**Backend नहीं चल रहा?**
- Logs check करें (Render dashboard → Service → Logs)
- MongoDB connection string verify करें
- PORT environment variable check करें

**Frontend API calls fail हो रहे हैं?**
- `VITE_API_URL` environment variable check करें
- Browser console में errors देखें
- Backend URL accessible है या नहीं check करें

**CORS Error?**
- Backend में `FRONT_END_URL` सही set करें
- Frontend URL include करें (https:// के साथ)

---

## 📝 Environment Variables Summary

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
FRONT_END_URL=https://taskmanager-frontend.onrender.com
PORT=10000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://taskmanager-backend.onrender.com/api
```

---

**Deployment complete! 🎉**

Detailed guide के लिए `DEPLOYMENT.md` देखें।

