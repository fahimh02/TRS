import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import ProtectedUnLoggedRoute from "./Middlewares/ProtectedUnLogedUser";
import ProtectedRoute from "./Middlewares/ProtectedRouter";
import Home from "../Pages/Home/index";
import NavbarMiddleware from "./Middlewares/NavbarMiddleware";
import UserMiddleware from "./Middlewares/UserMiddleware";
import Admin from "../Pages/Admin/Admin";
import AdminMiddleware from "./Middlewares/AdminMiddleware";

import MyCalculations from "../components/MyCalculations";
import Form from '../components/TrsCalculation/Form';
//import CalculatedThreadInfo from "../components/TrsCalculation/CalculatedThreadInfo";


const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<NavbarMiddleware />}>
        <Route element={<UserMiddleware />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-calculations" element={<MyCalculations />} />
          {/* Pass onFormDataChange to Form component */}
          <Route path="/style-details/:encryptedId" element={<><Form id={null} onBack={function (): void {
            throw new Error("Function not implemented.");
          } } /></>
        } />
        
                
           
          <Route element={<AdminMiddleware />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* Add additional protected routes here if needed */}
          </Route>
        </Route>
      </Route>
      <Route element={<ProtectedUnLoggedRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
    </Routes>
  );
};

export default Router;
