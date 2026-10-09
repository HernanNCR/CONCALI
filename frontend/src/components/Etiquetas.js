import React, { useState, useEffect } from 'react';
import styles from './Etiquetas.module.css';
import { FaArrowLeftLong, FaTags } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { BACKEND_URL } from "../config";

function Etiquetas({ cambiarPagina }) {
  const [Data, setData] = useState({});
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaActual, setEtiquetaActual] = useState(0);
  const [solicitud,setSolicitud] = useState({});

  // trae solicitudes
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/solicitudeStatus2`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response);
      });
  }, []);

  const [usuarios,setUsuarios] = useState({});
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/usuariosActivos`)
    .then((response) =>{
      setUsuarios(response.data);
    })
    .catch((error) =>{
      console.log("Error: ", error.response);
    })
  })

  const handleSelectChange = (e) => {
    const valor = e.target.value;
    buscarEtiquetas(valor);
    setSolicitud(valor);
  };

  // busca etiquetas
  async function buscarEtiquetas(numSolicitud) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/etiquetas?numeroSolicitud=${encodeURIComponent(numSolicitud)}`);
      if (response.ok) {
        const data = await response.json();
        setEtiquetas(data.result);
        setEtiquetaActual(0);
      } else {
        console.error("Error al obtener etiquetas");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  }

// -------------------------------------

  const [cantidades, setCantidades] = useState({});
  const [mensaje,setMensaje] = useState({});
  const [fecha, setFecha] = useState('');
  const [muestrador, setMuestrador] = useState('');


  const handleEnviar = async (e) => {
    e.preventDefault();
    const MuestrasArray = etiquetas.map((etiqueta) => ({
      idMuestra: etiqueta.idMuestra,
      idparametros: etiqueta.idparametros,
      fecha,
      muestrador,
    }));

    console.log(MuestrasArray);

    try {
        const response = await fetch(`${BACKEND_URL}/api/insertarMateriales`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                numSolicitud: solicitud,
                Muestras: MuestrasArray,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);  
            setMensaje(data.message); 
            cambiarPagina("menu");
        } else {
            setMensaje("Error al insertar los datos");
        }
      } catch (error) {
          console.error("Error de conexión:", error); 
      }

  };

  // -----------sumar--------------------
  const total = etiquetas.length;
  

  const SumarNumero = () => {
    setEtiquetaActual((prev) => (prev + 1 < total ? prev + 1 : prev));
  };

  const RestarNumero = () => {
    setEtiquetaActual((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };





  return (
    <div>
      <div className={styles.bodyNav}>
        <article className={styles.title}>
          <p>ETIQUETAS</p>
        </article>
        <article>
          <select name='numeroSolicitudes' onChange={handleSelectChange}>
            <option value={0}></option>
            {Data.length > 0 ? (
              Data.map((item, index) => (
                <option key={item.numSolicitud} value={item.numSolicitud}>{item.numSolicitud}</option>
              ))
            ) : (
              <option>Informacion no disponible</option>
            )}
          </select>
        </article>
        <article onClick={() => cambiarPagina("menu")} className={styles.back}>
          <FaArrowLeftLong size={20} />
        </article>
      </div>
      {etiquetas.length > 0 && (
        <>
          <article className={styles.contador}>
            <p>{etiquetaActual + 1} de {etiquetas.length}</p>
          </article>

          <div className={styles.etiquetas}>
            <article onClick={RestarNumero} style={{ cursor: etiquetaActual === 0 ? "not-allowed" : "pointer" }}>
              <IoIosArrowBack size={50} />
            </article>

            <section className={styles.contenedorEtiquetas}>
              <div className={styles.titlEtiqueta}>
                <article> <FaTags size={40} /> </article>
                <p>PROYECTO: <b>{etiquetas[etiquetaActual].nombre}</b></p>
                <p>ESTACION: <b>{etiquetas[etiquetaActual].nombre}</b> </p>
              </div>

              <div className={styles.infoEtiqueta}>
                <p>SOLICITUD: <b>{etiquetas.numSolicitud}</b> </p>
              </div>

              <div className={styles.infoEtiqueta}>
                <p>RECOLECCIÓN</p>
                <input
                  className={styles.text_recoleccion} 
                  name="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />

                <p>RECOLECTOR</p>
                <select name='muestrador' onChange={(e) => setMuestrador(e.target.value)} value={muestrador}>
                  <option value={0}></option>
                  {usuarios.length > 0 ? (
                    usuarios.map((item) => (
                      <option key={item.clvUsuario} value={item.clvUsuario}>{item.clvUsuario}</option>
                    ))
                  ) : (
                    <option>Informacion no disponible</option>
                  )}
                </select>
                
              </div>


              <div className={styles.paramEtiqueta}>
                <p>PARAMETROS: <b>{etiquetas[etiquetaActual].nombres.join(", ")}</b> </p>
              </div>

              <div className={styles.infoParam}>
                <p>CONSERVADOR: <b>{etiquetas[etiquetaActual].conservador}</b> </p>
                <p>CONTENEDOR: <b>{etiquetas[etiquetaActual].recipientes}</b> </p>
              </div>
            </section>

            <article onClick={SumarNumero} style={{ cursor: etiquetaActual === total - 1 ? "not-allowed" : "pointer" }}>
              <IoIosArrowForward size={50} />
            </article>
          </div>
        </>
      )}

      <input className={styles.botonEti} type="submit" value={"GUARDAR"} onClick={handleEnviar} />
    </div>
  );
}

export default Etiquetas;
