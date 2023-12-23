import { useNavigate, useParams } from 'react-router-dom';
import { React,useEffect, useState } from 'react';
import axios from 'axios';

// const baseURL = "http://localhost:7000/users/read";

function Update() {
    const {id} = useParams();
    const [value, setValue] = useState({
        id:id,
        username:'',
        email:'',
        password:'',
        image:''
    });

    // const [name, setname] = useState('');
    // const [email, setEmail] = useState('');

    useEffect(()=>{
        axios.get('http://localhost:7000/users/read/'+id).then(res=>{
            setValue({...value, username: res.data[0].username, email: res.data[0].email, password:res.data[0].password, image:res.data[0].image});
        });
    },[id]);
    
    const navigate = useNavigate();

    const submitform = (e)=>{
        e.preventDefault();

        axios.put("http://localhost:7000/users/update/"+id, value).then(res=>{
            alert(res.data.message);
            navigate('/');
        }).catch(err =>console.log(err));
    };

    return(
      <>
      <section className="vh-100 gradient-custom">
        <form className="container py-5 h-100" onSubmit={submitform}>
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div className="card bg-dark text-white" style={{'borderRadius': '1rem'}}>
                <div className="card-body p-5 text-center">

                    <div className="mb-md-5 mt-md-4 pb-5">

                    <h2 className="fw-bold mb-2 text-uppercase">Update</h2>
                    {/* <p className="text-white-50 mb-5">Please enter your login and password!</p> */}

                    <div className="form-outline form-white mb-4">
                        <input type="text" id="typeEmailX" value={value.username} onChange={e => setValue({...value, username:e.target.value})} className="form-control form-control-lg"/>
                        <label className="form-label" htmlFor="typeEmailX">Username</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <input type="email" id="typeEmailX" value={value.email} onChange={e => setValue({...value, email:e.target.value})} className="form-control form-control-lg"/>
                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                    </div>

                    {/* <div className="form-outline form-white mb-4">
                        <input type="email" id="typeEmailX" value={value.password} onChange={e => setValue({...value, password:e.target.value})} className="form-control form-control-lg"/>
                        <label className="form-label" htmlFor="typeEmailX">Password</label>
                    </div> */}

                    <div className="form-outline form-white mb-4">
                    <div>
                        <img type ="file" src={value.image} alt="Updated Image" />
                        <button>Update Image</button>
                    </div> 
                        {/* <input type="image" id="typeEmailX" value={value.image} onChange={e => setValue({...value, image:e.target.value})} className="form-control form-control-lg"/> */}
                        {/* <label className="form-label" htmlFor="typeEmailX">Image</label> */}
                    </div>

                    <button className="btn btn-outline-light btn-lg px-5" type="submit">Update</button>

                    <div className="d-flex justify-content-center text-center mt-4 pt-1">
                        <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                        <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                        <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                    </div>

                    </div>

                    <div>
                    {/* <p className="mb-0">if you have an account? <a href="#!" className="text-white-50 fw-bold">Login</a>
                    </p> */}
                    </div>

                </div>
                </div>
            </div>
            </div>
        </form>
        </section>
      </>
    )
}

export default Update;