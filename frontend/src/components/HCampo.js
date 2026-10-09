import React, { useState, useEffect } from 'react';
import styles from './HCampo.module.css'
import { FaArrowLeftLong } from "react-icons/fa6"
import axios from 'axios';
import { BACKEND_URL } from "../config";

const HCampo = ({ cambiarPagina }) => {
    const [Data, setData] = useState([]);
    const [DataProyectos, setDataProyectos] = useState([]);
    

    // slect de solicitudes
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

    // slects de proyectos de la solicitud elegida
    const handleSolicitudChange = (e) => {
        const numSolicitud = e.target.value; 
        // console.log(numSolicitud)
        axios
          .get(`${BACKEND_URL}/api/proyectosPorSolicitudHCampo/${numSolicitud}`)
          .then((response) => {
            setDataProyectos(response.data); // Actualiza los proyectos
          })
          .catch((error) => {
            console.error("Error al obtener proyectos:", error);
          });
    };


    // datos del proyecto seleccionado
    const [idProyectos, setidProyectos] = useState ({});
    const [proyecto,setProyecto] = useState({});
    const handlePuntosMuestreosChange = (e) => {
        const idProyecto = e.target.value; 
        setProyecto(idProyecto);
        axios
          .get(`${BACKEND_URL}/api/puntosMuestreoCustodiaExterna/${idProyecto}`)
          .then((response) => {
            setidProyectos(response.data); // Actualiza los proyectos
          })
          .catch((error) => {
            console.error("Error al obtener proyectos:", error);
          });
    };
      
    // datos de selects
    const [finalidad,setFinalidad] = useState({});
    const [agua,setAgua] = useState({});
    const [termometro,setTermometro] = useState({});
    const [usuarios, setUsuarios] = useState({});
    const [norma,setNorma] = useState({});
    useEffect(() => {
        const fetchData = async () => {
          try {
            const finalidadRes = await axios.get(`${BACKEND_URL}/api/tipofinalidad`);
            const aguaRes = await axios.get(`${BACKEND_URL}/api/tipoagua`);
            const termometros = await axios.get(`${BACKEND_URL}/api/termometros`);
            const users = await axios.get(`${BACKEND_URL}/api/usuariosActivos`);
            const normas = await axios.get(`${BACKEND_URL}/api/tipoNorma`);
      
            setFinalidad(finalidadRes.data);
            setAgua(aguaRes.data);
            setTermometro(termometros.data);
            setUsuarios(users.data);
            setNorma(normas.data);
          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        };
      
        fetchData();
    }, []);
      
    // datos de termometros
    const [estadotermometro,setEstadoTermometro] = useState(false);
    const [termometroElegido,setTermometroElegido ] = useState ({}); 
    const handleTermometro = (e) => {
        const trmetro = e.target.value;
        setEstadoTermometro(true);

        const termometroCodificado = encodeURIComponent(trmetro);

        axios
          .get(`${BACKEND_URL}/api/termometrosID/${termometroCodificado}`)
          .then((response) => {
            setTermometroElegido(response.data); // Actualiza los proyectos
          })
          .catch((error) => {
            console.error("Error al obtener proyectos:", error);
          });
        
    }; 

    function ajustarConIncertidumbre(valor, incertidumbrePorGrado) {
    let gradoCercano = 10;
    if (valor >= 0 && valor < 12) gradoCercano = 10;
    else if (valor >= 12 && valor < 22) gradoCercano = 15;
    else if (valor >= 23 && valor <= 27) gradoCercano = 25;
    else if (valor >= 28 && valor <= 33) gradoCercano = 30;
    else if (valor >= 34 && valor <= 41) gradoCercano = 35;
    else if (valor >= 42 && valor <= 46) gradoCercano = 44;
    else if (valor >= 47) gradoCercano = 50;

    const incertidumbre = incertidumbrePorGrado[gradoCercano] || 0;
    const ajustado = parseFloat(valor) + incertidumbre;
    const redondeado = Math.round(ajustado);
    return { ajustado: ajustado.toFixed(3), redondeado, gradoCercano, incertidumbre };
    }
    // guardar informacion general
    const [informacionGeneral, setInformacionGeneral] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInformacionGeneral((prev) => ({
        ...prev,
        [name]:  value,
        }));
    };

    // guardar datos de formulario
    const [datosFormulario, setDatosFormulario] = useState({});
    useEffect(() => {
        if (idProyectos.length > 0) {
        const inicial = {};
        idProyectos.forEach(({ idMuestra }) => {
            inicial[idMuestra] = {
            numero: '',
            hora: '',
            observaciones: {
                color: false,
                olor: '',
                gasto: false,
                burbuja: '',
                transparencia: '',
                materialFlotante: '',
                valorMaterialFlotante: '',
                tipoMaterialFlotante: '',
                sdt: '',
                tempAgua: ['', '', ''],
                tempAmb: ['', '', ''],
                ph: ['', '', ''],
                condE: ['', '', ''],
                od_porcentaje: ['', '', ''],
                od_ml: ['', '', ''],
                pH_incertidumbre: '',
                tempAguaAjustado: '',
                tempAmbAjustado: '',
                od_PorcentajeAjustado: '',
                od_porcentaje_incertidumbre: '',
                od_MlAjustado: '',
                od_ml_incertidumbre: '',
                condEAjustado: '',
                condE_incertidumbre: '',
            },
            recipientes: {
                fq: 0,
                gya: 0,
                nh3: 0,
                alcalinidad: 0,
                dureza: 0,
                hh: 0,
                mb: 0,
                otros: 0,
            }
            };
        });
        setDatosFormulario(inicial);
        }
    }, [idProyectos]);


    const handleChange = (idMuestra, campo, valor) => {
    setDatosFormulario(prev => ({
        ...prev,
        [idMuestra]: {
        ...prev[idMuestra],
        [campo]: valor, // esto ya será NombrePuntoMuestreo
        }
    }));
    };

    const handleObservacionChange = (idMuestra, campo, valor) => {
        setDatosFormulario(prev => ({
        ...prev,
        [idMuestra]: {
            ...prev[idMuestra],
            observaciones: {
            ...prev[idMuestra].observaciones,
            [campo]: valor
            }
        }
        }));
    };
    const handleRecipienteChange = (idMuestra, campo, valor) => {
        setDatosFormulario(prev => ({
        ...prev,
        [idMuestra]: {
            ...prev[idMuestra],
            recipientes: {
            ...prev[idMuestra].recipientes,
            [campo]: valor
            }
        }
        }));
    };

    

    // vista previa
    const [vistaPrevia,setVistaPrevia] = useState(false);
    const verVistaPrevia = () =>{
        setVistaPrevia(true);
        console.log(datosFormulario);
        console.log("informacion general: "+JSON.stringify(informacionGeneral));
        // console.log("proeyctos son: "+ proyecto);
        console.log(termometroElegido);
    }

    // enviar datos a backend
    const handleEnviar = async () =>{
        console.log("enviado...");

        try {

            const response = await fetch(`${BACKEND_URL}/api/insertar_hoja_campo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ termometroElegido, datosFormulario, informacionGeneral, proyecto }),
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


    
    if(vistaPrevia){
        return(
            <div>
                <center><p>VISTA PREVIA</p></center>
                <div className={styles.bodyMuestras}>
                    {Object.keys(datosFormulario).length > 0 ? (
                        Object.entries(datosFormulario).map(([idMuestra, item], index) => (
                        <div key={idMuestra} className={styles.muestras}>
                            <table className={styles.tableMuestras}>
                            <thead>
                                <tr>
                                <th>N°</th>
                                <th>Procedencia</th>
                                <th>Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>{item.numero}</td>
                                <td>{item.procedencia}</td>
                                <td>{item.hora}</td>
                                </tr>
                            </tbody>
                            </table>

                            <table className={styles.tableMuestras}>
                            <thead>
                                <tr>
                                <th>Color</th>
                                <th>Olor</th>
                                <th>Gasto</th>
                                <th>Burbuja</th>
                                <th>Transparencia</th>
                                <th>Material Flotante</th>
                                <th>Temp Agua</th>
                                <th>Temp Amb</th>
                                <th>pH</th>
                                <th>REDOX</th>
                                <th>COND E</th>
                                <th>SDT</th>
                                <th>OD %</th>
                                <th>OD ml/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>{item.observaciones.color}</td>
                                <td>{item.observaciones.olor ? 'Sí' : 'No'}</td>
                                <td>{item.observaciones.gasto }</td>
                                <td>{item.observaciones.burbuja ? 'Sí' : 'No'}</td>
                                <td>{item.observaciones.transparencia}</td>
                                <td>{item.observaciones.materialFlotante ? 'Sí' : 'No'}</td>
                                <td>{item.observaciones.tempAguaAjustado}</td>
                                <td>{item.observaciones.tempAmbAjustado}</td>
                                <td>{item.observaciones.phAjustado != null ? `${parseFloat(item.observaciones.phAjustado).toFixed(2)} +/- ${parseFloat(item.observaciones.pH_incertidumbre).toFixed(2)}` : '-'}</td>
                                <td>{item.observaciones.redox}</td>
                                <td>{item.observaciones.condEAjustado != null ? `${parseFloat(item.observaciones.condEAjustado).toFixed(2)} +/- ${parseFloat(item.observaciones.condE_incertidumbre).toFixed(2)}` : '-'}</td>
                                <td>{item.observaciones.sdt}</td>
                                <td>{item.observaciones.od_porcentaje != null ? `${parseFloat(item.observaciones.od_porcentaje).toFixed(2)}% +/- ${parseFloat(item.observaciones.od_porcentaje_incertidumbre).toFixed(2)}` : '-'}</td>
                                <td>{item.observaciones.od_MlAjustado != null ? `${parseFloat(item.observaciones.od_MlAjustado).toFixed(2)}ml/L +/- ${parseFloat(item.observaciones.od_ml_incertidumbre).toFixed(2)}` : '-'}</td>
                                </tr>
                            </tbody>
                            </table>

                            <table className={styles.tableMuestras}>
                            <thead>
                                <tr>
                                <th>FQ</th>
                                <th>GYA</th>
                                <th>NH3</th>
                                <th>ALCALINIDAD</th>
                                <th>DUREZA</th>
                                <th>H.H</th>
                                <th>MB</th>
                                <th>OTROS</th>
                                <th>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>{item.recipientes.fq}</td>
                                <td>{item.recipientes.gya}</td>
                                <td>{item.recipientes.nh3}</td>
                                <td>{item.recipientes.alcalinidad}</td>
                                <td>{item.recipientes.dureza}</td>
                                <td>{item.recipientes.hh}</td>
                                <td>{item.recipientes.mb}</td>
                                <td>{item.recipientes.otros}</td>
                                <td>
                                    {[
                                    item.recipientes.fq,
                                    item.recipientes.gya,
                                    item.recipientes.nh3,
                                    item.recipientes.alcalinidad,
                                    item.recipientes.dureza,
                                    item.recipientes.hh,
                                    item.recipientes.mb,
                                    item.recipientes.otros
                                    ]
                                    .map(val => parseInt(val || 0))
                                    .reduce((acc, val) => acc + val, 0)}
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        ))
                    ) : (
                        <p>Información no disponible</p>
                    )}
                    
                    <div className={styles.botones}>
                        <article onClick={() => setVistaPrevia(false)} className={styles.back}>
                            <FaArrowLeftLong size={20} />
                        </article>
                        <input className={styles.boton} onClick={handleEnviar}  type="submit" value={"GUARDAR CAMBIOS"}/> 
                    </div>
                     
                </div>
            </div>
        );  
    }
    return (
        <div>
            <div className={styles.bodyNav}>
                <article onClick={() => cambiarPagina("menu")} className={styles.back}>
                    <FaArrowLeftLong size={20} />
                </article>
                <article style={{opacity: estadotermometro ? 1 : 0}}>
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
                        <option>Información no disponible</option>
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
                <article className={styles.title}>
                    <p>HOJA DE CAMPO</p>
                </article>
            </div>
            <div className={styles.content}>
                <div className={styles.divTermometro} style={{opacity: estadotermometro ? 0 : 1}}>
                    <select onChange={handleTermometro}>
                        <option></option>
                        {termometro.length > 0 ? (
                            termometro.map((item, index) =>(
                                <option key={item.idTermometro} value={item.idTermometro}>{item.idTermometro}</option>
                            ))
                        ):(
                            <option>Informacion no disponible</option>
                        )}
                    </select>
                </div>
                <div className={ estadotermometro ? styles.datos_generales : styles.datos_generales_active}>
                        <p className={styles.article}>DATOS GENERALES</p>
                        <div className={styles.div}>
                            <article className={styles.articleDiv}>
                                <p>Muestreo</p>
                                <input className={styles.date} type='date' name='fechaMuestreo' value={informacionGeneral.fechaMuestreo || ''} onChange={handleInputChange} />
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Muestrador</p>
                                <select
                            className={styles.select}
                            name='muestrador'
                            value={informacionGeneral.muestrador || ''}
                            onChange={handleInputChange}
                            >
                            <option value=""></option>
                                {usuarios.length > 0 ? (
                                    usuarios.map((item) => (
                                    <option key={item.idUsuario} value={item.idUsuario}>{item.clvUsuario}</option>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            
                        </select>
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Recepcion</p>
                                <input className={styles.date} type='date' name='fechaRecepcion' value={informacionGeneral.fechaRecepcion || ''} onChange={handleInputChange}  />
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Agua</p>
                                <select
                            className={styles.select}
                            name="tipoAgua"
                            value={informacionGeneral.tipoAgua || ''}
                            onChange={handleInputChange}
                            >
                            <option value=""></option>
                            {agua.length > 0 ? (
                                agua.map((item) => (
                                <option key={item.idTipoAgua} value={item.idTipoAgua}>
                                    {item.nombreAgua}
                                </option>
                                ))
                            ) : (
                                <option>Información no disponible</option>
                            )}
                        </select>
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Receptor</p>
                                <select
                            className={styles.select}
                            name='receptor'
                            value={informacionGeneral.receptor || ''}
                            onChange={handleInputChange}
                            >
                            <option value=""></option>
                                {usuarios.length > 0 ? (
                                    usuarios.map((item) => (
                                    <option key={item.idUsuario} value={item.idUsuario}>{item.clvUsuario}</option>
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            
                        </select>
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Hora Recepcion</p>
                                <input className={styles.time} type='time' name='horaRecepcion' value={informacionGeneral.horaRecepcion || ''} onChange={handleInputChange} />
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Analisis</p>
                                <select className={styles.select} name='finalidad' value={informacionGeneral.finalidad || ''} onChange={handleInputChange}> 
                            <option></option> 
                            {finalidad.length > 0 ? (
                            finalidad.map((item, index) => (
                                <option key={item.idFinalidad} value={item.idFinalidad}>{item.nombreFinalidad}</option>
                                
                                ))
                            ) : (
                                <option value={0}>Informacion no disponible</option>
                            )}
                            </select>
                            </article>
                            <article className={styles.articleDiv}>
                                <p>Norma</p>
                                <select className={styles.select}name='tipoNorma' value={informacionGeneral.tipoNorma || ''} onChange={handleInputChange}>
                                <option></option>
                                {norma.length > 0 ? (
                                norma.map((item, index) => (
                                    <option value={item.idNorma}>{item.tipoNorma}</option>
                                    
                                    ))
                                ) : (
                                    <option>Informacion no disponible</option>
                                )}
                            </select> 
                            </article>
                        </div>
                    </div>
                    
                {idProyectos.length > 0 ? (
                    idProyectos.map((item, index) => (
                        <div className={styles.muestraHcampo}>
                            <div className={styles.identificacionMuestra}>
                                <article> <p>N°</p> <input type='number' value={datosFormulario[item.idMuestra]?.numero || ''} onChange={e => handleChange(item.idMuestra, 'numero', e.target.value)}/> </article>
                                <article> <p>PROCEDENCIA : </p> <input
                                    type="text"
                                    value={item.NombrePuntoMuestreo}
                                    readOnly
                                    />
                                </article>
                                <article> <p>HORA</p> <input type='time' value={datosFormulario[item.idMuestra]?.hora || ''} onChange={e => handleChange(item.idMuestra, 'hora', e.target.value)} /> </article>
                                
                            </div>
                            <div className={styles.divRecipientes}>
                                
                                <p className={styles.titleRec}>RECIPIENTES DE<br/>MUESTREO</p>

                                {['fq','gya','nh3','alcalinidad','dureza','hh','mb','otros'].map(campo => (

                                    <article className={styles.recipiente}>
                                        <article className={styles.nombreRec}><p>{[campo]}</p> </article>
                                        <input
                                        type="number"
                                        value={
                                            datosFormulario[item.idMuestra]?.recipientes[campo] === 0
                                            ? ''
                                            : datosFormulario[item.idMuestra]?.recipientes[campo] || ''
                                        }
                                        onChange={e => {
                                            const valor = e.target.value === '' ? 0 : Number(e.target.value);
                                            handleRecipienteChange(item.idMuestra, campo, valor);
                                        }}
                                        className={styles.inputTable}
                                        />
                                    </article>

                                    
                                ))}

                                
                            </div>
                    
                            <div className={styles.datosAnalisis}>
                                <div className={styles.analisis}>
                                    <article className={styles.articleAnalisis}>
                                        <p>COLOR</p>
                                        <textarea value={datosFormulario[item.idMuestra]?.observaciones.color || ''} onChange={e => handleObservacionChange(item.idMuestra, 'color', e.target.value)} />
                                        
                                    </article>
                                    <article className={styles.articleAnalisis}>
                                        <p>OLOR</p>
                                        <input
                                            type='checkbox'
                                            checked={datosFormulario[item.idMuestra]?.observaciones.olor || false}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'olor', e.target.checked)
                                            }
                                            className={styles.inputTable}
                                        />
                                    </article>
                                    <article className={styles.articleAnalisis}>
                                        <p>GASTO</p>
                                        <input
                                            type='number'
                                            value={datosFormulario[item.idMuestra]?.observaciones.gasto || ''}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'gasto', e.target.value)
                                            }
                                            className={styles.inputTable}
                                        />
                                    </article>
                                    <article className={styles.articleAnalisis}>
                                        <p>BURBUJA</p>
                                        <input
                                            type='checkbox'
                                            checked={datosFormulario[item.idMuestra]?.observaciones.burbuja || false}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'burbuja', e.target.checked)
                                            }
                                            className={styles.inputTable}
                                        />
                                    </article>
                                    <article className={styles.articleAnalisis}>
                                        <p>TRANSPARENCIA</p>
                                        <input
                                            type='number'
                                            value={datosFormulario[item.idMuestra]?.observaciones.transparencia || ''}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'transparencia', e.target.value)
                                            }
                                            className={styles.inputTable}
                                        />
                                    </article>
                                    
                                    <article className={styles.articleAnalisis}>
                                        <p>SDT</p>
                                        <input
                                            type='number'
                                            value={datosFormulario[item.idMuestra]?.observaciones.sdt || ''}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'sdt', e.target.value)
                                            }
                                            className={styles.inputTable}
                                        />
                                    </article>
                                    <article className={styles.articleAnalisis}>
                                        <p>MATERIAL FLOTANTE</p>
                                        <input
                                            type='checkbox'
                                            checked={datosFormulario[item.idMuestra]?.observaciones.materialFlotante || false}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'materialFlotante', e.target.checked)
                                            }
                                            className={styles.inputTable}
                                        />
                                        {datosFormulario[item.idMuestra]?.observaciones.materialFlotante === true && (
                                        <select
                                            value={datosFormulario[item.idMuestra]?.observaciones.valorMaterialFlotante || false}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'valorMaterialFlotante', e.target.value)
                                            }
                                            // className={styles.inputTable}
                                        >
                                            <option value="">Selecciona</option>
                                            <option value="1">AUSENCIA</option>
                                            <option value="2">PRESENCIA</option>
                                        </select>
                                        )}
                                        {datosFormulario[item.idMuestra]?.observaciones.materialFlotante === true && (
                                        <select
                                            value={datosFormulario[item.idMuestra]?.observaciones.tipoMaterialFlotante || false}
                                            onChange={e =>
                                            handleObservacionChange(item.idMuestra, 'tipoMaterialFlotante', e.target.value)
                                            }
                                            // className={styles.inputTable}
                                        >
                                            <option value="">Selecciona</option>
                                            <option value="1">VISIBLE</option>
                                            <option value="2">NORMA</option>
                                        </select>
                                        )}
                                    </article>
                                </div>
                                <div className={styles.datosTriples}>
                                    <article className={styles.articleDT}>
                                        <p>TEMPERATURA AGUA</p>
                                        <section className={styles.section_articleDT}>
                                            {datosFormulario[item.idMuestra]?.observaciones.tempAgua.map((val, i) => (
                                                <input
                                                key={i}
                                                type='number'
                                                placeholder={'DATO '+i}
                                                value={val}
                                                onChange={e => {
                                                    const nuevosValores = [...datosFormulario[item.idMuestra].observaciones.tempAgua];
                                                    nuevosValores[i] = e.target.value;
                                                    handleObservacionChange(item.idMuestra, 'tempAgua', nuevosValores);
                                                }}
                                                className={styles.inputTable}
                                                />
                                            ))}

                                            
                                            {(() => {
                                            const muestraData = datosFormulario[item.idMuestra];
                                            const observaciones = muestraData?.observaciones || {};

                                            const valores = observaciones.tempAgua || [];
                                            const numeros = valores
                                                .filter((v) => v !== '' && v !== null)
                                                .map((v) => parseFloat(v))
                                                .filter((v) => !isNaN(v));

                                            const promedio = numeros.length > 0
                                                ? numeros.reduce((a, b) => a + b, 0) / numeros.length
                                                : null;

                                            const termometro = termometroElegido[0] || {};
                                            const incertidumbrePorGrado = {
                                                10: parseFloat(termometro.incertidumbre_10) || 0,
                                                15: parseFloat(termometro.incertidumbre_15) || 0,
                                                25: parseFloat(termometro.incertidumbre_25) || 0,
                                                30: parseFloat(termometro.incertidumbre_30) || 0,
                                                35: parseFloat(termometro.incertidumbre_35) || 0,
                                                44: parseFloat(termometro.incertidumbre_44) || 0,
                                                50: parseFloat(termometro.incertidumbre_50) || 0
                                            };

                                            const { ajustado, redondeado, gradoCercano } = ajustarConIncertidumbre(
                                                promedio ?? NaN,
                                                incertidumbrePorGrado
                                            );

                                            const valorFinal = isNaN(redondeado) ? null : redondeado;

                                            if (muestraData && observaciones.tempAguaAjustado !== valorFinal) {
                                                setDatosFormulario(prev => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...(prev[item.idMuestra]?.observaciones || {}),
                                                            tempAguaAjustado: valorFinal,
                                                        },
                                                    },
                                                }));
                                            }

                                            // return (
                                            // <div className={styles.resultadoAjuste}>
                                            //     <p>Prom Agua: {isNaN(promedio) ? '—' : promedio.toFixed(2)}°C</p>
                                            //     <p>Ajustado ({gradoCercano}°C): {isNaN(ajustado) ? '—' : ajustado}</p>
                                            //     <p>Redondeado: {isNaN(redondeado) ? '—' : redondeado}</p>
                                            // </div>
                                            // );
                                        })()}

                                        </section>
                                    </article>
                                    <article className={styles.articleDT}>
                                        <p>TEMPERATURA AMBIENTE</p>
                                        <section className={styles.section_articleDT}>
                                            {datosFormulario[item.idMuestra]?.observaciones.tempAmb.map((val, i) => (
                                                <input
                                                    key={i}
                                                    type='number'
                                                    value={val}
                                                    onChange={e => {
                                                        const nuevosValores = [...datosFormulario[item.idMuestra].observaciones.tempAmb];
                                                        nuevosValores[i] = e.target.value;
                                                        handleObservacionChange(item.idMuestra, 'tempAmb', nuevosValores);
                                                    }}
                                                    className={styles.inputTable}
                                                />
                                            ))}

                                            
                                            {(() => {
                                            const muestraData = datosFormulario[item.idMuestra];
                                            const observaciones = muestraData?.observaciones || {};

                                            const valores = observaciones.tempAmb || [];
                                            const numeros = valores
                                                .filter((v) => v !== '' && v !== null)
                                                .map((v) => parseFloat(v))
                                                .filter((v) => !isNaN(v));

                                            const promedio = numeros.length > 0
                                                ? numeros.reduce((a, b) => a + b, 0) / numeros.length
                                                : null;

                                            const termometro = termometroElegido[0] || {};
                                            const incertidumbrePorGrado = {
                                                10: parseFloat(termometro.incertidumbre_10) || 0,
                                                15: parseFloat(termometro.incertidumbre_15) || 0,
                                                25: parseFloat(termometro.incertidumbre_25) || 0,
                                                30: parseFloat(termometro.incertidumbre_30) || 0,
                                                35: parseFloat(termometro.incertidumbre_35) || 0,
                                                44: parseFloat(termometro.incertidumbre_44) || 0,
                                                50: parseFloat(termometro.incertidumbre_50) || 0
                                            };

                                            const { ajustado, redondeado, gradoCercano } = ajustarConIncertidumbre(
                                                promedio ?? NaN,
                                                incertidumbrePorGrado
                                            );

                                            const valorFinal = isNaN(redondeado) ? null : redondeado;

                                            if (muestraData && observaciones.tempAmbAjustado !== valorFinal) {
                                                setDatosFormulario(prev => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...(prev[item.idMuestra]?.observaciones || {}),
                                                            tempAmbAjustado: valorFinal,
                                                        },
                                                    },
                                                }));
                                            }

                                            // return (
                                            //     <div className={styles.resultadoAjuste}>
                                            //         <p>Prom Amb: {isNaN(promedio) ? '—' : promedio.toFixed(2)}°C</p>
                                            //         <p>Ajustado ({gradoCercano}°C): {isNaN(ajustado) ? '—' : ajustado}</p>
                                            //         <p>Redondeado: {isNaN(redondeado) ? '—' : redondeado}</p>
                                            //     </div>
                                            // );
                                        })()}

                                        </section>
                                    </article>
                                    <article className={styles.articleDT}>
                                        <p>pH</p>
                                        <section className={styles.section_articleDT}>
                                            {datosFormulario[item.idMuestra]?.observaciones.ph.map((val, i) => (
                                                <input
                                                key={i}
                                                type="number"
                                                value={val}
                                                onChange={(e) => {
                                                    const nuevosValores = [...datosFormulario[item.idMuestra].observaciones.ph];
                                                    nuevosValores[i] = e.target.value;
                                                    handleObservacionChange(item.idMuestra, 'ph', nuevosValores);
                                                }}
                                                className={styles.inputTable}
                                                />
                                            ))}

                                            
                                            {(() => {
                                            const muestra = datosFormulario[item.idMuestra];
                                            const observaciones = muestra?.observaciones;

                                            if (!observaciones) return null;

                                            const phArray = observaciones.ph || [];

                                            const numerosPH = phArray
                                                .filter((v) => v !== '' && v !== null)
                                                .map(Number)
                                                .filter((v) => !isNaN(v));

                                            const promedioPH = numerosPH.length
                                                ? numerosPH.reduce((a, b) => a + b, 0) / numerosPH.length
                                                : null;

                                            const [v1, v2, v3] = numerosPH;
                                            const suma1 = v1 !== undefined ? Math.pow(v1 - promedioPH, 2) : 0;
                                            const suma2 = v2 !== undefined ? Math.pow(v2 - promedioPH, 2) : 0;
                                            const suma3 = v3 !== undefined ? Math.pow(v3 - promedioPH, 2) : 0;

                                            const variacionDatos = promedioPH !== null ? (suma1 + suma2 + suma3) / 2 : null;
                                            const desv = variacionDatos !== null ? Math.sqrt(variacionDatos) : null;
                                            const incert = desv !== null ? (desv / 1.73) * 4.3 : null;

                                            if (observaciones.phAjustado !== promedioPH) {
                                                setDatosFormulario((prev) => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            phAjustado: promedioPH,
                                                        },
                                                    },
                                                }));
                                            }

                                            if (observaciones.pH_incertidumbre !== incert) {
                                                setDatosFormulario((prev) => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            pH_incertidumbre: incert,
                                                        },
                                                    },
                                                }));
                                            }

                                            return (
                                                <div className={styles.resultadoAjuste}>
                                                    <p>PM: {promedioPH === null ? '—' : promedioPH.toFixed(2)}</p>
                                                    <p>± {incert === null ? '—' : incert.toFixed(2)}</p>
                                                </div>
                                            );
                                        })()}

                                        </section>
                                    </article>
                                    <article className={styles.articleDT}>
                                        <p>COND E</p>
                                        <section className={styles.section_articleDT}>
                                            {datosFormulario[item.idMuestra]?.observaciones?.condE?.map((val, i) => (
                                                <input
                                                key={i}
                                                type="number"
                                                value={val ?? ''}
                                                step="any"
                                                onChange={(e) => {
                                                    const nuevosValores = [...datosFormulario[item.idMuestra].observaciones.condE];
                                                    nuevosValores[i] = e.target.value === '' ? null : Number(e.target.value);
                                                    handleObservacionChange(item.idMuestra, 'condE', nuevosValores);
                                                }}
                                                className={styles.inputTable}
                                                />

                                            ))}

                                            
                                            {datosFormulario[item.idMuestra]?.observaciones?.condE && (() => {
                                            const condEArray = datosFormulario[item.idMuestra].observaciones.condE;
                                            const numerosCondE = condEArray
                                                .filter(v => v !== '' && v !== null)
                                                .map(Number)
                                                .filter((v) => !isNaN(v));

                                            let promedioCondE = NaN;
                                            let incertidumbre = NaN;

                                            if (numerosCondE.length > 0) {
                                                promedioCondE = numerosCondE.reduce((a, b) => a + b, 0) / numerosCondE.length;
                                                const [v1 = 0, v2 = 0, v3 = 0] = numerosCondE;
                                                const sumaVar =
                                                    (Math.pow(v1 - promedioCondE, 2) || 0) +
                                                    (Math.pow(v2 - promedioCondE, 2) || 0) +
                                                    (Math.pow(v3 - promedioCondE, 2) || 0);
                                                const variacion = sumaVar / 2;
                                                const desviacion = Math.sqrt(variacion);
                                                incertidumbre = (desviacion / 1.73) * 4.3;
                                            }

                                            setTimeout(() => {
                                                setDatosFormulario(prev => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            condEAjustado: isNaN(promedioCondE) ? null : promedioCondE,
                                                            condE_incertidumbre: isNaN(incertidumbre) ? null : incertidumbre,
                                                        },
                                                    },
                                                }));
                                            }, 0);

                                            return (
                                                <div className={styles.resultadoAjuste}>
                                                    <p>PM: {isNaN(promedioCondE) ? '—' : promedioCondE.toFixed(2)}</p>
                                                    <p>± {isNaN(incertidumbre) ? '—' : incertidumbre.toFixed(2)}</p>
                                                </div>
                                            );
                                        })()}

                                        </section>
                                    </article>
                                    <article className={styles.articleDT}>
                                        <p>OD %</p>
                                        <section className={styles.section_articleDT}>
                                            {datosFormulario[item.idMuestra]?.observaciones.od_porcentaje.map((val, i) => (
                                                <input
                                                key={`od-p-${i}`}
                                                type="number"
                                                step="any"
                                                value={val}
                                                onChange={(e) => {
                                                    const nuevosValores = [...datosFormulario[item.idMuestra].observaciones.od_porcentaje];
                                                    nuevosValores[i] = e.target.value;
                                                    handleObservacionChange(item.idMuestra, 'od_porcentaje', nuevosValores);
                                                }}
                                                className={styles.inputTable}
                                                />
                                            ))}
                                            {(() => {
                                            const muestra = datosFormulario[item.idMuestra];
                                            const observaciones = muestra?.observaciones;

                                            if (!observaciones) return null; // 🔐 Evita errores si observaciones no existe

                                            const odPorArray = observaciones.od_porcentaje || [];

                                            const numeros = odPorArray
                                                .filter((v) => v !== '' && v !== null)
                                                .map(Number)
                                                .filter((v) => !isNaN(v));

                                            const promedio = numeros.length
                                                ? numeros.reduce((a, b) => a + b, 0) / numeros.length
                                                : null;

                                            const [v1, v2, v3] = numeros;
                                            const varianza =
                                                numeros.length === 3 && promedio !== null
                                                    ? ((v1 - promedio) ** 2 + (v2 - promedio) ** 2 + (v3 - promedio) ** 2) / 2
                                                    : null;

                                            const desviacion = varianza !== null ? Math.sqrt(varianza) : null;
                                            const incertidumbre = desviacion !== null ? (desviacion / 1.73) * 4.3 : null;

                                            // Solo actualiza si es distinto al valor previo
                                            if (observaciones.od_PorcentajeAjustado !== promedio) {
                                                setDatosFormulario((prev) => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            od_PorcentajeAjustado: promedio,
                                                        },
                                                    },
                                                }));
                                            }

                                            if (observaciones.od_porcentaje_incertidumbre !== incertidumbre) {
                                                setDatosFormulario((prev) => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            od_porcentaje_incertidumbre: incertidumbre,
                                                        },
                                                    },
                                                }));
                                            }

                                            return (
                                                <div className={styles.resultadoAjuste}>
                                                    <p>PM: {promedio === null ? '—' : promedio.toFixed(2)}%</p>
                                                    <p>± {incertidumbre === null ? '—' : incertidumbre.toFixed(2)}%</p>
                                                </div>
                                            );
                                        })()}


                                        </section>
                                    </article>
                                    <article className={styles.articleDT}>
                                        <p>OD mg/L</p>
                                        <section className={styles.section_articleDT}>
                                            {datosFormulario[item.idMuestra]?.observaciones.od_ml.map((val, i) => (
                                                <input
                                                key={`od-ml-${i}`}
                                                type="number"
                                                step="any"
                                                value={val}
                                                onChange={(e) => {
                                                    const nuevosValores = [...datosFormulario[item.idMuestra].observaciones.od_ml];
                                                    nuevosValores[i] = e.target.value;
                                                    handleObservacionChange(item.idMuestra, 'od_ml', nuevosValores);
                                                }}
                                                className={styles.inputTable}
                                                />
                                            ))}
                                            {(() => {
                                            const muestra = datosFormulario[item.idMuestra];
                                            const observaciones = muestra?.observaciones;

                                            if (!observaciones) return null;

                                            const odMlArray = observaciones.od_ml || [];

                                            const numeros = odMlArray
                                                .filter((v) => v !== '' && v !== null)
                                                .map(Number)
                                                .filter((v) => !isNaN(v));

                                            const promedio = numeros.length
                                                ? numeros.reduce((a, b) => a + b, 0) / numeros.length
                                                : null;

                                            const [v1, v2, v3] = numeros;
                                            const varianza =
                                                numeros.length === 3 && promedio !== null
                                                    ? ((v1 - promedio) ** 2 + (v2 - promedio) ** 2 + (v3 - promedio) ** 2) / 2
                                                    : null;

                                            const desv = varianza !== null ? Math.sqrt(varianza) : null;
                                            const incertidumbre = desv !== null ? (desv / 1.73) * 4.3 : null;

                                            if (observaciones.od_MlAjustado !== promedio) {
                                                setDatosFormulario((prev) => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            od_MlAjustado: promedio,
                                                        },
                                                    },
                                                }));
                                            }

                                            if (observaciones.od_ml_incertidumbre !== incertidumbre) {
                                                setDatosFormulario((prev) => ({
                                                    ...prev,
                                                    [item.idMuestra]: {
                                                        ...prev[item.idMuestra],
                                                        observaciones: {
                                                            ...prev[item.idMuestra].observaciones,
                                                            od_ml_incertidumbre: incertidumbre,
                                                        },
                                                    },
                                                }));
                                            }

                                            // return (
                                            //     <div className={styles.resultadoAjuste}>
                                            //         <p>PM: {promedio === null ? '—' : promedio.toFixed(2)} ml/L</p>
                                            //         <p>± {incertidumbre === null ? '—' : incertidumbre.toFixed(2)} ml/L</p>
                                            //     </div>
                                            // );
                                        })()}

                                        </section>
                                    </article>
                                </div>
                            </div>
                           
                        </div>  
                    ))
                ) : (
                    <p>Información no disponible</p>
                )}

            </div> 
            <input className={styles.boton} onClick={verVistaPrevia}  type="submit" value={"GUARDAR"}/>
        </div>
    )
}

export default HCampo