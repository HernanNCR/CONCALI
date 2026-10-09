import React, { useEffect, useState } from "react";
import styles from "./Solicitud.module.css";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { BACKEND_URL } from "../config.js";


function SolicitudT({ cambiarPagina }) {
  const [data, setData] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [informacionGeneral, setInformacionGeneral] = useState({
    numeroSolicitud: "",
    nombreProyecto: "",
    puntosMuestreo: "",
    fechaSolicitud: "",
    semanaInicio: "",
    ejecucionMuestreo: false,
  });
  const [parametros, setParametros] = useState([]); // Estado para almacenar los parámetros
  const [View, setView] = useState(true);
  

  // Traer parámetros del backend
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/extraerParametrosActivos`)
      .then((response) => {
        console.log("Data recibida del backend");
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response);
      });
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInformacionGeneral((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleEnviar = (e) => {
    e.preventDefault();


    const parametrosArray = Object.entries(cantidades).map(([id, { cantidad, nombreParametro }]) => ({
      idParametro: Number(id),
      cantidad: Number(cantidad),
      nombreParametro: nombreParametro, 
    }));
    setParametros(parametrosArray);


    const datosFinales = { 
      ...informacionGeneral,
      parametros: parametrosArray, // Aquí van los parámetros
    };

    console.log("Datos finales:", datosFinales);
    setView(false);
  };




  const [puntosMuestreo, setPuntosMuestreo] = useState([]);


  const handleChangeNombre = (e, index) => {
    const updated = [...puntosMuestreo];
    if (!updated[index]) {
      updated[index] = { nombre: "", parametros: parametros.map(p => ({ ...p, cantidad: 0 })) };
    }
    updated[index].nombre = e.target.value;
    setPuntosMuestreo(updated);
  };

  const handleChangeParametro = (e, puntoIndex, paramIndex) => {
    const updated = [...puntosMuestreo];
    if (!updated[puntoIndex]) {
      updated[puntoIndex] = {
        nombre: "",
        parametros: parametros.map(p => ({ ...p, cantidad: 0 }))
      };
    }
  
    updated[puntoIndex].parametros[paramIndex].cantidad = Number(e.target.value);
    setPuntosMuestreo(updated);

    
  };

  const [mensaje, setMensaje] = useState("");
  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(puntosMuestreo); 
      try {
          const response = await fetch(`${BACKEND_URL}/api/insertar`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  informacionGNL: informacionGeneral,
                  puntosMuestreo: puntosMuestreo,
              }),
          });

          if (response.ok) {
              const data = await response.json();
              console.log(data);  // Verifica que el backend esté respondiendo correctamente
              setMensaje(data.message);  // Muestra el mensaje de éxito
              cambiarPagina("menu");
          } else {
              setMensaje("Error al insertar los datos");
          }
      } catch (error) {
          setMensaje("Error en la conexión con el servidor");
          console.error("Error de conexión:", error);  // Para depuración
      }
  };



  const [errorSolicitud, setErrorSolicitud] = useState(false);
  useEffect(() => {
    const largo = informacionGeneral.numeroSolicitud.length;
    setErrorSolicitud(largo > 15);
  }, [informacionGeneral.numeroSolicitud]);

  const [errorNombre, setErrorNombre] = useState(false);
  useEffect(() => {
    const largo = informacionGeneral.nombreProyecto.length;
    setErrorNombre(largo > 60);
  }, [informacionGeneral.nombreProyecto]);





 
  if (!View) {
    return (
      <div className={styles.contenedorPuntosM}>
        <center>
          <p>Puntos de Muestro para {informacionGeneral.numeroSolicitud}</p>
        </center>
        {parseInt(informacionGeneral.puntosMuestreo) > 0 && (
          <>
            {[...Array(parseInt(informacionGeneral.puntosMuestreo))].map(
              (_, index) => (
                <div key={index} className={styles.PuntosM}>
                  <article className={styles.titlePM}>
                    <p>Nombre Punto de Muestreo {index + 1}</p>
                    <input
                      className={styles.inputPM}
                      type="text"
                      placeholder="Nombre Punto Muestreo"
                      onChange={(e) => handleChangeNombre(e, index)}
                    />

                  </article>
                  <table className={styles.tableParametros}>
                    <thead>
                      <tr>
                        <th>Nombre Parametro</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                    {parametros.map((item, paramIndex) => (
                      <tr key={paramIndex}>
                        <td>{item.nombreParametro}</td>
                        <td>
                          <input
                            className={styles.numParam}
                            type="number"
                            min={0}
                            placeholder={item.cantidad}
                            onChange={(e) => handleChangeParametro(e, index, paramIndex)}
                            
                          />
                          
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
        <input onClick={handleSubmit}  className={styles.btnPM} type="submit" value={"GUARDAR DATOS"} />
      </div>
    );
  }
  return (
    <div>
      {/* Navbar */}
      <div className={styles.bodyNav}>
        <article onClick={() => cambiarPagina("menu")} className={styles.back}>
          <FaArrowLeftLong size={20} />
        </article>
        
        <article className={styles.title}>
          <p>SOLICITUD DE TRABAJO</p>
        </article>
      </div>
      <div className={styles.solicitud}>
        <section>
          <div className={styles.form}>
            <article className={styles.p}>
              <p>Informacion General</p>
            </article>

            <div className={styles.numsolicitud}>
              <label>Numero de Solicitud</label>
              <input
                className={errorSolicitud ? styles.errorBorder : styles.text}
                type="text"
                placeholder="Numero de Solicitud"
                name="numeroSolicitud"
                value={informacionGeneral.numeroSolicitud}
                onChange={handleInputChange}
              />

            </div>
            <div className={styles.Tipoproyecto}>
              <label>Tipo de Proyecto</label>
              <select className={styles.date} name="tipoProyecto" onChange={handleInputChange}>
                <option value={0}></option>
                <option value={1}>RENAMECA</option>
                <option value={2}>ATENCION A USUARIOS</option>
                <option value={3}>E.H.</option>
                <option value={4}>Otros</option>
              </select>
            </div>
            <div className={styles.proyecto}>
              <label>Nombre de Sitio de Recolección</label>
              <input
                className={errorNombre ? styles.errorBorder : styles.text}
                type="text"
                placeholder="Nombre de Sitio"
                name="nombreProyecto"
                value={informacionGeneral.nombreProyecto}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.muestro}>
              <label>Puntos de Muestreo</label>
              <input
                className={styles.number}
                type="number"
                placeholder="Numero"
                name="puntosMuestreo"
                value={informacionGeneral.puntosMuestreo}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.fecha}>
              <label>Fecha de solicitud</label>
              <input
              className={styles.date}
                type="date"
                name="fechaSolicitud"
                value={informacionGeneral.fechaSolicitud}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.semana}>
              <label>Semana Inicio</label>
              <input
                type="date"
                name="semanaInicio"
                value={informacionGeneral.semanaInicio}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.ejecucion}>
              <label>¿Ejecución de muestreo en lab?</label>
              <br />
              <input
              className={styles.checkbox}
                type="checkbox"
                name="ejecucionMuestreo"
                checked={informacionGeneral.ejecucionMuestreo}
                onChange={handleInputChange}
              />
            </div>

            <input className={styles.boton} onClick={handleEnviar} type="submit" value={"SOLICITAR"}/>
          </div>
        </section>
        <section className={styles.parammetrosList}>

        {data.length > 0 ? (
          data.map((item, index) => (
            <article key={item.idParametro} className={styles.parametro}>
              <input
                className={styles.nameParam}
                value={item.nombreParametro}
                readOnly
              />
              <input
                className={styles.numParam}
                type="number"
                min={0}
                placeholder="0"
                onChange={(e) => {
                  const cantidad = e.target.value;
                  if (cantidad > 0) {
                    setCantidades((prev) => ({
                      ...prev,
                      [item.idParametro]: {
                        cantidad: cantidad,
                        nombreParametro: item.nombreParametro, 
                      },
                    }));
                  } else {
                    
                    setCantidades((prev) => {
                      const newCantidades = { ...prev };
                      delete newCantidades[item.idParametro]; 
                      return newCantidades;
                    });
                  }
                }}
              />
            </article>
          ))
        ) : (
          <p>Informacion no disponible</p>
        )}


          
          

        </section>
      </div>
    </div>
  );
}

export default SolicitudT;
