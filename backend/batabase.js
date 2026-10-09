import mysql2 from 'mysql2'
import 'dotenv/config';

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

 

pool.getConnection((error, connection) => {
    if (error) {
        console.log('Error en la conexión a la base de datos:', error.message);
        return;
    }

    console.log('Conexión exitosa a la base de datos');
    connection.release();
});

export default pool;

// FUNCIONES PARA LOS ARCHIVOS
export async function registrarSolicitud(informacionGNL, puntosMuestreo) {
    console.log("Iniciando registrarSolicitud...");
     
    const {
        numeroSolicitud,
        nombreProyecto,
        // nombreLaboratorio,
        fechaSolicitud,
        semanaInicio,
        ejecucionMuestreo,
        tipoProyecto,
    } = informacionGNL;
    
    const Orden = null;
    const NpuntosMuestreo = parseInt(informacionGNL.puntosMuestreo, 10);

    console.log("Conectando a la base de datos...");
    const connection = await pool.getConnection();
    console.log("Conexión establecida");

    try {
      console.log("Iniciando transacción...");
      await connection.beginTransaction();
      console.log("Transacción iniciada");

      // Verificar si ya existe la solicitud
      const [rows] = await connection.query(
        `SELECT * FROM num_solicitudes WHERE numSolicitud = ?`,
        [numeroSolicitud]
      );

      if (rows.length > 0) {
        // ✅ Ya existe, solo insertar nuevo proyecto
        console.log("Solicitud ya existe, se insertará un nuevo proyecto.");
        // Paso 1: buscar el último idProyecto registrado con ese número de solicitud
        // Paso 1: buscar el último idProyecto con ese número de solicitud
        const [result] = await connection.query(
          `SELECT idProyecto FROM solicitud_trabajo WHERE numSolicitud = ? ORDER BY idProyecto DESC LIMIT 1`,
          [numeroSolicitud]
        );

        // Paso 2: construir el nuevo idProyecto
        let nuevoIdProyecto = '';

        if (result.length > 0) {
          const ultimoIdProyecto = result[0].idProyecto; // Ej: '001-25-1'
          const partes = ultimoIdProyecto.split('-');    // ['001', '25', '1']
          
          let nuevoNumero = 1;

          if (partes.length === 3) {
            nuevoNumero = parseInt(partes[2]) + 1;
          } else {
            // En caso el anterior fue mal guardado como '001-25', forzamos a 2
            nuevoNumero = 2;
          }

          nuevoIdProyecto = `${partes[0]}-${partes[1]}-${nuevoNumero}`;
        } else {
          // Primer proyecto para esta solicitud
          const partes = numeroSolicitud.split('-');
          if (partes.length === 2) {
            nuevoIdProyecto = `${partes[0]}-${partes[1]}-1`;
          } else {
            nuevoIdProyecto = `001-${numeroSolicitud}-1`;
          }
        }


        await connection.query(
          `INSERT INTO solicitud_trabajo(numSolicitud, nombreProyecto, idProyecto, dateInicial, num_Muestras, Id_datoGnl, idTipoProyecto, idStatus)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [numeroSolicitud, nombreProyecto, nuevoIdProyecto, semanaInicio, NpuntosMuestreo, '1', tipoProyecto , '1']
        );


        console.log("solicitud_trabajo insertado");

        const [muestraRows] = await connection.query(
          `SELECT idMuestra FROM puntosmuestreo WHERE idProyecto = ? ORDER BY idMuestra DESC LIMIT 1`,
          [nuevoIdProyecto]
        );

        let ultimoNumeroMuestra = 0;

        if (muestraRows.length > 0) {
          const ultimoIdMuestra = muestraRows[0].idMuestra; // Ej: '001-25-1-3'
          const partes = ultimoIdMuestra.split('-');
          const posibleNumero = parseInt(partes[partes.length - 1]);
          if (!isNaN(posibleNumero)) {
            ultimoNumeroMuestra = posibleNumero;
          }
        }

        // 🔁 Insertar puntos de muestreo y muestras_solicitud
        for (let i = 0; i < puntosMuestreo.length; i++) {
          const punto = puntosMuestreo[i];
          const nuevoNumeroMuestra = ultimoNumeroMuestra + i + 1;
          const idMuestra = `${nuevoIdProyecto}-${nuevoNumeroMuestra}`;

          // Insertar en puntosmuestreo
          await connection.query(
            `INSERT INTO puntosmuestreo(idProyecto, idMuestra, NombrePuntoMuestreo)
            VALUES (?, ?, ?)`,
            [nuevoIdProyecto, idMuestra, punto.nombre]
          );
          console.log(`puntosmuestreo insertado: ${punto.nombre}`);

          // Insertar parámetros asociados
          for (let j = 0; j < punto.parametros.length; j++) {
            const parametro = punto.parametros[j];

            await connection.query(
              `INSERT INTO muestras_solicitud(idMuestra, idParametro, cantidadParametro, siglasMostrador, dateMuestreo)
              VALUES (?, ?, ?, ?, ?)`,
              [idMuestra, parametro.idParametro, parametro.cantidad, null, null]
            );

            console.log(`Insertado: ${idMuestra} - Param: ${parametro.idParametro}`);
          }

          console.log(`Muestra registrada: ${punto.nombre}`);
        }

      } else {
        // 🚨 No existe aún: insertar todo desde cero
        console.log("Solicitud no existe, se registrará desde cero.");

        await connection.query(
          `INSERT INTO num_solicitudes(numSolicitud, status_solicitud, estado_solicitud)
          VALUES (?, ?, ?)`,
          [numeroSolicitud, '1', '1']
        );
        console.log("num_solicitudes insertado");

        await connection.query(
          `INSERT INTO datos_solicitudes(numSolicitud, fechaSolicitud, fechaOrden, Ejecucion_muestreo)
          VALUES (?, ?, ?, ?)`,
          [numeroSolicitud, fechaSolicitud, Orden, ejecucionMuestreo]
        );
        console.log("datos_solicitudes insertado");

        await connection.query(
          `INSERT INTO solicitud_trabajo(numSolicitud, nombreProyecto, idProyecto, dateInicial, num_Muestras, Id_datoGnl, idTipoProyecto, idStatus)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [numeroSolicitud, nombreProyecto, numeroSolicitud+"-1", semanaInicio, NpuntosMuestreo, '1', tipoProyecto, '1']
        );
        console.log("solicitud_trabajo insertado");

        for (let i = 0; i < puntosMuestreo.length; i++) {
          const punto = puntosMuestreo[i];
          const idMuestra = `${numeroSolicitud}-1-${i + 1}`;

          await connection.query(
            `INSERT INTO puntosmuestreo(idProyecto, idMuestra, NombrePuntoMuestreo)
            VALUES (?, ?, ?)`,
            [numeroSolicitud + "-1", idMuestra, punto.nombre]
          );
          console.log(`puntosmuestreo insertado: ${punto.nombre}`);
        }

        for (let i = 0; i < puntosMuestreo.length; i++) {
          const punto = puntosMuestreo[i];
          const idMuestra = `${numeroSolicitud}-1-${i + 1}`;

          for (let j = 0; j < punto.parametros.length; j++) {
            const parametro = punto.parametros[j];

            await connection.query(
              `INSERT INTO muestras_solicitud(idMuestra, idParametro, cantidadParametro, siglasMostrador, dateMuestreo)
              VALUES (?, ?, ?, ?, ?)`,
              [idMuestra, parametro.idParametro, parametro.cantidad, null, null]
            );

            console.log(`Insertado: ${idMuestra} - Param: ${parametro.idParametro}`);
          }

          console.log(`Muestra registrada: ${punto.nombre}`);
        }

      }

      await connection.commit();
      console.log("Transacción completada con éxito");
      return { success: true, message: "Datos registrados correctamente" };

      
    } catch (error) {
        await connection.rollback();
        console.error("Error al registrar solicitud:", error);
        
        return { success: false, error: error.message || "Error desconocido" };
    } finally {
        connection.release();
    }
}

