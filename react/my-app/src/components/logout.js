import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {

   //  const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("token")) || "");
    let navigate = useNavigate();

   //   if(token) {
   //      localStorage.removeItem('token');
   //      alert('Logout Successfully');
   //      navigate('/');
   //   }
};

export default Logout;