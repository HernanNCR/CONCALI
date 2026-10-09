import React, {useState, useEffect} from 'react'
import styles from './Cexterna.module.css'
import axios from 'axios';
import { FaArrowLeftLong , FaUser} from "react-icons/fa6";
import { BACKEND_URL } from "../config";


const Cexterna = ({cambiarPagina}) => {
    const [Data, setData] = useState('');
    const [DataProyectos, setDataProyectos] = useState([]);

    useEffect(() => { 
        axios
            .get(`${BACKEND_URL}/api/solicitudeStatus4`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error:", error.response);
            });
    }, []);

    // numeros de solicitud
    const [numSolicitud, setNumSolicitud] = useState('');
    const [idProyecto,setidProyecto] = useState('');
    const handleSolicitudChange = (e) => {
        const valor = e.target.value;
        setNumSolicitud(valor);

        axios
            .get(`${BACKEND_URL}/api/proyectosPorSolicitud/${valor}`)
            .then((response) => {
            setDataProyectos(response.data);
            })
            .catch((error) => {
            console.error("Error al obtener proyectos:", error);
        });
    };

    // proyectos de la solicitud de arriba
    const [idProyectos, setidProyectos] = useState ({});
    const [contenedores,setContenedores] = useState ({});
    const handlePuntosMuestreosChange = (e) => {
        const idProyecto = e.target.value;
        // console.log(idProyecto);
        setidProyecto(idProyecto);

        axios
            .get(`${BACKEND_URL}/api/puntosMuestreoPorProyecto/${idProyecto}`)
            .then((response) => {
            const { resumenContenedores, contenedoresGnl } = response.data;

            setContenedores(contenedoresGnl);
            setidProyectos(resumenContenedores);

            // Inicializa los datos para inputs por muestra
            const nuevoFormData = {};
            resumenContenedores.forEach((punto) => {
                const { idMuestra, contenedores } = punto;
                if (contenedores && contenedores.length > 0) {
                nuevoFormData[idMuestra] = {};
                contenedores.forEach((nombre) => {
                    if (nombre !== 'ND') {
                    nuevoFormData[idMuestra][nombre] = ''; // Para inputs controlados
                    }
                });
                }
            });
            setFormData(nuevoFormData);

            // ✅ Inicializa estadoContenedores con campos booleanos
            if (contenedoresGnl && contenedoresGnl.length > 0) {
                const inicial = contenedoresGnl
                .filter((nombre) => nombre !== 'ND')
                .map((nombre) => ({
                    nombre,
                    conservacion: false,
                    hielo: false,
                    phAdecuado: false
                }));
                setEstadoContenedores(inicial);
            }
            })
            .catch((error) => {
            console.error("Error al obtener proyectos:", error);
            });
    };

    


    // extraer informacion para selects
    const [Data2, setData2] = useState({});
    useEffect(() => { 
    axios
        .get(`${BACKEND_URL}/api/tipoagua`) 
        .then((response) => {
        setData2(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [Data3, setData3] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/tipomatriz`)
        .then((response) => {
        setData3(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [users, setUsers] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/usuariosActivos`)
        .then((response) => {
        setUsers(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [informacionGeneral, setInformacionGeneral] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInformacionGeneral((prev) => ({
        ...prev,
        [name]:  value,
        }));
    };

    const [estadoContenedores, setEstadoContenedores] = useState({});
    const handleCheckboxChange = (nombreEnvase, campo, valor) => {
        setEstadoContenedores((prev) =>
            prev.map((item) =>
            item.nombre === nombreEnvase ? { ...item, [campo]: valor } : item
            )
        );
    };



    // crear arrays de inforacion
    const [formData, setFormData] = useState({});
    const handleEnviar = async (e) => {
         e.preventDefault();

        const resultados = Object.entries(formData)
            .filter(([, data]) => data.checked)
            .map(([idMuestra, data]) => {
                const {
                fecha,
                hora,
                idTipoAgua,
                idMatriz,
                checked,
                ...contenedoresRaw
                } = data;

                // Extraer solo los contenedores válidos (que tienen estructura { cantidad, conservacion, etc. })
                const contenedores = Object.entries(contenedoresRaw)
                .filter(([, value]) => typeof value === 'object' && value !== null && 'cantidad' in value)
                .map(([nombre, info]) => ({
                    nombre,
                    cantidad: Number(info.cantidad || 0),
                    conservacion: !!info.conservacion,
                    hielo: !!info.hielo,
                    phAdecuado: !!info.phAdecuado,
                }));

                return {
                idMuestra,
                fecha: fecha || null,
                hora: hora || null,
                idTipoAgua: idTipoAgua || null,
                idMatriz: idMatriz || null,
                contenedores,
                };
        })
        try {
            
            const response = await fetch(`${BACKEND_URL}/api/insertar_desc_custodia_externa`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ informacionGeneral,resultados, estadoContenedores, numSolicitud, idProyecto }),
            }); 

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                cambiarPagina("menu");
            } else {
                console.error("Error al insertar datos");
            }
            
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    const [errorObservaciones, setErrorObservaciones] = useState(false);
    useEffect(() => {
    const largo = informacionGeneral.observaciones?.length || 0;
    setErrorObservaciones(largo > 150);
    }, [informacionGeneral.observaciones]);

    const [errorParametros, setErrorParametros] = useState(false);
    useEffect(() => {
    const largo = informacionGeneral.parametrosFueraTiempo ?.length || 0;
    setErrorParametros(largo > 150);
    }, [informacionGeneral.parametrosFueraTiempo]);

    


    
    


  return (
    <div>
        <div className={styles.bodyNav}>
            <article className={styles.title}>
                <p>CUSTODIA EXTERNA</p>
            </article>
            <article className={styles.selectNumSolicitud}>
                <select 
                className={styles.selectSolicitud} 
                name="numeroSolicitudes" 
                onChange={handleSolicitudChange}  
                    
                > 
                <option value={0}></option>
                {Data.length > 0 ? (
                    Data.map((item, index) => (
                    <option key={item.numSolicitud} value={item.numSolicitud}>
                        {item.numSolicitud}
                    </option>
                    ))
                ) : (
                    <option>ELIGE UNA SOLICITUD</option>
                )}
                </select>

                <select className={styles.selectSolicitud} name='numeroSolicitudes' onChange={handlePuntosMuestreosChange}> 
                    <option value={0}></option>
                    {DataProyectos.length > 0 ? (
                    DataProyectos.map((item, index) => (
                        <option key={item.idProyecto} value={item.idProyecto}>{item.nombreProyecto}</option>
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

        <form onSubmit={handleEnviar}>
            <div className={styles.contentCE}>
                {idProyectos.length > 0 ? (
                    idProyectos.map((item, index) => (   
                    <div key={item.idMuestra} className={styles.bodyPM}>   
                        <section className={styles.nombrePM}>
                            <input
                                className={styles.checkbox}
                                type='checkbox'
                                checked={formData[item.idMuestra]?.checked || false}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                    ...prev,
                                    [item.idMuestra]: {
                                        ...prev[item.idMuestra],
                                        checked: e.target.checked
                                    }
                                    }))
                                }
                            />
                            <p>{item.puntoMuestreo}</p> 
                            
                        </section>
                        <section className={styles.infoGnlCE}>
                            <section className={styles.nombreRecipiente}>
                                <p>Tipo Agua</p>
                                <select
                                    className={styles.matriz}
                                    value={formData[item.idMuestra]?.idMatriz || ''}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                        ...prev,
                                        [item.idMuestra]: {
                                            ...prev[item.idMuestra],
                                            idMatriz: e.target.value
                                        }
                                        }))
                                    }
                                    >
                                    <option value={0}></option>
                                    {Data2.map((agua) => (
                                        <option key={agua.idTipoAgua} value={agua.idTipoAgua}>
                                        {agua.nombreAgua}
                                        </option>
                                    ))}
                                </select>
                            </section>
                            <section className={styles.nombreRecipiente}>
                                <p>Tipo Matriz</p>
                                <select
                                    className={styles.matriz}
                                    value={formData[item.idMuestra]?.idTipoAgua || ''}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                        ...prev,
                                        [item.idMuestra]: {
                                            ...prev[item.idMuestra],
                                            idTipoAgua: e.target.value
                                        }
                                        }))
                                    }
                                    >
                                    <option value={0}></option>
                                    {Data3.map((agua) => (
                                        <option key={agua.idMatriz} value={agua.idMatriz}>
                                        {agua.nombreMatriz}
                                        </option>
                                    ))}
                                </select>
                            </section>
                            <section className={styles.nombreRecipiente}>
                                <p>Fecha</p>
                                <input
                                    className={styles.date}
                                    type='date'
                                    value={formData[item.idMuestra]?.fecha || ''}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                        ...prev,
                                        [item.idMuestra]: {
                                            ...prev[item.idMuestra],
                                            fecha: e.target.value
                                        }
                                        }))
                                    }
                                />
                            </section>
                            <section className={styles.nombreRecipiente}>
                                <p>Hora</p>
                                <input
                                    className={styles.time}
                                    type='time'
                                    value={formData[item.idMuestra]?.hora || ''}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                        ...prev,
                                        [item.idMuestra]: {
                                            ...prev[item.idMuestra],
                                            hora: e.target.value
                                        }
                                        }))
                                    }
                                />
                            </section>
                        </section>
                        <div className={styles.informacionPM} >
                            <section className={styles.item1}><p>ENVASES</p></section>
                            <table className={styles.tableCE}>
                                <thead>
                                    <tr>
                                        <th>ENVASE</th>
                                        <th>Cantidad</th>
                    
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.contenedores && item.contenedores.length > 0 ? (
                                    item.contenedores
                                        .filter((nombre) => nombre !== 'ND')
                                        .map((nombre, idx) => (
                                            <tr key={idx}>
                                                <td>{nombre}</td>

                                                {/* Cantidad */}
                                                <td>
                                                    <input
                                                    type="number"
                                                    min={0}
                                                    value={formData[item.idMuestra]?.[nombre]?.cantidad || ''}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                        ...prev,
                                                        [item.idMuestra]: {
                                                            ...prev[item.idMuestra],
                                                            [nombre]: {
                                                            ...prev[item.idMuestra]?.[nombre],
                                                            cantidad: e.target.value,
                                                            },
                                                        },
                                                        }))
                                                    }
                                                    />
                                                </td>

                                                
                                            </tr>

                                        
                                        ))
                                    ) : (
                                    <p>No hay envases asignados</p>
                                    )}
                                    
                                </tbody>
                            </table>
                            
                        </div>
                        

                    </div>
                    ))
                    ) : (
                    <option>Informacion no disponible</option>
                )}
                <table className={styles.tableCE} style={{ opacity: idProyectos.length > 0 ? 1 : 0 }}>
                    <thead>
                        <tr>
                        <th>ENVASE</th>
                        <th>¿Se agregaron los reactivos de conservación?</th>
                        <th>¿Las muestras vienen en hielo?</th>
                        <th>¿Tienen pH adecuado?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estadoContenedores.length > 0 ? (
                        estadoContenedores.map((envase, idx) => (
                            <tr key={idx}>
                            <td>{envase.nombre}</td>
                            <td>
                                <input
                                type="checkbox"
                                checked={envase.conservacion}
                                onChange={(e) =>
                                    handleCheckboxChange(envase.nombre, 'conservacion', e.target.checked)
                                }
                                />
                            </td>
                            <td>
                                <input
                                type="checkbox"
                                checked={envase.hielo}
                                onChange={(e) =>
                                    handleCheckboxChange(envase.nombre, 'hielo', e.target.checked)
                                }
                                />
                            </td>
                            <td>
                                <input
                                type="checkbox"
                                checked={envase.phAdecuado}
                                onChange={(e) =>
                                    handleCheckboxChange(envase.nombre, 'phAdecuado', e.target.checked)
                                }
                                />
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr><td colSpan="4">No hay envases asignados</td></tr>
                        )}
                    </tbody>
                    </table>


                <div className={styles.muestradorInfo} style={{ opacity: idProyectos.length > 0 ? 1 : 0 }} > <FaUser size={30} /> 
                        <select name='muestrador' className={styles.inputMuestardorInfo} value={informacionGeneral.muestrador || ''} onChange={handleInputChange} required>
                            <option></option>
                            {users.length > 0 ? (
                            users.map((item, index) => (   
                                <option value={item.clvUsuario}>{item.clvUsuario}</option>
                            ))
                            ) : (
                            <option>Informacion no disponible</option>
                            )}
                        </select>
                    
                </div>
                <section className={styles.observaciones} style={{ opacity: idProyectos.length > 0 ? 1 : 0 }}>
                    <div>
                        <article className={styles.article_datosfinales}><p>Nombre Entrega:</p>
                        <select name='NombreEntrega' value={informacionGeneral.NombreEntrega|| ''} onChange={handleInputChange}>
                            <option></option>
                            {users.length > 0 ? (
                            users.map((item, index) => (   
                                <option value={item.clvUsuario}>{item.clvUsuario}</option>
                            ))
                            ) : (
                            <option>Informacion no disponible</option>
                            )}
                        </select>
                        </article>
                        <article className={styles.article_datosfinales}><p>Fecha Entrega:</p><input name='fechaEntrega' value={informacionGeneral.fechaEntrega|| ''} onChange={handleInputChange} type='date'/></article>
                        <article className={styles.article_datosfinales}><p>Hora Entrega:</p><input name='horaEntrega' value={informacionGeneral.horaEntrega|| ''} onChange={handleInputChange} type='time'/></article>
                    </div>
                    <div>
                        <article className={styles.article_datosfinales}><p>Nombre Receptor:</p>
                        <select name='NombreReceptor' value={informacionGeneral.NombreReceptor|| ''} onChange={handleInputChange}>
                            <option></option>
                            {users.length > 0 ? (
                            users.map((item, index) => (   
                                <option value={item.clvUsuario}>{item.clvUsuario}</option>
                            ))
                            ) : (
                            <option>Informacion no disponible</option>
                            )}
                        </select>
                        </article>
                        <article className={styles.article_datosfinales}><p>Fecha Receptor:</p><input name='fechaReceptor' value={informacionGeneral.fechaReceptor|| ''} onChange={handleInputChange} type='date'/></article>
                        <article className={styles.article_datosfinales}><p>Hora Receptor:</p><input name='horaReceptor' value={informacionGeneral.horaReceptor|| ''} onChange={handleInputChange} type='time'/></article>
                    </div>

                    
                    
                    <textarea
                    className={errorObservaciones ? styles.errorObservaciones : ''}
                        name='observaciones' 
                        value={informacionGeneral.observaciones|| ''} onChange={handleInputChange}
                        placeholder="Observaciones"
                    />
                    <textarea
                        className={errorParametros ? styles.errorParametros : ''}
                        name='parametrosFueraTiempo'
                        value={informacionGeneral.parametrosFueraTiempo|| ''} onChange={handleInputChange}
                        placeholder="Parametros fuera de tiempo"
                    />
                </section>
                
                
            </div>
            <input className={styles.boton} type="submit" value="GUARDAR"/> 
        </form>
        

    </div>
  )
}

export default Cexterna