export async function extraerEtiquetas(numSolicitud) {
    const conn = await pool.getConnection();
    try {

      // Paso 1: obtener muestras
      const [rows] = await conn.query(`
        SELECT st.*, pm.*, ms.* 
        FROM solicitud_trabajo st
        INNER JOIN puntosmuestreo pm ON st.idProyecto = pm.idProyecto
        INNER JOIN muestras_solicitud ms ON pm.idMuestra = ms.idMuestra
        WHERE st.numSolicitud = ?
      `, [numSolicitud]);
  
      const arrayInformacion = rows.map(row => ({
        idProyecto: row.idProyecto,
        nombre: row.NombrePuntoMuestreo,
        isMuestra: row.idMuestra,
        idparametro: row.idParametro,
      }));
  
      // Paso 2: agrupar parámetros por muestra
      const agrupados = {};
  
      for (const info of arrayInformacion) {
        const [paramRows] = await conn.query(
          'SELECT * FROM parametros WHERE idParametro = ?',
          [info.idparametro]
        );
  
        for (const fila of paramRows) {
          const idMuestra = info.isMuestra;
          if (!agrupados[idMuestra]) {
            agrupados[idMuestra] = {
              Proyecto: info.idProyecto,
              nombrePuntoMuestreo: info.nombre,
              Muestra: idMuestra,
              parametros: [],
              tiposParametro: [],
            };
          }
  
          if (!agrupados[idMuestra].tiposParametro.includes(fila.idtipoParametro)) {
            agrupados[idMuestra].tiposParametro.push(fila.idtipoParametro);
          }
  
          agrupados[idMuestra].parametros.push(info.idparametro);
        }
      }
  
      const arrayInformacionNEW = Object.values(agrupados);
  
      // Paso 3: buscar tipo de parámetro y recipientes
      const infoEtiquetas = [];
  
      for (const datosMuestra of arrayInformacionNEW) {
        for (const parametro of datosMuestra.parametros) {
          const [rows] = await conn.query(`
            SELECT tp.*, tc.*, pr.*
            FROM parametros pr
            INNER JOIN tipo_parametro tp ON tp.idTipoParametro = pr.idtipoParametro
            INNER JOIN table_conservadores tc ON tp.idConservador = tc.idConservador
            WHERE pr.idParametro = ?
          `, [parametro]);
  
          for (const row of rows) {
            infoEtiquetas.push({
              idMuestra: datosMuestra.Muestra,
              idParametro: row.idParametro,
              nombre: datosMuestra.nombrePuntoMuestreo,
              tipoPara: row.idTipoParametro,
              nombrePara: row.nombreParametro,
              conservador: row.name_conservador,
              recipientes: row.Nom_rec,
            });
          }
        }
      }
  
      // Paso 4: agrupar etiquetas por tipo de parámetro
      const nombresParametros = {};
  
      for (const info of infoEtiquetas) {
        const { idMuestra, idParametro, nombre, tipoPara, nombrePara, conservador, recipientes } = info;
  
        if (!nombresParametros[idMuestra]) nombresParametros[idMuestra] = {};
        if (!nombresParametros[idMuestra][tipoPara]) {
          nombresParametros[idMuestra][tipoPara] = {
            muestra: idMuestra,
            idParametro: [idParametro],
            puntoMuestreo: nombre,
            nombres: [nombrePara],
            conservador,
            recipiente: recipientes,
          };
        } else {
          nombresParametros[idMuestra][tipoPara].idParametro.push(idParametro);
          nombresParametros[idMuestra][tipoPara].nombres.push(nombrePara);
        }
      }
  
      // Paso 5: generar array final 
      const etiquetas = [];
  
      for (const tipos of Object.values(nombresParametros)) {
        for (const detalles of Object.values(tipos)) {
          etiquetas.push({
            idMuestra: detalles.muestra,
            nombre: detalles.puntoMuestreo,
            conservador: detalles.conservador,
            recipientes: detalles.recipiente,
            nombres: detalles.nombres,
            idparametros: detalles.idParametro,
          });
        }
      }
  
      return etiquetas;
    } finally {
      conn.release();
    }
}
  
