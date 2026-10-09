import { useState } from 'react'
import React from 'react'
import styles from './Mensaje.module.css'
import {FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { IoIosInformationCircle , IoIosWarning } from "react-icons/io";

const Mensaje = () => {

    const tipo = {
        error: "ERROR AL REALIZAR ACCIÓN",
        exito: "ACCIÓN REALIZADA CON ÉXITO",
        warning: "FALTAN DATOS POR INGRESAR",
        info: "HAY DATOS FALTANTES"
    };

    const iconos = {
        error: <FaCircleExclamation style={{ height: '25px', width: '25px', marginTop: "5px" }} />,
        exito: <FaCircleCheck style={{ height: '25px', width: '25px', marginTop: "5px" }} />,
        warning: <IoIosWarning style={{ height: '25px', width: '25px', marginTop: "5px" }} />,
        info: <IoIosInformationCircle style={{ height: '25px', width: '25px', marginTop: "5px" }} />
    };

    const [estilo, setEstilo] = useState('');
    const [textMensaje, setTextMensaje] = useState('');
    const [icono, setIcono] = useState(null);

    const mensaje = (tipoMensaje) => {
        if (tipo[tipoMensaje]) {
        setTextMensaje(tipo[tipoMensaje]);
        setIcono(iconos[tipoMensaje]);

        switch (tipoMensaje) {
            case "error":
            setEstilo("bodyMensaje");
            break;
            case "exito":
            setEstilo("bodyMensajeSuccefull");
            break;
            case "warning":
            setEstilo("bodyMensajeAdvertencia");
            break;
            case "info":
            setEstilo("bodyMensajeInformation");
            break;
            default:
            setEstilo("");
        }
        } else {
        setTextMensaje("TIPO DE MENSAJE NO RECONOCIDO");
        setEstilo("bodyMensaje");
        setIcono(null);
        }
    };
  return (
    <div>
      <button onClick={() => mensaje("error")}>Ver mensaje error</button>
      <button onClick={() => mensaje("exito")}>Ver mensaje éxito</button>
      <button onClick={() => mensaje("warning")}>Ver mensaje advertencia</button>
      <button onClick={() => mensaje("info")}>Ver mensaje información</button>

      {textMensaje && (
        <div className={styles[estilo]}>
          <article>{icono}</article>
          <article><p className={styles.mensajeText}>{textMensaje}</p></article>
        </div>
      )}
    </div>
  )
}

export default Mensaje