import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Heart from "../components/Heart";
import perfil from '../images/perfil.gif'
import firebaseApp from '../credenciales'
import {getAuth, signOut} from 'firebase/auth'
import {getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc} from 'firebase/firestore'


const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)


const Home = ({correoUsuario}) => {

    const valorInicial = {
        titulo:'',
        descripcion: '',
        imagen:'',
    }

    //Variables par los estados
    const [user, setUser] = useState(valorInicial)
    const [lista, setLista] = useState([])
    const [subId, setSubId] = useState('')
    const [photos, setPhotos ] = useState([]);
 
    const capturarInputs = (e)=>{
        const {name, value} = e.target
        setUser({...user, [name]: value})
    }

    const addLike = (id) => {
      const index = photos.findIndex((e) => e.id === id);
      photos[index].liked = !photos[index].liked
      setPhotos([...photos]);
      }

    // funcion para guardar o actualizar 
    
    const guardarInfo = async(e)=>{
        e.preventDefault()
        // console.log(user);
        // si es vacio entonces guardamos
        if(subId === ''){
            try {
                await addDoc(collection(db,'user'),{
                    ...user
                })
            } catch (error) {
                console.log(error);
            }
        }
        else{
            await setDoc(doc(db, 'user', subId),{
                ...user
            })
        }
        setUser({...valorInicial})
        setSubId('')
    }

    // funcion para renderizar la lista de usuarios
    useEffect(()=>{
        const getLista = async()=>{
            try {
                const querySnapshot = await getDocs(collection(db,'user'))
                const docs = []
                querySnapshot.forEach((doc)=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                setLista(docs)
            } catch (error) {
                console.log(error);
            }
        }
        getLista();
    },[lista])

    // funcion para eliminar documentos
    const deleteUsuario = async(id)=>{
        await deleteDoc(doc(db, "user", id))
    }

    // las funciones para pedir un solo documento y luego almacenar

    const getOne = async(id) =>{
        try {
            const docRef = doc(db, 'user', id)
            const docSnap = await getDoc(docRef)
            setUser(docSnap.data())
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(subId !== ''){
            getOne(subId)
        }
    },[subId])

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
              <h2 >Mi Perfil</h2>
              <h4>
                <img src={perfil} alt="" width="50" height="50"/>
                <strong>{correoUsuario}</strong>{" "}
              </h4>
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
                    name="titulo"
                    className="form-control"
                    placeholder="Agregr Titulo"
                    onChange={capturarInputs}
                    value={user.titulo}
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
                    onChange={capturarInputs}
                    value={user.descripcion}
                  />
                </div>

                {/* tercer campo */}
                <div className="form-group">
                  <input
                    type="file"
                    id="formFile"
                    name="imagen"
                    className="form-control mt-2 mb-3 form-control"
                    placeholder="Selecionar Imagen"
                    onChange={capturarInputs}
                    value={user.imagen}
                  />
                </div>
                <button className='btn btn-secondary'>
                    {subId === '' ? 'Guardar' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
          <div className="col-12 col-lg-6">
              <h2 className='text-center mt-5 mb-3'>Publicaciones</h2>
              <select className="form-select m-2 w-100 w-md-25" aria-label="Default select example">
                <option value={-1}>Ordena por:</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
            </select>
              <div className='row'>
                {
                lista.map(list => (
                  <div key={list.id} className="card m-3 p-4 col-12 col-lg-5">
                    {/* cuerpo de la app  */}
                    
                    <p onClick={()=>addLike(list.id)}>{list.imagen}
                    <Heart filled={list.liked}/>
                    </p>
                    <div className='card-body'>
                      <h5 className='card-title'>{list.titulo}</h5>
                      <p className='card-text'>{list.descripcion}</p>
                      <div>
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