export async function guardarMatSolicitud(numSolicitud,idMateriales){
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < idMateriales.length; i++) {
      const { idMaterial, cantidad } = idMateriales[i]; // <- extraes bien aquí

      // console.log("material: "+idMaterial+" cantidad: "+cantidad);

      await connection.query(
        `INSERT INTO material_laboratorio(numSolicitud, idMaterial, cantidad_antesMuestreo, cantidad_despuesMuestreo, Observaciones) VALUES (?, ?, ?, ?, ?)`,
        [numSolicitud, idMaterial, cantidad, null, null]
      );
    }

    await connection.commit();

    return { success: true, message: "Datos registrados correctamente" };






  } catch (error) {
      await connection.rollback();
      console.error("Error al registrar solicitud:", error);
      
      return { success: false, error: error.message || "Error desconocido" };
  } finally {
      connection.release();
  }
}
export async function insertDescCustodia(solicitud, idProyecto, resultados, informacionGneral, estadoContenedores) {
  const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        muestrador,
        NombreEntrega,
        NombreReceptor,
        fechaEntrega,
        fechaReceptor,
        horaEntrega,
        horaReceptor,
        observaciones,
        parametrosFueraTiempo,
      } = informacionGneral;

      for (const muestra of resultados) {
          const {
              idMuestra,
              fecha,
              hora,
              idTipoAgua,
              idMatriz,
              contenedores 
          } = muestra;

          // Insertar en desccustodia_externa
          await connection.query(
              `INSERT INTO desccustodia_externa(idMuestra, idTipo_agua, idMatriz, fecha, hora)
              VALUES (?, ?, ?, ?, ?)`,
              [idMuestra, idTipoAgua, idMatriz, fecha, hora]
          );

          // Insertar en custodia_externa (por cada contenedor)
          for (const contenedor of contenedores) {
            const { nombre, cantidad } = contenedor;

            // Obtener ID del contenedor desde la tabla tipo_parametro
            const [rows] = await connection.query(
              `SELECT idTipoParametro FROM tipo_parametro WHERE UPPER(Nom_rec) = ?`,
              [nombre.toUpperCase()]
            );

            if (rows.length === 0) {
              console.warn(`Contenedor desconocido: ${nombre}`);
              continue;
            }

            const idContenedor = rows[0].idTipoParametro;

            // Buscar estado del contenedor en estadoContenedores
            const estado = estadoContenedores.find(ec => ec.nombre.toUpperCase() === nombre.toUpperCase());

            if (!estado) {
              console.warn(`No se encontró estado para el contenedor: ${nombre}`);
              continue;
            }

            const reactivos = estado.conservacion ? 1 : 0;
            const hielo = estado.hielo ? 1 : 0;
            const ph = estado.phAdecuado ? 1 : 0;

            // Insertar en custodia_externa
            await connection.query(
              `INSERT INTO custodia_externa (idMuestra, idContenedor, cantidad_recipiente, reactivos, Hielo, pH)
              VALUES (?, ?, ?, ?, ?, ?)`,
              [idMuestra, idContenedor, cantidad, reactivos, hielo, ph]
            );
          }

 
      }

      await connection.query(
        `INSERT INTO datos_gnl_custodiaexterna(idProyecto, Muestrador, Observaciones, Parametros_fuera_tiempo, nombre_entrega,
         fecha_entrega, hora_entrega, nombre_receptor, fecha_receptor, hora_receptor)
         VALUES(?,?,?,?,?,?,?,?,?,?)`,
         [idProyecto,muestrador,observaciones,parametrosFueraTiempo,NombreEntrega,fechaEntrega,horaEntrega,NombreReceptor,fechaReceptor,horaReceptor]
      )

      // Actualizar fecha de orden y estado de solicitud
      await connection.query(
          `UPDATE solicitud_trabajo SET idStatus = ? WHERE idProyecto = ?`,
          ['5',idProyecto]
      );

      await connection.commit();
      console.log("Transacción completada con éxito");
  } catch (error) {
      await connection.rollback();
      console.error("Error al registrar custodia externa:", error);
  } finally {
      connection.release();
  }

}


