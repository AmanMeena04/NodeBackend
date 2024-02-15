import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = 'http://localhost:7000/users/login';

function Login() {

const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("token")) || "");
let [value, setValue] = useState({
    email:'',
    password:''
});

    const navigate = useNavigate();
    
   const Createfun=(e)=> {

    e.preventDefault();

    axios.post(baseURL, value, {
    }).then((res)=>{
        if(res.data.token) {
            setToken(localStorage.setItem('token', JSON.stringify(res.data.token)));
            alert(res.data.message);
            navigate('/');
        }
        else {
            alert(res.data);
        };
    }).catch(err =>console.log(err));
   };

   useEffect(() => {
    if(token !== ""){
        alert("You already logged in");
      navigate("/");
    }
  }, []);

    return(
        <>
        <section className="vh-100 gradient-custom">
        <form className="container py-5 h-100" onSubmit={Createfun}>
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div className="card bg-dark text-white" style={{'borderRadius': '1rem'}}>
                <div className="card-body p-5 text-center">

                    <div className="mb-md-5 mt-md-4 pb-5">

                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>

                    <div className="form-outline form-white mb-4">
                        <input type="email" id="typeEmailX" className="form-control form-control-lg" value={value.email} onChange={(e)=>setValue({...value, email:e.target.value})}/>
                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <input type="password" id="typePasswordX" className="form-control form-control-lg" value={value.password} onChange={(e)=>setValue({...value, password:e.target.value})}/>
                        <label className="form-label" htmlFor="typePasswordX">Password</label>
                    </div>
                    
                    <button className="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

                    <div className="d-flex justify-content-center text-center mt-4 pt-1">
                        <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                        <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                        <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                    </div>
                    </div>
                    <div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </form>
        </section>
        </>
    );
}

export default Login;