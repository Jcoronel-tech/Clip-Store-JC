import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Heart from "../components/Heart";
import perfil from '../images/perfil.gif'
import {firebaseApp} from '../credenciales'
import {getAuth, signOut} from 'firebase/auth'
import {getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc} from 'firebase/firestore'
import { async } from '@firebase/util';


const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)


const Home = ({correoUsuario}) => {
/* 
    const valorInicial = {
        titulo:'',
        descripcion: '',
        imagen:'',
    } */


    const [subId, setSubId] = useState()
    const [photos, setPhotos ] = useState([]);
    const [archivoUrl, setArchivoUrl] = React.useState("");
    const [docus,setDocus] = React.useState([]);
    const [filterDatos, setfilterDatos] = useState("");


    const addLike = (id) => {
      const index = photos.findIndex((e) => e.id === id);
      photos[index].liked = !photos[index].liked
      setPhotos([...photos]);
      }
    const archivoHandler = async (e)=> {

      const archivo = e.target.files[0];
      const storageRef = firebaseApp.storage().ref();
      const archivoPath = storageRef.child(archivo.name);
      await archivoPath.put(archivo);
      console.log("archivo cargado:",archivo.name);
      const enlaceUrl = await archivoPath.getDownloadURL();
      setArchivoUrl(enlaceUrl);
  
    }
    // funcion para guardar o actualizar 
    
    const guardarInfo = async(e)=>{
        e.preventDefault()
        const nombreArchivo = e.target.nombre.value;
        const descripcion = e.target.descripcion.value;

        const coleccionRef =  firebaseApp.firestore().collection("archivos");
        await coleccionRef.doc(nombreArchivo).set({nombre: nombreArchivo, descripcion: descripcion, url: archivoUrl});
        console.log("archivo cargado:", nombreArchivo, descripcion, "ulr:", archivoUrl);              


    }
    //Metodo de filtrado
    let orderFilter = (e)=>{
      let listUpdate
      if ((e.target.value === "")){
        setDocus(docus);
      }
      else if ((e.target.value) === "az"){
          listUpdate=[...docus].sort((a,b)=>a.nombre > b.nombre ? 1 : -1,);
          setDocus(listUpdate);
      }
      else if ((e.target.value) === "za"){
          listUpdate=[...docus].sort((a,b)=>a.nombre > b.nombre ? -1 : 1,);
          setDocus(listUpdate);
      }
  }

  const deleteUsuario = async (id) => {
    const colRef = collection(db, "archivos");
    await deleteDoc(doc(colRef, id));
  };
    // funcion para renderizar la lista de usuarios
    useEffect( async()=>{
      const docusList = await firebaseApp.firestore().collection("archivos").get();
      setDocus(docusList.docs.map((doc)=> doc.data()));
    },[])


    return (
      <div className="container ">
        <div className='row'>
          <div className='col-12'>
            <nav className="navbar navbar-expand-lg navbar-light color-text d-flex justify-content-between align-items-cente my-4">
              <h1>ClipStore</h1>
              <div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav"> 
                    <li className="nav-link active" aria-current="page">
                    <Link to="/"> 
                    <h4>Home</h4> 
                    </Link>
                    </li>
                    <li className="nav-link active" aria-current="page">
                    <Link to="/src/components/Favoritos.jsx">
                      <h4>Mis Favoritos</h4>
                    </Link>
                    </li>
                    <li className="nav-link active" aria-current="page">
                    <Link to="/">
                        <h4 onClick={() => signOut(auth)}>Cerrar Sesion</h4>
                    </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
        {/* cuerpo de la app  */}
        <div className='row'>
            <div className="col-12 text-center">
            <img src={perfil} alt="" width="50" height="50"/>
              <h2 >Bienvenido <strong>{correoUsuario}</strong></h2>
              <h4>Crea y gestiona tus compras de forma facil, rapida y segura.</h4>

              <div>
              </div>
            </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6 text-center">

            {/* aqui donde creamos el formulario */}
            <h2 className='mt-5 mb-3 text-center'>Crear Publicación</h2>
            <form onSubmit={guardarInfo}>
              <div className="card card-body">
                <div className="form-group">
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Agregr Titulo"
                  />
                </div>

                {/* segunda caja */}
                <div className="form-group">
                  <textarea 
                    type="form-control"
                    id="exampleFormControlTextarea1"
                    name="descripcion"
                    className="form-control my-2"
                    placeholder="Agregar Descripción"
                  />
                </div>

                {/* tercer campo */}
                <div className="form-group">
                  <input
                    type="file"
                    id="formFile"
                    name="url"
                    className="form-control mt-2 mb-3 form-control"
                    placeholder="Selecionar Imagen"
                    onChange={archivoHandler}
                  />
                </div>
                <button className='btn btn-secondary'>
                    {subId === '' ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
          <div className="col-12 col-lg-6">
              <h2 className='text-center mt-5 mb-3'>Publicaciones</h2>
              <select className="form-select m-2 w-100 w-md-25" aria-label="Default select example" onChange={orderFilter}>
                <option value={-1}>Ordena por:</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
            </select>
              <div className='row'>
                  {
                    docus.filter((dato)=> {
                      if(!filterDatos){
                      return dato;
                      }
                      else if ((dato.nombre).toLocaleLowerCase())
                      {
                      return dato;
                      }
                      else{
                          console.log("sinFiltro");
                      }
                      }).map(list => (
                  <div key={list.id} className="card m-3 col-12 col-lg-5">
                    {/* cuerpo de la app  */}
                    
                    <img src={list.url} alt="img" />
                    <div className='card-body'>
                      <h5 className='card-title'>{list.nombre}</h5>
                      <p className='card-text'>{list.descripcion}</p>
                      <div className='d-flex flex-column'>
                        <button className='btn btn-danger' onClick={()=>deleteUsuario(list.id)}>
                          Eliminar
                        </button> 
                      </div>
                    </div>
                  </div>
                  ))
                }
              </div>
          </div>
        </div>
      </div>
    );
}

export default Home