export async function insertar_hoja_campo(termometroElegido, datosFormulario, informacionGeneral, proyecto) {
  const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
          tipoNorma,
          fechaMuestreo,
          fechaRecepcion,
          horaRecepcion,
          muestrador,
          receptor,
          tipoAgua,
          finalidad,
      } = informacionGeneral;

      await connection.query(
          `INSERT INTO desc_hoja_muestra(idProyecto,fechaMuestreo, fechaRecepcion, horaRecepcion, idMuestrador, idReceptor, idTipo, idFinalidad, claveTermometro,idNorma)
          VALUES (?, ?, ?, ?, ?,?,?,?,?,?)`,
          [proyecto, fechaMuestreo, fechaRecepcion, horaRecepcion, muestrador ,receptor, tipoAgua, finalidad, termometroElegido, tipoNorma ]
      );

      

      for (const [idMuestra, datos] of Object.entries(datosFormulario)) {
        const {
          numero,
          hora,
          observaciones: {
            color,
            olor,
            gasto,
            burbuja,
            transparencia,
            materialFlotante,
            valorMaterialFlotante,
            tipoMaterialFlotante,
            tempAgua,
            tempAmb,
            ph,
            pH_incertidumbre,
            condE,
            condEAjustado,
            condE_incertidumbre,
            sdt,
            od_porcentaje,
            od_ml,
            od_PorcentajeAjustado,
            od_porcentaje_incertidumbre,
            od_MlAjustado,
            od_ml_incertidumbre,
            phAjustado,
            tempAguaAjustado,
            tempAmbAjustado,
          },
          recipientes: {
            fq,
            gya,
            nh3,
            alcalinidad,
            dureza,
            hh,
            mb,
            otros
          }
        } = datos;


         

        await connection.query(
          `INSERT INTO table_muestras (
            idMuestra, NoMuestra, hora, color, olor, gasto, burbuja, transparencia, material_flotante,tipo_material_flotante, tempAgua, tempAmb, pH, pH_incertidumbre,
            COND_E, condE_incertidumbre, SDT, OD_PORCENT, OD_porcent_incertidumbre, OD_ML, OD_ml_incertidumbre, FQ, GYA, NH3, Alcalinidad, Dureza, H_H, MB, OTROS
          ) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            idMuestra,
            numero,
            hora,
            color || null,
            olor || 0,
            gasto || null,
            burbuja || 0,
            transparencia || null,
            valorMaterialFlotante || 0,
            tipoMaterialFlotante,
            tempAguaAjustado,
            tempAmbAjustado,
            phAjustado,
            pH_incertidumbre,
            condEAjustado,
            condE_incertidumbre,
            sdt || null,
            od_PorcentajeAjustado,
            od_porcentaje_incertidumbre,
            od_MlAjustado,
            od_ml_incertidumbre,
            fq,
            gya,
            nh3,
            alcalinidad,
            dureza,
            hh,
            mb,
            otros
          ]
        );

        // console.log(datos);
      }

      await connection.query(
          `UPDATE solicitud_trabajo SET idStatus = ? WHERE idProyecto = ?`,
          ['6',proyecto]
      );

      // Actualizar fecha de orden y estado de solicitud
      // await connection.query(
      //     `UPDATE num_solicitudes SET status_solicitud = '6' WHERE numSolicitud = ?`,
      //     [solicitud]
      // );

      await connection.commit();
      console.log("Transacción completada con éxito");
  } catch (error) {
      await connection.rollback();
      console.error("Error al registrar custodia externa:", error);
  } finally {
      connection.release();
  }
}



// actualizar dato de orden
export async function actualizarOrden(numSolicitud,fechaOrden){

    const solicitud = numSolicitud;
    const fecha = fechaOrden;
    console.log("Transacción iniciando");
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE datos_solicitudes SET fechaOrden = ? WHERE numSolicitud = ?`,
            [fecha,solicitud]
        );

        await connection.query(
            `UPDATE num_solicitudes SET status_solicitud = ? WHERE numSolicitud = ?`,
            ['2',solicitud]
        );
        
        await connection.commit();
        console.log("Transacción completada con éxito");

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
    
}

