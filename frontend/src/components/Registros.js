import React, {useState, useEffect} from 'react'
import styles from './Registros.module.css'
import axios from 'axios';
import { FaArrowLeftLong } from "react-icons/fa6"
import { IoPencilOutline } from "react-icons/io5";
import { GrStatusPlaceholder } from "react-icons/gr";
import { BACKEND_URL } from "../config.js";


const Registros = ({cambiarPagina}) => {
    const [Data1, setData1] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/parametros`)
        .then((response) => {
        setData1(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);
    

    const [Data, setData] = useState({});
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
        .get(`${BACKEND_URL}/api/tipofinalidad`)
        .then((response) => {
        setData3(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);
    const [Data5, setData5] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/tipomaterial`)
        .then((response) => {
        setData5(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);
    const [Data6, setData6] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/tipomatriz`)
        .then((response) => {
        setData6(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [Data7, setData7] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/conservadores`)
        .then((response) => {
        setData7(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [Data8, setData8] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/tipoparametro`)
        .then((response) => {
        setData8(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [Data9, setData9] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/usuarios`)
        .then((response) => {
        setData9(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    const [Data10, setData10] = useState({});
    useEffect(() => {
    axios
        .get(`${BACKEND_URL}/api/termometros`)
        .then((response) => {
        setData10(response.data);
        })
        .catch((error) => {
        console.error("Error:", error.response);
        });
    }, []);

    // FUNCIONES----------------------

    const [estadoSeleccion, setEstadoSeleccion] = useState({});
    const handleCambiarSeleccion = (valor) => {
        setEstadoSeleccion(valor);
        console.log(valor);
    };

    const [registroSeleccionado,setregistroSeleccionado] = useState('');
    const handlerSeleccionar = (e) =>{
        const valor = e.target.value;
        setregistroSeleccionado(valor);
    }

    const [verSeleccionado,setverSeleccionado] = useState('');
    const handlerVer = (e) =>{
        const valor = e.target.value;
        setverSeleccionado(valor);
    }

    const [informacionGeneral, setInformacionGeneral] = useState({});
    const handleInformacion = (e) => {
        const { name, value, type, checked } = e.target;
        setInformacionGeneral((prev) => ({
        ...prev,
        [name]:  type === "checkbox" ? checked : value,
        }));
    }

    const guardarDatos = async (valor) => {
        if(valor === 'parametros'){
            console.log("enviando a "+valor);
            console.log(informacionGeneral);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_parametros`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'almacen'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_almacen`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'conservadores'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_conservadores`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'tipo_agua'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_tipo_agua`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'tipo_estudios'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_tipo_estudios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'tipo_finalidad'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_tipo_finalidad`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'tipo_material'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_tipo_material`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'tipo_matriz'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_tipo_matriz`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'tipo_parametro'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_tipo_parametro`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'usuarios'){
            console.log("enviando a "+ valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_usuarios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        } else if(valor === 'termometros'){
            console.log("enviando a "+valor);
            try {

                const response = await fetch(`${BACKEND_URL}/api/insertar_termometros`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ informacionGeneral }),
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
        }
        
    }

    const [datosTermometros,setDatosTermometos] = useState({});
    const [divTermometro,setDviTermometro] = useState(false);
    const [idTermometro,setIdTermometro] = useState({});
    const changeTermometro = async (valor) => {
        const id = valor;
        setIdTermometro(id);
        setDviTermometro(true);
        const termometroCodificado = encodeURIComponent(valor);

        axios
            .get(`${BACKEND_URL}/api/termometrosID/${termometroCodificado}`)
            .then((response) => {
            setDatosTermometos(response.data);
            })
            .catch((error) => {
            console.error("Error al obtener proyectos:", error);
        });
    }

    const actualizarDatos = async () => {
        console.log(informacionGeneral);
        console.log(datosTermometros[0].idTermometro);
        const id_termometro = datosTermometros[0].idTermometro;

        try {

            const response = await fetch(`${BACKEND_URL}/api/actualizarTermometros`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ informacionGeneral , id_termometro }),
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
    }

    const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const desactivarSolicitud = async (idParametro) => {
        const confirmar = window.confirm(`¿Desactivar Parametro?`);
        if (confirmar) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/actualizarParametro`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parametro: idParametro }),
            });

            if (response.ok) {
                cambiarPagina("menu");
                await esperar(50);
                cambiarPagina("registros");
            } else {
            console.log("Error al actualizar");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
        } else {
        console.log("Cancelado");
        }
    };

    const activarSolicitud = async (idParametro) => {
        const confirmar = window.confirm(`¿Activar Parametro?`);
        if (confirmar) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/activarParametro`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parametro: idParametro }),
            });

            if (response.ok) {
                cambiarPagina("menu");
                await esperar(50);
                cambiarPagina("registros");
            } else {
            console.log("Error al actualizar");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
        } else {
        console.log("Cancelado");
        }
    };

    const desactivarPersonal = async (idUsuario) => {
        const confirmar = window.confirm(`¿Desactivar Usuario?`);
        if (confirmar) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/desactivarUsuarios`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: idUsuario }),
            });

            if (response.ok) {
                cambiarPagina("menu");

            } else {
            console.log("Error al actualizar");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
        } else {
        console.log("Cancelado");
        }
    };

    const activarPersonal = async (idUsuario) => {
        const confirmar = window.confirm(`¿Activar Usuario?`);
        if (confirmar) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/activarUsuarios`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: idUsuario }),
            });

            if (response.ok) {
                cambiarPagina("menu");
            } else {
            console.log("Error al actualizar");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
        } else {
        console.log("Cancelado");
        }
    };



    if(divTermometro){
        return(
            <div>
                <div className={styles.bodyNav}>
                    <article className={styles.title}>
                        <p>REGISTROS DE LABORATORIO</p>
                    </article>
                    <article onClick={() => cambiarPagina("menu")} className={styles.back}>
                        <FaArrowLeftLong size={20} />
                    </article>
                </div>
                <div className={styles.divTermometro}>
                <p>ACTUALIZACIÓN DATOS DE TERMÓMETRO {idTermometro}</p>
                
                <div className={styles.incertidumbre}>
                    <div>
                    <p>10: </p>
                    <input type='number' name='dato_10'  placeholder={datosTermometros[0]?.incertidumbre_10 ?? ''} onChange={handleInformacion} />
                    </div>
                    <div>
                    <p>15: </p>
                    <input type='number' name='dato_15'  placeholder={datosTermometros[0]?.incertidumbre_15 ?? ''} onChange={handleInformacion} />
                    </div>
                    <div>
                    <p>25: </p>
                    <input type='number' name='dato_25'  placeholder={datosTermometros[0]?.incertidumbre_25 ?? ''} onChange={handleInformacion} />
                    </div>
                    <div>
                    <p>30: </p>
                    <input type='number' name='dato_30'  placeholder={datosTermometros[0]?.incertidumbre_30 ?? ''} onChange={handleInformacion} />
                    </div>
                    <div>
                    <p>35: </p>
                    <input type='number' name='dato_35'  placeholder={datosTermometros[0]?.incertidumbre_35 ?? ''} onChange={handleInformacion} />
                    </div>
                    <div>
                    <p>44: </p>
                    <input type='number' name='dato_44'  placeholder={datosTermometros[0]?.incertidumbre_44 ?? ''} onChange={handleInformacion} />
                    </div>
                    <div>
                    <p>50: </p>
                    <input type='number' name='dato_50'  placeholder={datosTermometros[0]?.incertidumbre_50 ?? ''} onChange={handleInformacion} />
                    </div>
                </div>

                <input type='submit' value={'ACTUALIZAR'} onClick={actualizarDatos} />
                </div>

            </div>
        );
    }
        
   
  return ( 
    <div>
        <div className={styles.bodyNav}>
            <article className={styles.title}>
                <p>REGISTROS DE LABORATORIO</p>
            </article>
            <article onClick={() => cambiarPagina("menu")} className={styles.back}>
                <FaArrowLeftLong size={20} />
            </article>
        </div>

        <div className={styles.contentSeleccionador}>
            <article className={estadoSeleccion === 'NUEVO' ? styles.articleSeleccionActive : styles.articleSeleccion} onClick={() => handleCambiarSeleccion('NUEVO')} ><p>Nuevo Registro</p></article>
            <article className={estadoSeleccion === 'VER' ? styles.articleSeleccionActive : styles.articleSeleccion} onClick={() => handleCambiarSeleccion('VER')}  ><p>Ver Registro</p></article>
        </div>

        <div className={styles.contentRegistro}>
            <div className={estadoSeleccion === 'NUEVO' ? styles.contenedorNuevoActive : styles.contenedorNuevo}>
                <div>
                    <select className={styles.select} onChange={handlerSeleccionar}>
                        <option value="">Selecciona una opción</option>
                        <option value="parametros">Parámetros</option>
                        <option value="almacen">Almacén</option>
                        <option value="conservadores">Conservadores</option>
                        <option value="tipo_agua">Tipo de Agua</option>
                        {/* <option value="tipo_estudios">Tipo de Estudios</option> */}
                        <option value="tipo_finalidad">Tipo de Finalidad</option>
                        <option value="tipo_material">Tipo de Material</option>
                        <option value="tipo_matriz">Tipo de Matriz</option>
                        <option value="tipo_parametro">Familia de Parametros</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="termometros">Termometros</option>
                    </select>
                </div>

                <div className={styles.contentVer}> 
                    {/* <p>Registrar Nuevo {registroSeleccionado}</p> */}
                    {registroSeleccionado === 'parametros' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Nombre Parametro</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Metodo Parametro</label>
                                <input type='text' className={styles.input} name='metodo' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Acreditacion Parametro</label>
                                <input type='checkbox' className={styles.input} name='acreditacion' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Tipo Parametro</label>
                                <select className={styles.select} name='tipo' onChange={handleInformacion}>
                                    <option></option>
                                    {Data8.length > 0 ? (
                                    Data8.map((item, index) => (
                                        <option value={item.idTipoParametro}>{item.Nom_rec}</option>
                                        ))
                                    ) : (
                                        <option>Informacion no disponible</option>
                                    )}
                                </select>
                            </article>
                            

                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('parametros')}/>
                        </div>
                    )}

                    {registroSeleccionado === 'almacen' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Tipo Material</label>
                                <select className={styles.select} name='tipo' onChange={handleInformacion}>
                                    <option></option>
                                    {Data5.length > 0 ? (
                                    Data5.map((item, index) => (
                                        <option value={item.idMaterial}>{item.nombreTipo}</option>
                                        ))
                                    ) : (
                                        <option>Informacion no disponible</option>
                                    )}
                                    
                                </select>
                            </article>
                            <article>
                                <label>Nombre Material</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            <article>
                                 <label>Descripcion Material</label>
                                <input type='text' className={styles.input} name='descripcion' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Cantidad</label>
                                <input type='number' className={styles.input} name='cantidad' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Cuantidad</label>
                                <input type='number' className={styles.input} name='cuantidad' onChange={handleInformacion} />
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('almacen')}/>
                        </div>
                        
                        )}

                    {registroSeleccionado === 'conservadores' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Nombre Conservador</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('conservadores')}/>
                        </div>
                        )}

                    {registroSeleccionado === 'tipo_agua' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Tipo Agua</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Descripcion del Tipo de Agua</label>
                                <input type='text' className={styles.input} name='descripcion' onChange={handleInformacion} />
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('tipo_agua')}/>
                        </div>
                        )}

                    {registroSeleccionado === 'tipo_finalidad' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Tipo Finalidad</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Descripcion del Tipo de Finalidad</label>
                                <input type='text' className={styles.input} name='descripcion' onChange={handleInformacion} />
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('tipo_finalidad')}/>
                        </div>
                        )}
                        
                    {registroSeleccionado === 'tipo_material' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Tipo Material</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion}/>
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('tipo_material')}/>
                        </div>
                        )}

                    {registroSeleccionado === 'tipo_matriz' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Nombre Matriz</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('tipo_matriz')}/>
                        </div>
                        )}

                    {registroSeleccionado === 'tipo_parametro' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Nombre Familia de Parametros</label>
                                <input type='text' className={styles.input} name='nombre' onChange={handleInformacion} />
                            </article>
                            
                            <article>
                                <label>Tipo Conservador</label>
                                <select className={styles.select} name='conservador' onChange={handleInformacion}>
                                    <option></option>
                                    {Data7.length > 0 ? (
                                    Data7.map((item, index) => (
                                        <option value={item.idConservador}>{item.name_conservador}</option>
                                        ))
                                    ) : (
                                        <option>Informacion no disponible</option>
                                    )}
                                    
                                </select>
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('tipo_parametro')}/>
                        </div>
                        )}

                    {registroSeleccionado === 'usuarios' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>Clave Usuario</label>
                                <input type='text' className={styles.input} name='clave' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Password</label>
                                <input type='password' className={styles.input} name='pass' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Tipo Usuario</label><select className={styles.select} name='tipo' onChange={handleInformacion}>
                                    <option></option>
                                    <option value={1}>ADMIN</option>
                                    <option value={2}>ANALISTA</option>
                                </select>
                            </article>
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('usuarios')}/>
                        </div>
                        )}
                    {registroSeleccionado === 'termometros' && (
                        <div className={styles.contenedor_para_registrar}>
                            <article>
                                <label>ID Termometro</label>
                                <input type='text' className={styles.input} name='ID' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Marca Termometro</label>
                                <input type='text' className={styles.input} name='marca' onChange={handleInformacion} />
                            </article>
                            <article>
                                <label>Clave Termometro</label>
                                <input type='text' className={styles.input} name='clave' onChange={handleInformacion} />
                            </article>
                            <center><p>LIMITES</p></center>
                            <div className={styles.incertidumbre}>
                                <p>DE:</p><input type='number' name='inicio_limite' onChange={handleInformacion}/><p>A:</p><input type='number' name='final_limite' onChange={handleInformacion}/>
                            </div>
                            <center><p>INCERTIDUMBRES</p></center>
                            <div className={styles.incertidumbre}>
                                <div>
                                    <p>10: </p><input type='number' name='dato_10' onChange={handleInformacion}/>
                                </div>
                                <div>
                                    <p>15: </p><input type='number' name='dato_15' onChange={handleInformacion} />
                                </div>
                                <div>
                                    <p>25: </p><input type='number' name='dato_25' onChange={handleInformacion} />
                                </div>
                                <div>
                                    <p>30: </p><input type='number' name='dato_30' onChange={handleInformacion} />
                                </div>
                                <div>
                                    <p>35: </p><input type='number' name='dato_35' onChange={handleInformacion} />
                                </div>
                                <div>
                                    <p>44: </p><input type='number' name='dato_44' onChange={handleInformacion} />
                                </div>
                                <div>
                                    <p>50: </p><input type='number' name='dato_50' onChange={handleInformacion} />
                                </div>
                            </div>
                            
                            <input type='submit' value={'GUARDAR'} onClick={() => guardarDatos('termometros')}/>
                        </div>
                        )}
                </div>
            </div>
            <div className={estadoSeleccion === 'VER' ? styles.contenedorVerActive : styles.contenedorVer}>
                <div>
                    <select className={styles.select} onChange={handlerVer}>
                        <option value="">Selecciona una opción</option>
                        <option value="parametros">Parámetros</option>
                        <option value="almacen">Almacén</option>
                        <option value="conservadores">Conservadores</option>
                        <option value="tipo_agua">Tipo de Agua</option>
                        {/* <option value="tipo_estudios">Tipo de Estudios</option> */}
                        <option value="tipo_finalidad">Tipo de Finalidad</option>
                        <option value="tipo_material">Tipo de Material</option>
                        <option value="tipo_matriz">Tipo de Matriz</option>
                        <option value="tipo_parametro">Familia de Parametros</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="termometros">Termometros</option>
                    </select>
                </div>
                <div className={styles.contentVer}>
                    {verSeleccionado === 'parametros' && (
                    <table>
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Método</th>
                            <th>Acreditación</th>
                            <th>Tipo Parámetro</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {Data1.length > 0 ? (
                            Data1.map((item, index) => (
                            <tr key={item.numSolicitud || index} style={{background:  item.id_estado === 1 ? "white" : "lightgray"}} >
                                <td>{item.nombreParametro}</td>
                                <td>{item.metodoParametro}</td>
                                <td>{item.acreditacionParametro ? "SI": "NO"}</td>
                                <td>{item.idtipoParametro}</td>
                                <td> <GrStatusPlaceholder style={{background: item.id_estado === 1 ? "lightgreen" : "lightcoral", cursor:"pointer"}} onClick={() => item.id_estado === 1 ? desactivarSolicitud(item.idParametro) : activarSolicitud(item.idParametro) } /></td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="5">Información no disponible</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    )}
                    {verSeleccionado === 'usuarios' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Usuarios</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Data9.length > 0 ? (
                            Data9.map((item, index) => (
                                <tr key={item.numSolicitud}>
                                    <td>{item.clvUsuario}</td>
                                    <td> <GrStatusPlaceholder style={{background: item.id_estado === 1 ? "lightgreen" : "lightcoral", cursor:"pointer"}} onClick={() => item.id_estado === 1 ? desactivarPersonal(item.idUsuario) : activarPersonal(item.idUsuario) }/> </td>
                                </tr>
                                ))
                            ) : (
                                <option>Informacion no disponible</option>
                            )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'almacen' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre Material</th>
                                    <th>descripcion</th>
                                    <th>Cuantidad</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Data.length > 0 ? (
                            Data.map((item, index) => (
                                <tr key={item.numSolicitud}>
                                    <td>{item.nombreMaterial}</td>
                                    <td>{item.descMaterial}</td>
                                    <td>{item.cuantidadMaterial}</td>
                                    <td>{item.cantidadMaterial}</td>
                                </tr>
                                ))
                            ) : (
                                <option>Informacion no disponible</option>
                            )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'conservadores' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Data7.length > 0 ? (
                                Data7.map((item, index) => (
                                    <tr key={item.numSolicitud}>
                                        <td>{item.idConservador}</td>
                                        <td>{item.name_conservador}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'tipo_agua' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {Data2.length > 0 ? (
                                Data2.map((item, index) => (
                                    <tr key={item.numSolicitud}>
                                        <td>{item.nombreAgua}</td>
                                        <td>{item.descAgua}</td>
                                
                                    </tr>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'tipo_finalidad' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {Data3.length > 0 ? (
                                Data3.map((item, index) => (
                                    <tr key={item.numSolicitud}>
                                        <td>{item.nombreFinalidad}</td>
                                        <td>{item.descFinalidad}</td>
                                        
                                    </tr>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'tipo_material' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre Tipo Material</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {Data5.length > 0 ? (
                                Data5.map((item, index) => (
                                    <tr key={item.numSolicitud}>
                                        
                                        <td>{item.nombreTipo}</td>
                                    
                                    </tr>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'tipo_matriz' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {Data6.length > 0 ? (
                                Data6.map((item, index) => (
                                    <tr key={item.numSolicitud}>
                                        
                                        <td>{item.nombreMatriz}</td>
                                    
                                    </tr>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'tipo_parametro' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre de Familia de Parametros</th>                           
                                </tr>
                            </thead>
                            <tbody>
                                {Data8.length > 0 ? (
                                Data8.map((item, index) => (
                                    <tr key={item.numSolicitud}>
                                        <td>{item.Nom_rec}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </tbody>
                        </table>
                        )}

                    {verSeleccionado === 'termometros' && (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>MARCA</th>
                                    <th>CLAVE</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {Data10.length > 0 ? (
                            Data10.map((item, index) => (
                                <tr key={item.numSolicitud}>
                                    <td>{item.idTermometro}</td>
                                    <td>{item.marcaTermometro}</td>
                                    <td>{item.claveTermometro}</td>
                                    <td><IoPencilOutline size={25} style={{cursor: "pointer"}} onClick={() => changeTermometro(item.idTermometro)} /></td>
                                </tr>
                                ))
                            ) : (
                                <option>Informacion no disponible</option>
                            )}
                            </tbody>
                        </table>
                        )}

                     
                </div>
            </div>
        </div>


        
    </div>
  )
}

export default Registros
