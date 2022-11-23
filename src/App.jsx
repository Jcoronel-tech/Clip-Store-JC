
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home'
import Login from './components/Login'
import Favoritos from './components/Favoritos';
import NotFound from "./components/NotFound";

import {firebaseApp} from './credenciales'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const auth = getAuth(firebaseApp)

function App() {

  const [usuario, setUsuario] = useState(null)

  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if(usuarioFirebase){
      setUsuario(usuarioFirebase)
    } 
    else{
      setUsuario(null)
    }
  })

  return (
    <div className="container">
    <BrowserRouter>
        <Routes>
          <Route path="/" element={usuario ? <Home correoUsuario ={usuario.email} /> : <Login/>}/>
          <Route path='/Favoritos' component={<Favoritos/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes> 
    </BrowserRouter>
    </div>
  );
}

export default App;