export async function desactivarSolicitud(solicitud){

    const numSolicitud = solicitud;
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE num_solicitudes SET estado_solicitud = ? WHERE numSolicitud = ?`,
            ['2',numSolicitud]
        );
        
        await connection.commit();

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
    
}

export async function activarSolicitud(solicitud){

    const numSolicitud = solicitud;
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE num_solicitudes SET estado_solicitud = ? WHERE numSolicitud = ?`,
            ['1',numSolicitud]
        );
        
        await connection.commit();

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
    
}

export async function actualizarMuestras(numSolicitud, Muestras) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < Muestras.length; i++) {
      const { idMuestra, idparametros, fecha, muestrador } = Muestras[i];

      // Asegurar que los parámetros estén en formato de arreglo
      let parametros = [];

      if (typeof idparametros === 'string') {
        parametros = idparametros.split(',').map(p => p.trim());
      } else if (Array.isArray(idparametros)) {
        parametros = idparametros.map(p => p.toString().trim());
      } else {
        throw new Error(`Formato de idparametros no reconocido para la muestra ${idMuestra}`);
      }

      console.log("solicitud: " + numSolicitud);

      for (const idParametro of parametros) {
        await connection.query(
          `UPDATE muestras_solicitud SET siglasMostrador = ?, dateMuestreo = ? WHERE idMuestra = ? AND idParametro = ?`,
          [muestrador, fecha, idMuestra, idParametro]
        );
        console.log(`Muestra actualizada: ${idMuestra} - Param: ${idParametro} - Fecha: ${fecha} - Muestrador: ${muestrador}`);
      }
    }

    await connection.query(
      `UPDATE num_solicitudes SET status_solicitud = ? WHERE numSolicitud = ?`,
      ['3', numSolicitud]
    );

    await connection.commit();
    return { success: true, message: "Datos registrados correctamente" };

  } catch (error) {
    await connection.rollback();
    console.error("Error al registrar solicitud:", error);
    return { success: false, error: error.message || "Error desconocido" };
  } finally {
    connection.release();
  }
}


