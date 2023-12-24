// import logo from './logo.svg';
import './App.css';
import Create from './components/create';
import Navbar from './components/navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Read from './components/read';
import Update from './components/update';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route exact path="/create" element={<Create/>}></Route>;
      <Route path="/" element={<Read/>}></Route>;
      <Route path="/update/:id" element={<Update/>}></Route>;
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
