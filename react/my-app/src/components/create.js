import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = 'http://localhost:7000/users/register';

function Create() {

let [username, setUsername] = useState();
let [email, setEmail] = useState();
let [password, setPassword] = useState();
let [files, setFiles] = useState(null);
// const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("token")) || "");

    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFiles(file);
    };
    
   const Createfun=(e)=> {

    e.preventDefault();

    const formdata = new FormData();

    formdata.append("username", username);
    formdata.append("email", email);
    formdata.append('password', password);
    formdata.append('file', files);

    axios.post(baseURL, formdata, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res)=>{
        console.log('ccccccc', res);
        if(res) {
            alert(res.data.message);
        }
        else {
            alert(res.data);
        };
        navigate('/');
    }).catch(err =>console.log(err));
   };

    return(
        <>
        <section className="vh-100 gradient-custom">
        <form className="container py-5 h-100" onSubmit={Createfun}>
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div className="card bg-dark text-white" style={{'borderRadius': '1rem'}}>
                <div className="card-body p-5 text-center">

                    <div className="mb-md-5 mt-md-4 pb-5">

                    <h2 className="fw-bold mb-2 text-uppercase">Create</h2>

                    <div className="form-outline form-white mb-4">
                        <input type="text" id="typeEmailX" className="form-control form-control-lg" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                        <label className="form-label" htmlFor="typeEmailX">Username</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <input type="email" id="typeEmailX" className="form-control form-control-lg" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <input type="password" id="typePasswordX" className="form-control form-control-lg" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <label className="form-label" htmlFor="typePasswordX">Password</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <input type="file" id="typeFileX" className="form-control form-control-lg" onChange={handleImageChange}/>
                        <label className="form-label" htmlFor="typeFileX">Image</label>
                    </div>

                    <button className="btn btn-outline-light btn-lg px-5" type="submit">Create</button>

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

export default Create;