export async function registrarMaterialMuestreo(numSolicitud, Materiales) {
  const connection = await pool.getConnection(); // ← ESTA LÍNEA ES CLAVE

  try {
    await connection.beginTransaction();

    for (const [idMuestra, datos] of Object.entries(Materiales)) {
      const { idMaterial, cantidad } = datos;

      await connection.query(
        `INSERT INTO material_laboratorio(numSolicitud, idMaterial, cantidad_antesMuestreo) VALUES (?, ?, ?)`,
        [numSolicitud, idMaterial, cantidad]
      );
    }

    // Actualizar fecha de orden y estado de solicitud
    await connection.query(
      `UPDATE num_solicitudes SET status_solicitud = ? WHERE numSolicitud = ?`,
      ['4', numSolicitud]
    );

    await connection.query(
      `UPDATE solicitud_trabajo SET idStatus = ? WHERE numSolicitud = ?`,
      ['4', numSolicitud]
    );

    await connection.commit();
    console.log("Transacción completada con éxito");
  } catch (error) {
    await connection.rollback();
    console.error("Error al registrar custodia externa:", error);
  } finally {
    connection.release();
  }
}

export async function actualizarTermometro(informacionGeneral,idTermometro){
    
    const {
      dato_10,
      dato_15,
      dato_25,
      dato_30,
      dato_35,
      dato_44,
      dato_50
    } = informacionGeneral;
    const connection = await pool.getConnection();

    console.log(idTermometro,dato_10,dato_15,dato_25,dato_30,dato_35,dato_44,dato_50);

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE table_termometro SET incertidumbre_10 = ? ,incertidumbre_15 = ? ,incertidumbre_25 = ?,
            incertidumbre_30 = ?,incertidumbre_35 = ?,incertidumbre_44 = ?,incertidumbre_50 = ?  WHERE idTermometro = ?`,
            [
              dato_10 || null,
              dato_15 || null,
              dato_25 || null,
              dato_30 || null,
              dato_35 || null,
              dato_44 || null,
              dato_50 || null,
              idTermometro
            ]
        );


        
        await connection.commit();
        console.log("Transacción completada con éxito");

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
    
}

export async function buscarUsuario(usuarioSeleccionado , password) {
  const [usuarios] = await pool.query(`SELECT * FROM usuarios WHERE clvUsuario = ?`, [usuarioSeleccionado]);

  if (usuarios.length === 0) return false;

  const [coincidencia] = await pool.query(
    `SELECT * FROM usuarios WHERE clvUsuario = ? AND passUsuario = ?`,
    [usuarioSeleccionado, password]
  );

  return coincidencia.length > 0 ? coincidencia[0] : null; // true si la combinación es válida
}

export async function desactivarParametro(parametro){

    const idParametro = parametro;
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE parametros SET id_estado = ? WHERE idParametro = ?`,
            ['2',idParametro]
        );
        
        await connection.commit();

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
    
}

