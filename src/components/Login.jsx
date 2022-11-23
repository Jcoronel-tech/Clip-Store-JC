import React, { useState } from 'react'
import Uno from '../images/baner1.jpg'
import Dos from '../images/baner2.jpg'
import Tres from '../images/baner3.jpg'
import '../App.css';

import {firebaseApp} from "../credenciales"

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
const auth = getAuth(firebaseApp)

const Login = () => {
    const [registrando, setRegistrando] = useState(false)

    const handlerSubmit = async(e)=>{
        e.preventDefault();
        const correo = e.target.email.value;
        const contraseña = e.target.password.value;

        if(registrando){
            await createUserWithEmailAndPassword(auth, correo, contraseña)
        }
        else{
            await signInWithEmailAndPassword(auth, correo, contraseña)
        }
    }

    return (
      <div className="row container">
          <div className='hero text-center m-2 p-2'  >
              <h1 className='color-text'>ClipStore</h1>
              <h4>¡Tu mejor lugar para ser un Gamer!</h4>
          </div>
          <div className="col-12 col-md-6 m-2 mt-4">
            <div
              id="carouselExampleFade"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={Uno} alt="" className='tamaño-imagen' />
                </div>
                <div className="carousel-item">
                  <img src={Dos} alt="" className='tamaño-imagen'/>
                </div>

                <div className="carousel-item">
                  <img src={Tres} alt="" className='tamaño-imagen' />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          {/* esta es el div del formulario */}
          <div className="col-12 col-md-5 m-2">
            <div>
              <h1 className='text-center'>{registrando ? "Registrate" : "Inicia sesión"}</h1>
              <form className="" onSubmit={handlerSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo Electronico</label>
                  <input
                    type="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Ingresar Correo"
                    id="email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ingresar Contraseña"
                    id="password"
                  />
                </div>
                <button type="submit" className="btn btn-warning form-control mt-2">
                  {registrando ? "Registrate" : "Inicia sesión"}
                </button>
                <button
                  className="btn btn-secondary form-control mt-2"
                  onClick={() => setRegistrando(!registrando)}
                >
                  {registrando
                    ? "Ya tienes cuenta? Inicia sesion"
                    : "no tienes cuenta? Registrate"}
                </button>
              </form>

              
            </div>
          </div>
      </div>
    );
}

export default Login
