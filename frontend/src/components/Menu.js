import React, { useEffect, useState } from 'react'
import styles from './Menu.module.css'
import { FaFileLines, FaFileCircleCheck, FaTags, FaVialCircleCheck, FaBook, FaFileInvoice, FaBookmark, FaFolder, FaRegCircleUser } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import axios from 'axios';
import { BACKEND_URL } from "../config.js";

function Menu({ cambiarPagina }) {

  const [usuarios, setUsuarios] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const users = await axios.get(`${BACKEND_URL}/api/usuariosActivos`); 
            setUsuarios(users.data);

          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        };
      
        fetchData();
    }, []);

  useEffect(() => {
  const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setusuarioSeleccionado(usuarioGuardado);
      setSaludo(true);
      setpaginaPrincipal(false); 
    }
  }, []);

  useEffect(() => {
  const tipoGuardado = localStorage.getItem("tipoUsuario");
    if (tipoGuardado) {
      setTipoUsuario(parseInt(tipoGuardado)); // Convierte de string a número
    }
  }, []);



  const [paginaPrincipal,setpaginaPrincipal] = useState(true);

  const [usuarioSeleccionado,setusuarioSeleccionado] = useState();
  const [saludo, setSaludo] = useState(false);
  const seleccionUsuario = (e) => {
    const user = e.target.value;
    setusuarioSeleccionado(user);
    if (user) {
      setSaludo(true);
    } else {
      setSaludo(false);
    }
};


  const [password,setPassword] = useState('');
  const guardarPassword = (e) =>{
    const password = e.target.value;
    setPassword(password);
  }

  const [errorLogin, setErrorLogin] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const inicioSesion = async () => {
    if (usuarioSeleccionado) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/buscarUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuarioSeleccionado, password }),
        });

        if (response.ok) {
            const usuario = await response.json(); 
            setTipoUsuario(usuario.tipoUsuario); 
            localStorage.setItem("usuario", usuarioSeleccionado);
            localStorage.setItem("tipoUsuario", usuario.tipoUsuario);
            setpaginaPrincipal(false);
            setErrorLogin(false);
          } else {
            setPassword("");
            setErrorLogin(true);
          }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    } else {
      alert("Selecciona un usuario antes de continuar");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipoUsuario");
    setusuarioSeleccionado(null);
    setPassword("");
    setSaludo(false);
    setpaginaPrincipal(true);
    setErrorLogin(false);

    localStorage.clear();


  };


  
  

  if(paginaPrincipal){
    return(
      <div>
        <div className={styles.marcoPrincipal}>
            <div className={saludo === true ? styles.contentUserActive : styles.contentUser}>
                <article className={styles.articleIcon}>
                  <FaRegCircleUser size={150} style={{color:"#262847"}} />
                   <p style={{opacity: saludo ? "1" : "0"}}>Hola! {usuarioSeleccionado} </p>
                </article>
                <article>
                  <select className={saludo === true ? styles.selectDesactive : styles.select} onChange={seleccionUsuario}>
                    <option value="">-- Selecciona un usuario --</option>                    
                    {usuarios.length > 0 ? (
                      usuarios.map((item, index) => (   
                          <option value={item.clvUsuario}>{item.clvUsuario}</option>
                      ))
                      ) : (
                      <option>Informacion no disponible</option>
                      )}
                  </select>
                </article>
                <article >
                  <input type='password' className={styles.password} value={password} required onChange={guardarPassword} />
                  
                </article>
                {errorLogin && (
                    <article>
                      <p style={{ color: "red", marginTop: "5px" }}>
                        Usuario o contraseña incorrectos
                      </p>
                    </article>
                )}
                <article>
                  {/* <p onClick={verTipo} >Ver tipo</p> */}
                  <input type='submit' value={"Iniciar Sesion"} className={styles.btnSesion} onClick={inicioSesion} />
                </article>
            </div>
        </div>
      </div>
    );
  }

  if(tipoUsuario === 1){
    return (
      <div>
        <section className={styles.Menu}>
          <div onClick={() => cambiarPagina("solicitud")}> <article><FaFileLines size={60} color='#262847'/></article>   <p>SOLICITUD</p> </div>
          <div onClick={() => cambiarPagina("orden")}> <article><FaFileCircleCheck size={60} color='#262847'/></article> <p>ORDEN</p></div>
          <div onClick={() => cambiarPagina("etiquetas")}> <article><FaTags size={60} color='#262847'/></article> <p>ETIQUETAS</p></div>
          <div onClick={() => cambiarPagina("check")}> <article><FaVialCircleCheck size={60} color='#262847'/></article> <p>CHECKLIST</p></div>
          <div onClick={() => cambiarPagina("externa")}> <article><FaFileInvoice size={60} color='#262847'/></article> <p>C EXTERNA</p></div>
          <div onClick={() => cambiarPagina("campo")}> <article><FaBook size={60} color='#262847'/></article> <p>H CAMPO</p></div>
          <div onClick={() => cambiarPagina("registros")}> <article><FaBookmark size={60} color='#262847'/></article> <p>REGISTROS</p></div>
          <div onClick={() => cambiarPagina("archivos")}> <article><FaFolder size={60} color='#262847'/></article> <p>ARCHIVOS</p></div>
          
        </section>

        <article className={styles.btnCerrarSesion}>
          <div className={styles.icon} onClick={(cerrarSesion)}><ImExit size={20} color='#262847'/></div>
        </article>
      </div>

      

      
    );
  }else{
    return (
        <div>
          <section className={styles.Menu}>
            <div onClick={() => cambiarPagina("solicitud")}> <article><FaFileLines size={60} color='#262847'/></article>   <p>SOLICITUD</p> </div>
            {/* <div onClick={() => cambiarPagina("orden")}> <article><FaFileCircleCheck size={60} color='#262847'/></article> <p>ORDEN</p></div> */}
            <div onClick={() => cambiarPagina("etiquetas")}> <article><FaTags size={60} color='#262847'/></article> <p>ETIQUETAS</p></div>
            <div onClick={() => cambiarPagina("check")}> <article><FaVialCircleCheck size={60} color='#262847'/></article> <p>CHECKLIST</p></div>
            <div onClick={() => cambiarPagina("externa")}> <article><FaFileInvoice size={60} color='#262847'/></article> <p>C EXTERNA</p></div>
            <div onClick={() => cambiarPagina("campo")}> <article><FaBook size={60} color='#262847'/></article> <p>H CAMPO</p></div>
            <div onClick={() => cambiarPagina("registros")}> <article><FaBookmark size={60} color='#262847'/></article> <p>REGISTROS</p></div>
            <div onClick={() => cambiarPagina("archivos")}> <article><FaFolder size={60} color='#262847'/></article> <p>ARCHIVOS</p></div>
            
          </section>

          <article className={styles.btnCerrarSesion}>
            <div className={styles.icon} onClick={(cerrarSesion)}><ImExit size={20} color='#262847'/></div>
          </article>
        </div>

        

        
      );
  
  }
  }
  

export default Menu;