export async function activarParametro(parametro){

    const idParametro = parametro;
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE parametros SET id_estado = ? WHERE idParametro = ?`,
            ['1',idParametro]
        );
        
        await connection.commit();

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
    
}

export async function activarUsuarios(usuario){
    const idUsuario = usuario;
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE usuarios SET id_estado = ? WHERE idUsuario = ?`,
            ['1',idUsuario]
        );
        
        await connection.commit();

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
}

export async function desactivarUsuarios(usuario){
  const idUsuario = usuario;
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        await connection.query(
            `UPDATE usuarios SET id_estado = ? WHERE idUsuario = ?`,
            ['2',idUsuario]
        );
        
        await connection.commit();

    }catch(err){
        await connection.rollback();
        console.error("Error al actualizar datos:", error);
    }finally {
        connection.release();
    }
}



// OBTENER LISTAS DE DATOS

export async function extraerParametros(){
    const [rows] = await pool.query(`SELECT * FROM parametros`);
    return rows;
}

export async function extraerParametrosActivos(){
    const [rows] = await pool.query(`SELECT * FROM parametros WHERE id_estado = ?`,["1"]);
    return rows;
}

export async function extraerSolicitudes(){
    const [rows] = await pool.query(
      `SELECT * FROM num_solicitudes WHERE status_solicitud = '1'`);
    return rows;
}

export async function borrarSolicitud(solicitud){
    const [rows] = await pool.query(
      `DELETE FROM num_solicitudes WHERE numSolicitud = ? AND status_solicitud = ?`,[solicitud,"1"]);
    return rows;
}



export async function extraerSolicitud2(){
    const [rows] = await pool.query(`SELECT * FROM num_solicitudes WHERE status_solicitud = '2'`);
    return rows;
}

export async function extraerSolicitud3(){
  const [rows] = await pool.query(`SELECT * FROM num_solicitudes WHERE status_solicitud = '3'`);
  return rows;
}
export async function extraerSolicitud4(){
  const [rows] = await pool.query(`SELECT * FROM num_solicitudes WHERE status_solicitud = '4'`);
  return rows;
}
export async function extraerSolicitud5(){
  const [rows] = await pool.query(`SELECT * FROM num_solicitudes WHERE status_solicitud = '5'`);
  return rows;
}

export async function extraerProyectos(numero) {
  // console.log("buscar nuemro"+numero);
  const [rows] = await pool.query(
    `SELECT * FROM solicitud_trabajo WHERE numSolicitud = ? AND idStatus = 4`, 
    [numero] // Aquí pasamos el número de solicitud como parámetro
  );
  return rows;
  
}

export async function extraerProyectosArchivos(numero) {
  // console.log("buscar nuemro"+numero);
  const [rows] = await pool.query(
    `SELECT * FROM solicitud_trabajo WHERE numSolicitud = ?`, 
    [numero] // Aquí pasamos el número de solicitud como parámetro
  );
  return rows;
  
}

export async function extraerProyectosHCampo(numero) {
  // console.log("buscar nuemro"+numero);
  const [rows] = await pool.query(
    `SELECT * FROM solicitud_trabajo WHERE numSolicitud = ? AND idStatus = 5`, 
    [numero] // Aquí pasamos el número de solicitud como parámetro
  );
  return rows;
  
}

