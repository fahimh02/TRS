// TabActions.tsx
import { useContext } from "react";

import { UserContext, UserContextType } from "../../Context/UserProvider";

import axion from "../../api/axios";
import toast from "react-hot-toast";
import "./TabActions.scss";

const TabActions = ({
 
}: {
  
}) => {
  const { user, setUser }: UserContextType = useContext(UserContext);

  const handleAdmin = async () => {
    try {
      const response = await axion.patch("api/Users/current/role/admin");
      const updatedUser = response.data;
      setUser(updatedUser);
      toast.success("Ahora eres administrador");
    } catch (error) {
      console.error("Error al convertirse en administrador:", error);
    }
  };

  const handleDefault = async () => {
    try {
      const response = await axion.patch("api/Users/current/role/user");
      const updatedUser = response.data;
      setUser(updatedUser);
      toast.success("Ahora eres un usuario sin privilegios");
    } catch (error) {
      console.error("Error al convertirse en usuario sin privilegios:", error);
    }
  };

  return (
    <div className="navchica w-full flex flex-wrap z-10 gap-5 py-[10px] bg-[#67b2e7] justify-center fixed border-b-1 px-5">
      <span
     
      >
        
      </span>

      <span
        className="text-white font-[500] cursor-pointer  text-center  w-[130px] hover:text-[#C5CF2F]"
        onClick={handleAdmin}
      >
        See admin
      </span>

      <span
        className="text-white font-[500] cursor-pointer text-center   w-[130px] hover:text-[#C5CF2F]"
        onClick={handleDefault}
      >
        Be a user
      </span>

      {user?.role === "admin" && (
        <span
          
        >
       
        </span>
      )}
     
      
     
    </div>
  );
};

export default TabActions;
