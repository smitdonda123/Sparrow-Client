import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
// import SignUp from "./Components/Login/SignUp";
// import AdminDashboard from "./Components/Admin/AdminDashboard/AdminDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard/AdminDashboard"
import UserDasboard from "./Components/Dashboard/UserDasboard"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDasboard />} />
          {/* <Route path="/"  */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
