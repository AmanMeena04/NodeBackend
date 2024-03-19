import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
axios.defaults.withCredentials = true;
function Read() {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  // const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("token")) || "");

  const fetchData = async() => {
    const baseURL = "http://localhost:7000/users/read";
    axios.get(baseURL, {withCredentials:true})
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
}

  const deletefun = (id)=>{
    axios.delete('http://localhost:7000/users/delete/'+id).then((res)=>{
      alert(res.data.message);
      fetchData();
      navigate('/');
    }).catch(err =>console.log(err));
  };

  useEffect(()=> {
    fetchData();
  },[]);

  return (
    <div className='ReadClass'>
      <h2 style={{'text-align': '-webkit-center'}}>Users Data</h2>
      <table clasName="table">
  <thead clasName="thead-dark">
    <tr>
        <th>ID</th>
        <th>Email</th>
        <th>Username</th>
        <th>Image</th>
        <th>Edit</th>
        <th>Delete</th>
    </tr>
  </thead>
  <tbody>
  {userData.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td><img src={`http://localhost:7000/${user.image}`} clasNameName="image" style={{"width": "25px;"}} alt="logo" /></td>
              <td><Link to={`/update/${user.id}`}><button type='button' clasName="btn btn-primary">Edit</button></Link></td>
              <td><button onClick={()=> deletefun(user.id)} type="button" clasName="btn btn-danger">Delete</button></td>
            </tr>
          ))}
  </tbody>
</table>
</div>
  );
}

export default Read;
