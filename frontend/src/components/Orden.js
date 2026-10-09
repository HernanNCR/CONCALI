import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orden.module.css";
import {
  FaArrowLeftLong,
  FaFileCircleCheck,
  FaCheck,
  FaTrash,
} from "react-icons/fa6";
import { BACKEND_URL } from "../config";

function Orden({ cambiarPagina }) {


  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/ordenes`)
      .then((response) => {
        console.log("Data recibida del backend");
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response);
      });
  }, []);

  
  

  


  const [fechas, setFechas] = useState({});
  const [editadas, setEditadas] = useState({}); 

  // Cuando cambia el input
  const manejarCambioFecha = (numSolicitud, nuevaFecha) => {
    setFechas((prev) => ({ ...prev, [numSolicitud]: nuevaFecha }));
    setEditadas((prev) => ({ ...prev, [numSolicitud]: true }));
  };

  // Guardar cambios
  const [mensaje, setMensaje] = useState("");
  
  const guardarCambios = async (numSolicitud) => {
    const fecha = fechas[numSolicitud];
    console.log("Fecha Orden:", fecha);
    console.log("Num Solicitud:", numSolicitud);

    
    try {
        const response = await fetch(`${BACKEND_URL}/api/actualizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fechaOrden: fecha,
                solicitud : numSolicitud,
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
        setMensaje("Error en la conexión con el servidor");
        console.error("Error de conexión:", error);  
    }
  };

  const borrarSolicitud = async (numSolicitud) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/borrarSolicitud`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                solicitud : numSolicitud,
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
        setMensaje("Error en la conexión con el servidor");
        console.error("Error de conexión:", error);  
    }
  }

  return (
    <div>
      <div className={styles.bodyNav}>
        <article onClick={() => cambiarPagina("menu")} className={styles.back}>
          <FaArrowLeftLong size={20} />
        </article>
        <article className={styles.title}>
          <p>ORDEN DE TRABAJO</p>
        </article>
      </div>
      <div className={styles.contentOrden}>
      {data.length > 0 ? (
        data.map((item) => (
          <article id={item.numSolicitud} key={item.numSolicitud}>
            <div className={styles.img}>
              <FaFileCircleCheck size={30} />
            </div>
            <div className={styles.num}>
              <p className={styles.numS}>{item.numSolicitud}</p>
              <p className={styles.autorizacion}>NO AUTORIZADO</p>
            </div>
            <div className={styles.date}>
              <input
                type="date"
                value={fechas[item.numSolicitud] || ""}
                onChange={(e) => manejarCambioFecha(item.numSolicitud, e.target.value)}
              />
            </div>
            <div className={styles.acciones}>
              {editadas[item.numSolicitud] && (
                <button
                  className={styles.check}
                  onClick={() => guardarCambios(item.numSolicitud)}
                >
                  <FaCheck size={20} />
                </button>
              )}
              <button className={styles.drop} onClick={() => borrarSolicitud(item.numSolicitud)}>
                <FaTrash size={20} />
              </button>
            </div>
          </article>
        ))
      ) : (
        <p>No hay Solicitudes por revisar</p>
      )}        
      </div>
    </div>
  );
}

export default Orden;
