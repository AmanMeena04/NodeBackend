import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Read() {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();


  const fetchData = async() => {
    const baseURL = "http://localhost:7000/users/read";

    axios.get(baseURL)
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
console.log(userData);
  useEffect(()=> {
    fetchData();
  },[]);

  return (
    <div>
      <h2 style={{'text-align': '-webkit-center'}}>Users Data</h2>
      <table class="table">
  <thead class="thead-dark">
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
              <td><img src={user.image?user.image:user.pdf} className="image" alt="logo" /></td>
              <td><Link to={`/update/${user.id}`}><button type='button' class="btn btn-primary">Edit</button></Link></td>
              <td><button onClick={()=> deletefun(user.id)} type="button" class="btn btn-danger">Delete</button></td>
            </tr>
          ))}
  </tbody>
</table>

{/* <table class="table">
  <thead class="thead-light">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table> */}
    </div>
  );
}

export default Read;
