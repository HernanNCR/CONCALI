import React, {useState, useEffect} from 'react'
import styles from "./Checklist.module.css"
import { FaArrowLeftLong } from "react-icons/fa6"; 
import axios from 'axios';
import { BACKEND_URL } from "../config";


function Checklist({cambiarPagina}){
    // traer solicitudes
    const [Data2, setData2] = useState({});
    useEffect(() => {
        axios
        .get(`${BACKEND_URL}/api/solicitudeStatus3`)
        .then((response) => {
            setData2(response.data);
        })
        .catch((error) => {
            console.error("Error:", error.response);
        });
    }, []);

    
    //traer datos de almacen 
    const [Data, setData] = useState([]);

useEffect(() => {
  axios
    .get(`${BACKEND_URL}/api/almacen`)
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error("Error:", error.response);
    });
}, []);

const materialesAgrupados = Data.reduce((acc, item) => {
  if (!acc[item.tipoMaterial]) {
    acc[item.tipoMaterial] = {
      nombreTipo: item.nombreTipo,
      materiales: [],
    };
  }
  acc[item.tipoMaterial].materiales.push(item);
  return acc;
}, {});



// ----------------------------------------------------------------------
    // configurar extraccion de datos

    const [solicitud,setSolicitud] = useState({});
    const handletomarNumero = (e) =>{
        let numero = e.target.value;
        setSolicitud(numero);
    }
      
    const [cantidades, setCantidades] = useState({});
    const [mensaje,setMensaje] = useState({});
    const handleEnviar = async (e) => {
        e.preventDefault();
    
    
        const MaterialArray = Object.entries(cantidades).map(([id, { cantidad }]) => ({
            idMaterial: Number(id),
            cantidad: Number(cantidad),
        }));
        
        console.log(MaterialArray);

        try {
            const response = await fetch(`${BACKEND_URL}/api/materialesMuestreo`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    numSolicitud: solicitud,
                    idMateriales: MaterialArray,
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
    
    

  return (
    <div>
        <div className={styles.bodyNav}>
            <article onClick={() => cambiarPagina("menu")} className={styles.back}>
                <FaArrowLeftLong size={20} />
            </article>
            <article>
            <select onChange={handletomarNumero}>
                <option value={0}></option>
                {Data2.length > 0 ? (
                Data2.map((item, index) => (
                    <option key={item.numSolicitud} value={item.numSolicitud}>{item.numSolicitud}</option>
                ))
                ) : (
                <option>Informacion no disponible</option>
                )}
            </select>
            </article>
            <article className={styles.titleCheck}>
                <p>CHECKLIST</p>
            </article>
        </div>
        <section className={styles.contenedorCheck}>
            {/* {Data.length > 0 ? (
              Data.map((item, index) => (
                <div key={item.idMaterial} className={styles.producto}>
                    <article className={styles.nombreMaterial}>
                        <p>{item.tipoMaterial}</p>
                        <p>{item.nombreMaterial}</p>
                    </article>
                   
                    <article className={styles.cantidadMaterial}>
                        <input
                        type="number"
                        min='0'
                        onChange={(e) => {
                            const cantidad = e.target.value;
                            if (cantidad > 0) {
                              setCantidades((prev) => ({
                                ...prev,
                                [item.idMaterial]: {
                                  cantidad: cantidad,
                                },
                              }));
                            } else {
                              
                              setCantidades((prev) => {
                                const newCantidades = { ...prev };
                                delete newCantidades[item.idMaterial]; 
                                return newCantidades;
                              });
                            }
                          }}
                        />
                    </article>
                </div>
              ))
            ) : (
              <p>Informacion no disponible</p>
            )} */}
            {Object.entries(materialesAgrupados).map(([tipoMaterial, grupo]) => (
            <div key={tipoMaterial} className={styles.grupoMaterial}>
                <h3 className={styles.tituloGrupo}>{grupo.nombreTipo}</h3>

                {grupo.materiales.map((item) => (
                <div key={item.idMaterial} className={styles.producto}>
                    <article className={styles.nombreMaterial}>
                    <p>{item.nombreMaterial}</p>
                    </article>
                    <article className={styles.cantidadMaterial}>
                    <input
                        type="number"
                        min="0"
                        onChange={(e) => {
                        const cantidad = e.target.value;
                        if (cantidad > 0) {
                            setCantidades((prev) => ({
                            ...prev,
                            [item.idMaterial]: {
                                cantidad: cantidad,
                            },
                            }));
                        } else {
                            setCantidades((prev) => {
                            const newCantidades = { ...prev };
                            delete newCantidades[item.idMaterial];
                            return newCantidades;
                            });
                        }
                        }}
                    />
                    </article>
                </div>
                ))}
            </div>
            ))}
 
        </section>
        <input onClick={handleEnviar} className={styles.Check} type='submit' value={"GUARDAR CHECKLIST"}/>
    </div>
  )
}

export default Checklist
