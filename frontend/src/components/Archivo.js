import React, { useState, useEffect } from "react";
import styles from "./Archivo.module.css";
import {
  FaArrowLeftLong,
  FaFolder,
  FaFilePdf,
  FaEye,
  FaDownload,
  FaRegFilePdf
} from "react-icons/fa6";
import { GoBlocked } from "react-icons/go";
import { IoIosArrowUp } from "react-icons/io";
import { MdOutlineFolderCopy } from "react-icons/md";
import { IoArrowUndoCircleOutline } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../config.js";


function Archivo({ cambiarPagina }) {
  const [data, setData] = useState([]); 
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/solicitudes`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response);
      });
  }, []);

  const [dataDesactivados, setDataDesactivados] = useState([]); 
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/solicitudesDesactivados`)
      .then((response) => {
        setDataDesactivados(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response);
      });
  }, []);



  const [visibilidadArchivos, setVisibilidadArchivos] = useState({});

  const toggleArchivo = (id) => {
    setVisibilidadArchivos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

 const [proyectos,setProyectos] = useState(false);
 const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
 const [listaProyecto,setListaProyecto] = useState({});

  const handleVerProyectos = (numSolicitud) => {
    const valor = numSolicitud;
    setSolicitudSeleccionada(valor);

    axios
    .get(`${BACKEND_URL}/api/proyectosPorSolicitudArchivo/${valor}`)
    .then((response) => {
      setListaProyecto(response.data); // Actualiza los proyectos
    })
    .catch((error) => {
      console.error("Error al obtener proyectos:", error);
    });


    if(proyectos){
      setProyectos(false);
    } else {
      setProyectos(true);
    }
  }

  const desactivarSolicitud = async (numSolicitud) => {
    const confirmar = window.confirm(`¿Desactivar Solicitud ${numSolicitud}?`);
    if (confirmar) {
      try { 
        const response = await fetch(`${BACKEND_URL}/api/actualizarSolicitud`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ solicitud: numSolicitud }),
        });

        if (response.ok) {
          // ✅ Mueve la solicitud del estado `data` a `dataDesactivados`
          setData((prev) => prev.filter((item) => item.numSolicitud !== numSolicitud));

          // Si quieres agregarlo a la lista de desactivados:
          const desactivado = data.find((item) => item.numSolicitud === numSolicitud);
          if (desactivado) {
            setDataDesactivados((prev) => [...prev, { ...desactivado, estado_solicitud: 2 }]);
          }
        } else {
          console.log("Error al actualizar la solicitud");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    } else {
      console.log("Cancelado");
    }
};


  const activarSolicitud = async (numSolicitud) => {
    const confirmar = window.confirm(`¿Activar Solicitud ${numSolicitud}?`);
    if (confirmar) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/activarSolicitud`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            solicitud: numSolicitud,
          }),
        });

        if (response.ok) {
          const respuesta = await response.json();
          const reactivada = dataDesactivados.find((item) => item.numSolicitud === numSolicitud);
          if (reactivada) {
            setDataDesactivados((prev) =>
              prev.filter((item) => item.numSolicitud !== numSolicitud)
            );
            setData((prev) => [...prev, { ...reactivada, estado_solicitud: 1 }]);
          }
          setDesactivados(false);
          setProyectos(false);

        } else {
          console.log("Error al activar la solicitud");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    } else {
      console.log("Cancelado");
    }
};


  const [desactivados,setDesactivados] = useState(false);
  const verSolicitudesDesactivadas = ()  => {
    setDesactivados(true);
  }

  if(desactivados){
    return(
    <div className={styles.body}>
      <div className={styles.bodyNav}>
        <article className={styles.title}>
          <p>ARCHIVOS DESACTIVADOS</p>
        </article>
        <article onClick={() => cambiarPagina("menu")} className={styles.back}>
          <FaArrowLeftLong size={20} />
        </article>
      </div>

      <div className={styles.content}>
        <div className={styles.scroll}>
          {dataDesactivados.length > 0 ? (
            dataDesactivados.map((item, index) => (
              <div className={styles.content_solicitud}>
                   <article key={item.numSolicitud} className={styles.archivo} onClick={() => handleVerProyectos(item.numSolicitud)}>
                  <FaFolder style={{ color: "#262847", fontSize: "60px" }} />
                  <article>
                    <p className={styles.solicitud}>{item.numSolicitud}</p>
                  </article>
                  <article>
                    <p
                      style={{
                        color:
                          item.estado_solicitud === 1
                            ? "green"
                            : item.estado_solicitud === 2
                            ? "red"
                            : "#7070F5",
                      }}
                      className={styles.status}
                    >
                      {item.estado_solicitud === 1
                        ? "ACTIVE"
                        : item.estado_solicitud === 2
                        ? "DESACTIVE"
                        : "FINALIZADO"}
                    </p>
                  </article>
                  
                </article>
                <article>
                    <IoArrowUndoCircleOutline size={25} style={{cursor:"pointer", margin:"10px"}} onClick={() => activarSolicitud(item.numSolicitud)} />
                </article>
              </div>
             
            ))

            
          ) : (
            <p>Informacion no disponible</p>
          )}
          
        </div>
      </div>
      
    </div>
    )
  }
  if(proyectos){
    return (
       <div className={styles.body}>
      <div className={styles.bodyNav}>
        <article className={styles.title}>
          <p>ARCHIVOS DEL {solicitudSeleccionada}</p>
        </article>
        <article onClick={handleVerProyectos} className={styles.back}>
          <FaArrowLeftLong size={20} />
        </article>
      </div>

      <div className={styles.content}>
        <div className={styles.scroll}>
          {listaProyecto.length > 0 ? (
            listaProyecto.map((item, index) => (
              <div
                key={item.idProyecto}
                className={
                  !visibilidadArchivos[item.idProyecto]
                    ? styles.contentArch
                    : styles.contentArchMostrar
                }
              >
                <article className={styles.archivos}>
                  <MdOutlineFolderCopy style={{ color: "#262847", fontSize: "60px" }} />
                  <article>
                    <p className={styles.solicitud}>{item.idProyecto}</p>
                  </article>
                  
                  <article>
                    {item.status !== "CANCELED" && (
                      <IoIosArrowUp
                        onClick={() => toggleArchivo(item.idProyecto)}
                        style={{
                          color: "#262847",
                          fontSize: "30px",
                          cursor: "pointer",
                          transform: !visibilidadArchivos[item.idProyecto]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    )}
                  </article>
                </article>

                <div className={styles.informacionArchivo}>
                  <article>
                    <FaFilePdf size={20} />
                    <p>Solicitud de Trabajo</p>

                    <button
                      style={{ backgroundColor: "#11CD8E" }}
                      onClick={() =>
                        window.open(`${BACKEND_URL}/solicitud/${item.idProyecto}`, "_blank")
                      }
                    >
                      <FaEye size={20} />
                    </button>

                    <a href="${BACKEND_URL}/descargar-pdfSoli" download>
                      <button style={{ backgroundColor: "#7070F5" }}>
                        <FaDownload size={20} />
                      </button>
                    </a>
                  </article>
                  <article>
                    <FaFilePdf size={20} />
                    <p>Orden de Trabajo</p> 

                    <button
                      onClick={() => window.open(`${BACKEND_URL}/orden/${item.idProyecto}`, "_blank")}
                      style={{ backgroundColor: "#11CD8E" }}
                    >
                      <FaEye size={20} />
                    </button>

                    
                    <a href="${BACKEND_URL}/descargar-pdfOrden" download>
                      {" "}
                      <button style={{ backgroundColor: "#7070F5" }}>
                        {" "}
                        <FaDownload size={20} />{" "}
                      </button>{" "}
                    </a>
                  </article>
                  <article>
                    
                    <FaFilePdf
                      size={20}
                    />
                    <p>Parametros de Trabajo</p>
                    
                    <button
                      style={{ backgroundColor: "#11CD8E" }}
                      onClick={() =>
                        window.open(`${BACKEND_URL}/parametros/${solicitudSeleccionada}`, "_blank")
                      }
                    >
                      <FaEye size={20} />
                    </button>
                    
                    
                    <a href={`${BACKEND_URL}/ejemplo/${item.idProyecto}`} download>
                        <button style={{ backgroundColor: "#7070F5" }}>
                            <FaDownload size={20} />
                        </button>
                    </a>


                  </article>
                  <article>
                    {" "}
                    <FaFilePdf size={20} /> <p>Orden de Parametros</p>{" "}
                    <button style={{ backgroundColor: "#11CD8E" }} 
                      onClick={() =>
                        window.open(`${BACKEND_URL}/parametrosOrden/${solicitudSeleccionada}`, "_blank")
                      }>
                      {" "}
                      <FaEye size={20} />{" "}
                    </button>{" "}
                    <button style={{ backgroundColor: "#7070F5" }}>
                      {" "}
                      <FaDownload size={20} />{" "}
                    </button>{" "}
                  </article>
                  <article>
                    {" "}
                    <FaFilePdf size={20} /> <p>Etiquetas de Trabajo</p>{" "}
                    <button style={{ backgroundColor: "#11CD8E" }}
                      onClick={() =>
                        window.open(`${BACKEND_URL}/etiquetas/${solicitudSeleccionada}`, "_blank")
                      }
                    >
                      {" "}
                      <FaEye size={20} />{" "}
                    </button>{" "}
                    <button style={{ backgroundColor: "#7070F5" }}>
                      {" "}
                      <FaDownload size={20} />{" "}
                    </button>{" "}
                  </article>
                  <article>
                    {" "}
                    <FaFilePdf size={20} /> <p>Lista de Chequeo</p>{" "}
                    <button 
                    onClick={() =>
                      window.open(`${BACKEND_URL}/checklist/${solicitudSeleccionada}`, "_blank")
                    }
                    style={{ backgroundColor: "#11CD8E" }}>
                      
                      <FaEye size={20} />{" "}
                    </button>{" "}
                    <button style={{ backgroundColor: "#7070F5" }}>
                      {" "}
                      <FaDownload size={20} />{" "}
                    </button>{" "}
                  </article>
                  <article>
                    {" "}
                    <FaFilePdf size={20} /> <p>Custodia Externa</p>{" "}
                    <button style={{ backgroundColor: "#11CD8E" }} 
                      onClick={() =>
                        window.open(`${BACKEND_URL}/custodiaExterna/${item.idProyecto}`, "_blank")
                      }
                    >
                      {" "}
                      <FaEye size={20} />{" "}
                    </button>{" "}
                    <button style={{ backgroundColor: "#7070F5" }}>
                      {" "}
                      <FaDownload size={20} />{" "}
                    </button>{" "}
                  </article>
                  <article>
                    {" "}
                    <FaFilePdf size={20} /> <p>Hoja de Campo</p>{" "}
                    <button style={{ backgroundColor: "#11CD8E" }}
                      onClick={() =>
                        window.open(`${BACKEND_URL}/hojaCampo/${item.idProyecto}`, "_blank")
                      }
                    >
                      {" "}
                      <FaEye size={20} />{" "}
                    </button>{" "}
                    <button style={{ backgroundColor: "#7070F5" }}>
                      {" "}
                      <FaDownload size={20} />{" "}
                    </button>{" "}
                  </article>
                </div>
              </div>

            ))
          ) : (
            <p>Informacion no disponible</p>
          )}
        </div>
      </div>
      </div>
    )
  } 
  
  return (
    <div className={styles.body}>
      <div className={styles.bodyNav}>
        <article className={styles.title}>
          <p>ARCHIVOS</p>
        </article>
        <article onClick={() => cambiarPagina("menu")} className={styles.back}>
          <FaArrowLeftLong size={20} />
        </article>
      </div>

      <div className={styles.content}>
        <div className={styles.scroll}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <div className={styles.content_solicitud}>
                   <article key={item.numSolicitud} className={styles.archivo} onClick={() => handleVerProyectos(item.numSolicitud)}>
                  <FaFolder style={{ color: "#262847", fontSize: "60px" }} />
                  <article>
                    <p className={styles.solicitud}>{item.numSolicitud}</p>
                  </article>
                  <article>
                    <p
                      style={{
                        color:
                          item.estado_solicitud === 1
                            ? "green"
                            : item.estado_solicitud === 2
                            ? "red"
                            : "#7070F5",
                      }}
                      className={styles.status}
                    >
                      {item.estado_solicitud === 1
                        ? "ACTIVE"
                        : item.estado_solicitud === 2
                        ? "CANCELED"
                        : "FINALIZADO"}
                    </p>
                  </article>
                  
                </article>
                <article>
                  <GoBlocked size={30} style={{cursor:"pointer", margin:"10px"}} onClick={() => desactivarSolicitud(item.numSolicitud)} />
                </article>
              </div>
             
            ))

            
          ) : (
            <p>Informacion no disponible</p>
          )}
          <center><p className={styles.solicitudesDesactivadas} onClick={verSolicitudesDesactivadas} >VER SOLICITUDES DESACTIVADAS</p></center>
        </div>
      </div>
      
    </div>
  );
}

export default Archivo;
