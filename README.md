
### **Frontend README (`frontend/README.md`)**

```markdown
# Student Management System - Frontend

A production-style React application built with TypeScript and Tailwind CSS. This frontend provides real-time system monitoring and a responsive interface for student data management.

## 🚀 Tech Stack
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **API Client:** Axios

## 🛠️ Installation & Setup
1. **Navigate to the frontend folder:**
   ```bash
   cd frontend

```

2. **Install dependencies:**
```bash
npm install

```


3. **Environment Configuration:**
Ensure the API base URL in `src/api/axiosInstance.ts` matches your backend port:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

```


4. **Run the development server:**
```bash
npm run dev

```



## ✨ Key Features

* **Real-time Monitoring:** A live Dashboard that tracks the connectivity status of the API Server and PostgreSQL Database.
* **Performance Optimized:** Uses specialized React patterns (isMounted flags) to prevent memory leaks and cascading renders.
* **Standardized UI:** Features a professional "Bright UI" theme with responsive status badges and data cards.
* **Unified Codebase:** Uses consistent naming and data structures to ensure seamless integration with the backend.

## 📁 Project Structure

* `src/api/` - Centralized Axios instance and service calls.
* `src/pages/` - Main view components including the System Dashboard.
* `src/index.css` - Tailwind CSS directives and global styles.

```

 

```