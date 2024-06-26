import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';



function App() {

  if (localStorage.getItem("url") !== "http://localhost/api/") {
    localStorage.setItem("url", "http://localhost/api/");
  }

  return (
    <>
      <div className="text-white" style={{ backgroundColor: "#18191A" }}>
        <Toaster richColors position='top-center' duration={1500} />
        <BrowserRouter basename='sync'>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/userProfile" element={<UserProfile />} />


          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