export async function extraerPuntosMuestreo(numeroProyecto) {
  // Paso 1: obtener muestras y puntos de muestreo
  const [rows] = await pool.query(
    `SELECT s.*, p.*, ms.*, pr.idParametro, tp.idTipoParametro, tp.Nom_rec
     FROM solicitud_trabajo s
     INNER JOIN puntosmuestreo p ON s.idProyecto = p.idProyecto
     INNER JOIN muestras_solicitud ms ON p.idMuestra = ms.idMuestra
     INNER JOIN parametros pr ON pr.idParametro = ms.idParametro
     INNER JOIN tipo_parametro tp ON tp.idTipoParametro = pr.idtipoParametro
     INNER JOIN table_conservadores tc ON tc.idConservador = tp.idConservador
     WHERE s.idProyecto = ?`,
    [numeroProyecto] 
  );

  // Paso 2: agrupar contenedores por muestra
  const agrupadoPorMuestra = {};
  const contenedoresSet = new Set(); // <- Aquí guardamos los contenedores únicos

  for (const row of rows) {
    const idMuestra = row.idMuestra;
    const nomRec = row.Nom_rec;

    if (!agrupadoPorMuestra[idMuestra]) {
      agrupadoPorMuestra[idMuestra] = {
        idMuestra,
        puntoMuestreo: row.NombrePuntoMuestreo,
        contenedores: new Set(),
      };
    }

    agrupadoPorMuestra[idMuestra].contenedores.add(nomRec);
    contenedoresSet.add(nomRec); // <- Añadir al set global
  }

  // Paso 3: convertir sets a arrays
  const resumenContenedores = Object.values(agrupadoPorMuestra).map(item => ({
    idMuestra: item.idMuestra,
    puntoMuestreo: item.puntoMuestreo,
    contenedores: Array.from(item.contenedores),
  }));

  const contenedoresGnl = Array.from(contenedoresSet); // <- Array general sin duplicados

  return { resumenContenedores, contenedoresGnl };
}

export async function extraerPuntosCE(numProyecto) {
  // Paso 1: obtener muestras y puntos de muestreo
  const [rows] = await pool.query(
    `SELECT dgce.*, dce.*, st.*
     FROM datos_gnl_custodiaexterna dgce
     INNER JOIN puntosmuestreo st ON st.idProyecto = dgce.idProyecto
     INNER JOIN desccustodia_externa dce ON dce.idMuestra = st.idMuestra
     WHERE dgce.idProyecto = ?`,
    [numProyecto]
  );


  return rows;
  
}




export async function extraerAllSolicitudes(){
    const [rows] = await pool.query(`SELECT * FROM num_solicitudes WHERE estado_solicitud = 1`);
    return rows;
}

export async function extraerSolicitudesDesactivadas(){
    const [rows] = await pool.query(`SELECT * FROM num_solicitudes WHERE estado_solicitud = 2`);
    return rows;
}



// LISTAS Y LISTAS DE REGISTROS

export async function extraerAlmacen() {
  const [rows] = await pool.query(`
    SELECT 
    a.idMaterial, 
    a.tipoMaterial, 
    a.nombreMaterial, 
    a.descMaterial, 
    a.cantidadMaterial,
    t.nombreTipo
  FROM almacen_laboratorio a
  JOIN tipomaterial t ON a.tipoMaterial = t.tipoMaterial
  ORDER BY a.tipoMaterial

  `);
  return rows;
}


export async function extraerTipo() {
  const [rows] = await pool.query(`SELECT * FROM tipoagua`);
  return rows; 
}

export async function extraerFinalidad() {
  const [rows] = await pool.query(`SELECT * FROM tipofinalidad`);
  return rows;
}

export async function extraerEstudio() {
  const [rows] = await pool.query(`SELECT * FROM tipoestudio`);
  return rows;
}

export async function extraerUsuarios(){
  const [rows] = await pool.query(`SELECT * FROM usuarios`);
  return rows;
}

export async function extraerUsuariosActivos(){
  const [rows] = await pool.query(`SELECT * FROM usuarios WHERE id_estado = ?`,["1"]);
  return rows;
}



export async function extraerTermometros(){
  const [rows] = await pool.query(`SELECT * FROM table_termometro`);
  return rows;
}

export async function extraerTermometrosPorNumero(numero){
  const [rows] = await pool.query(`SELECT * FROM table_termometro WHERE idTermometro = ?`,[numero]);
  return rows;
}

// LISTAS DE REGISTROS
 
export async function extraerTipoMaterial() {
  const [rows] = await pool.query(`SELECT * FROM tipomaterial`);
  return rows;
}

export async function extraerTipoMatriz() {
  const [row] = await pool.query(`SELECT * FROM tipomatriz`);
  return row;
}

export async function extraerConservadores() {
  const [row] = await pool.query(`SELECT * FROM table_conservadores`);
  return row;
}

export async function extraerTipoParametro() {
  const [row] = await pool.query(`SELECT * FROM tipo_parametro`);
  return row;
}

export async function extraerNorma() {
  const [row] = await pool.query(`SELECT * FROM table_norma`);
  return row;
}