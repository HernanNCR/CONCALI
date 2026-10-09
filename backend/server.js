import express from 'express';
import cors from 'cors'
import { actualizarMuestras , extraerAlmacen , borrarSolicitud,  extraerEtiquetas , extraerSolicitud3 , 
    extraerSolicitud2, extraerSolicitud4 ,registrarSolicitud, extraerParametros, extraerSolicitudes, actualizarOrden, 
    extraerAllSolicitudes, extraerProyectos, extraerTipo, extraerFinalidad, 
    extraerEstudio, extraerTipoMaterial, extraerTipoMatriz, extraerConservadores , extraerTipoParametro, 
    extraerPuntosMuestreo, insertDescCustodia, extraerUsuarios, extraerTermometros, extraerTermometrosPorNumero, 
    extraerPuntosCE,
    insertar_hoja_campo,
    extraerNorma,
    registrarMaterialMuestreo, extraerSolicitud5 , extraerProyectosHCampo,
    extraerProyectosArchivos, desactivarSolicitud, activarSolicitud ,extraerSolicitudesDesactivadas,
    actualizarTermometro, buscarUsuario,
    desactivarParametro,
    activarParametro,
    extraerParametrosActivos,
    activarUsuarios,
    desactivarUsuarios, extraerUsuariosActivos} from './batabase.js';


import {registrarParametro, registrarAlmacen, registrarConservadores, registrarTipoAgua, registrarTipoEstudios,
    registrarTipoFinalidad,registrarTipoMaterial,registrarTipoMatriz,registrarTipoParametro,registrarUsuarios, registrarTermometros } from './registros.js';


import { generarPDFEtiquetas , generarParametrosOrden, generarParametros, generarPDF, generarPDFOrden, generarChecklist, generarHojaCampo , generarCustodiaExterna } from './pdfGenerator.js';
import db from './batabase.js';

 
const app = express();
const PORT = 5000; 

app.use(cors(
    // funciona para escuchar cualquier origen
    { 
    origin: "*" 
    
    }
    // origen directo
// { origin: "http://172.29.3.46" }
));

app.use(express.json());


// FUNCIONES DE PDF

// ---------SOLICITUD---------------------

app.get('/solicitud/:numero', async (req, res) => {
  const numeroSolicitud = req.params.numero;

  try {
    const [resultados] = await db.query(
      `SELECT ns.*, st.*, ds.*, dg.*
       FROM num_solicitudes ns
       INNER JOIN solicitud_trabajo st ON st.numSolicitud = ns.numSolicitud
       INNER JOIN datos_solicitudes ds ON st.numSolicitud = ds.numSolicitud
       INNER JOIN datos_generales dg ON dg.Id_datosGnl = 1
       WHERE st.idProyecto = ?`,
      [numeroSolicitud]
    );

    if (resultados.length === 0) {
      return res.status(404).send({ error: 'Solicitud no encontrada' });
    }

    // Agrupamos los datos como hiciste en PHP
    const datoSolicitud = {
      info: {
        numSolicitud: resultados[0].numSolicitud,
        fechaSolicitud: resultados[0].fechaSolicitud,
        fechaOrden: resultados[0].fechaOrden,
        usuario: resultados[0].usuario,
        status_solicitud: resultados[0].status_solicitud,
        Ejecucion_muestreo: resultados[0].Ejecucion_muestreo,
        direccion: resultados[0].direccion,
        estado: resultados[0].estado,
        ciudad: resultados[0].ciudad,
        telefono: resultados[0].telefono,
        ext: resultados[0].ext,
      },
      detalles: resultados.map(fila => ({
        numSolicitud: fila.numSolicitud,
        nombreProyecto: fila.nombreProyecto,
        dateInicial: fila.dateInicial,
        num_Muestras: fila.num_Muestras,
      }))
    };

    // Generamos el PDF usando la estructura agrupada
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="solicitud_${numeroSolicitud}.pdf"`);

    const doc = generarPDF(datoSolicitud); // Usa `datoSolicitud`, no una fila única
    doc.pipe(res);
   
  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});

//--------------- ORDEN ------------------
app.get('/orden/:numero', async (req, res) => {
  
  const numeroSolicitud = req.params.numero;

  try {
    const [resultados] = await db.query(
      `SELECT ns.*, st.*, ds.*, dg.*
       FROM num_solicitudes ns
       INNER JOIN solicitud_trabajo st ON st.numSolicitud = ns.numSolicitud
       INNER JOIN datos_solicitudes ds ON st.numSolicitud = ds.numSolicitud
       INNER JOIN datos_generales dg ON dg.Id_datosGnl = 1
       WHERE st.idProyecto = ?`,
      [numeroSolicitud]
    );

    if (resultados.length === 0) {
      return res.status(404).send({ error: 'Solicitud no encontrada' });
    }

    // Agrupamos los datos como hiciste en PHP
    const datoSolicitud = {
      info: {
        numSolicitud: resultados[0].numSolicitud,
        fechaSolicitud: resultados[0].fechaSolicitud,
        fechaOrden: resultados[0].fechaOrden,
        usuario: resultados[0].usuario,
        status_solicitud: resultados[0].status_solicitud,
        Ejecucion_muestreo: resultados[0].Ejecucion_muestreo,
        direccion: resultados[0].direccion,
        estado: resultados[0].estado,
        ciudad: resultados[0].ciudad,
        telefono: resultados[0].telefono,
        ext: resultados[0].ext,
      },
      detalles: resultados.map(fila => ({
        numSolicitud: fila.numSolicitud,
        nombreProyecto: fila.nombreProyecto,
        dateInicial: fila.dateInicial,
        num_Muestras: fila.num_Muestras,
      }))
    };

    // Generamos el PDF usando la estructura agrupada
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="orden_${numeroSolicitud}.pdf"`);

    const doc = generarPDFOrden(datoSolicitud); // Usa `datoSolicitud`, no una fila única
    doc.pipe(res);
   
  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }


});

// Parametros
app.get('/parametros/:numero', async (req, res) => {
  const numeroSolicitud = req.params.numero;

  try {
    const [resultados] = await db.query(
      `SELECT ns.*, st.*, ds.*, dg.*
       FROM num_solicitudes ns
       INNER JOIN solicitud_trabajo st ON st.numSolicitud = ns.numSolicitud
       INNER JOIN datos_solicitudes ds ON st.numSolicitud = ds.numSolicitud
       INNER JOIN datos_generales dg ON dg.Id_datosGnl = 1
       WHERE ns.numSolicitud = ?`,
      [numeroSolicitud]
    );

    if (resultados.length === 0) {
      return res.status(404).send({ error: 'Solicitud no encontrada' });
    }

    const datoSolicitud = {
      info: {
        numSolicitud: resultados[0].numSolicitud,
        fechaSolicitud: resultados[0].fechaSolicitud,
        fechaOrden: resultados[0].fechaOrden,
        usuario: resultados[0].usuario,
        status_solicitud: resultados[0].status_solicitud,
        Ejecucion_muestreo: resultados[0].Ejecucion_muestreo,
        direccion: resultados[0].direccion,
        estado: resultados[0].estado,
        ciudad: resultados[0].ciudad,
        telefono: resultados[0].telefono,
        ext: resultados[0].ext,
      },
      detalles: resultados.map(fila => ({
        numSolicitud: fila.numSolicitud,
        nombreProyecto: fila.nombreProyecto,
        dateInicial: fila.dateInicial,
        num_Muestras: fila.num_Muestras,
      }))
    };

    const [resultadosParametros] = await db.query(
      `SELECT st.*, pm.* 
       FROM solicitud_trabajo st 
       INNER JOIN puntosmuestreo pm ON st.idProyecto = pm.idProyecto 
       WHERE st.numSolicitud = ?`,
      [numeroSolicitud]
    );

    const [fechasProyectos] = await db.query(
      `SELECT idProyecto, dateInicial FROM solicitud_trabajo WHERE numSolicitud = ?`,
      [numeroSolicitud]
    );

    const fechasPorProyecto = {};
    for (const fecha of fechasProyectos) {
      fechasPorProyecto[fecha.idProyecto] = fecha.dateInicial;
    }

    const datos = [];
    for (const raw of resultadosParametros) {
      const [parametros] = await db.query(
        `SELECT st.*, p.*, np.*
         FROM puntosmuestreo st
         INNER JOIN muestras_solicitud np ON st.idMuestra = np.idMuestra
         INNER JOIN parametros p ON np.idParametro = p.idParametro
         WHERE st.idMuestra = ?`,
        [raw.idMuestra]
      );

      for (const param of parametros) {
        datos.push(param);
      }
    }

    // Enviamos todo a la función del PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="parametros_${numeroSolicitud}.pdf"`);

    const doc = generarParametros(datoSolicitud, datos, fechasPorProyecto);
    doc.pipe(res);

  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});
// Orden de parametros
app.get('/parametrosOrden/:numero', async (req, res) => {
  const numeroSolicitud = req.params.numero;

  try {
    const [resultados] = await db.query(
      `SELECT ns.*, st.*, ds.*, dg.*
       FROM num_solicitudes ns
       INNER JOIN solicitud_trabajo st ON st.numSolicitud = ns.numSolicitud
       INNER JOIN datos_solicitudes ds ON st.numSolicitud = ds.numSolicitud
       INNER JOIN datos_generales dg ON dg.Id_datosGnl = 1
       WHERE ns.numSolicitud = ?`,
      [numeroSolicitud]
    );

    if (resultados.length === 0) {
      return res.status(404).send({ error: 'Solicitud no encontrada' });
    }

    const datoSolicitud = {
      info: {
        numSolicitud: resultados[0].numSolicitud,
        fechaSolicitud: resultados[0].fechaSolicitud,
        fechaOrden: resultados[0].fechaOrden,
        usuario: resultados[0].usuario,
        status_solicitud: resultados[0].status_solicitud,
        Ejecucion_muestreo: resultados[0].Ejecucion_muestreo,
        direccion: resultados[0].direccion,
        estado: resultados[0].estado,
        ciudad: resultados[0].ciudad,
        telefono: resultados[0].telefono,
        ext: resultados[0].ext,
      },
      detalles: resultados.map(fila => ({
        numSolicitud: fila.numSolicitud,
        nombreProyecto: fila.nombreProyecto,
        dateInicial: fila.dateInicial,
        num_Muestras: fila.num_Muestras,
      }))
    };

    const [resultadosParametros] = await db.query(
      `SELECT st.*, pm.* 
       FROM solicitud_trabajo st 
       INNER JOIN puntosmuestreo pm ON st.idProyecto = pm.idProyecto 
       WHERE st.numSolicitud = ?`,
      [numeroSolicitud]
    );

    const [fechasProyectos] = await db.query(
      `SELECT idProyecto, dateInicial FROM solicitud_trabajo WHERE numSolicitud = ?`,
      [numeroSolicitud]
    );

    const fechasPorProyecto = {};
    for (const fecha of fechasProyectos) {
      fechasPorProyecto[fecha.idProyecto] = fecha.dateInicial;
    }

    const datos = [];
    for (const raw of resultadosParametros) {
      const [parametros] = await db.query(
        `SELECT st.*, p.*, np.*
         FROM puntosmuestreo st
         INNER JOIN muestras_solicitud np ON st.idMuestra = np.idMuestra
         INNER JOIN parametros p ON np.idParametro = p.idParametro 
         WHERE st.idMuestra = ?`,
        [raw.idMuestra]
      );

      for (const param of parametros) {
        datos.push(param);
      }
    }

    // Enviamos todo a la función del PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Ordenparametros_${numeroSolicitud}.pdf"`);

    const doc = generarParametrosOrden(datoSolicitud, datos, fechasPorProyecto);
    doc.pipe(res);

  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});
// etiquetas
app.get('/etiquetas/:numero', async (req, res) => {
  const numSolicitud = req.params.numero;

  try {
    // Paso 1: obtener muestras
    const [rows] = await db.query(`
      SELECT st.*, pm.*, ms.* 
      FROM solicitud_trabajo st
      INNER JOIN puntosmuestreo pm ON st.idProyecto = pm.idProyecto
      INNER JOIN muestras_solicitud ms ON pm.idMuestra = ms.idMuestra
      WHERE st.numSolicitud = ?
    `, [numSolicitud]);

    const arrayInformacion = rows.map(row => ({
      idProyecto: row.idProyecto,
      nombreProyecto: row.nombreProyecto,
      nombre: row.NombrePuntoMuestreo,
      isMuestra: row.idMuestra,
      idparametro: row.idParametro,
    }));

    // Paso 2: agrupar parámetros por muestra
    const agrupados = {};

    for (const info of arrayInformacion) {
      const [paramRows] = await db.query(
        'SELECT * FROM parametros WHERE idParametro = ?',
        [info.idparametro]
      );

      for (const fila of paramRows) {
        const idMuestra = info.isMuestra;
        if (!agrupados[idMuestra]) {
          agrupados[idMuestra] = {
            Proyecto: info.idProyecto,
            nombreProyecto: info.nombreProyecto,
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
        const [rows] = await db.query(`
          SELECT tp.*, tc.*, pr.*
          FROM parametros pr
          INNER JOIN tipo_parametro tp ON tp.idTipoParametro = pr.idtipoParametro
          INNER JOIN table_conservadores tc ON tp.idConservador = tc.idConservador
          WHERE pr.idParametro = ?
        `, [parametro]);

        for (const row of rows) {
          // Consultar la tabla muestras_solicitud para obtener el mostrador y la fecha
          const [muestraRows] = await db.query(`
            SELECT ms.siglasMostrador, ms.dateMuestreo
            FROM muestras_solicitud ms
            WHERE ms.idMuestra = ? AND ms.idParametro = ?
          `, [datosMuestra.Muestra, row.idParametro]);
        
          // Si la consulta devuelve resultados, obtenemos los datos
          if (muestraRows.length > 0) {
            const muestraData = muestraRows[0]; // Tomamos la primera fila
        
            infoEtiquetas.push({
              nombreProyecto: datosMuestra.nombreProyecto,
              idMuestra: datosMuestra.Muestra,
              idParametro: row.idParametro,
              nombre: datosMuestra.nombrePuntoMuestreo,
              tipoPara: row.idTipoParametro,
              nombrePara: row.nombreParametro,
              conservador: row.name_conservador,
              recipientes: row.Nom_rec,
              mostrador: muestraData.siglasMostrador,  // Aquí va el valor del mostrador
              fechaMuestreo: new Date(muestraData.dateMuestreo).toLocaleDateString('es-ES'),  // Aquí va la fecha
            });
          }
        }
        
      }
    }

    // Paso 4: agrupar etiquetas por tipo de parámetro
    const nombresParametros = {};

    for (const info of infoEtiquetas) {
      const { nombreProyecto , idMuestra, idParametro, nombre, tipoPara, nombrePara, conservador, recipientes, mostrador, fechaMuestreo } = info;

      if (!nombresParametros[idMuestra]) nombresParametros[idMuestra] = {};
      if (!nombresParametros[idMuestra][tipoPara]) {
        nombresParametros[idMuestra][tipoPara] = {
          Proyecto: nombreProyecto,
          muestra: idMuestra,
          idParametro: [idParametro],
          puntoMuestreo: nombre,
          nombres: [nombrePara],
          conservador,
          recipiente: recipientes,
          mostrador: mostrador,
          fechaMuestreo:fechaMuestreo,
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
          nombreProyecto:detalles.Proyecto,
          idMuestra: detalles.muestra,
          nombre: detalles.puntoMuestreo,
          conservador: detalles.conservador,
          recipientes: detalles.recipiente,
          nombres: detalles.nombres,
          idparametros: detalles.idParametro,
          nombre_mostrador: detalles.mostrador,
          fechaMuestreo: detalles.fechaMuestreo,
        });
      }
    }

    const etiquetasFiltradas = etiquetas.filter(et => et.recipientes !== "PC");


    // res.json(etiquetas);
    // Generamos el PDF usando la estructura agrupada
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="etiquetas_${numSolicitud}.pdf"`);

    const doc = generarPDFEtiquetas(etiquetasFiltradas); 
    doc.pipe(res);
   
  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});
// checklist
app.get('/checklist/:numero', async (req, res) => {
  const numeroSolicitud = req.params.numero;

  try {
    const [resultados] = await db.query(
      `SELECT ml.*, al.*, tm.nombreTipo
       FROM material_laboratorio ml
       INNER JOIN almacen_laboratorio al ON ml.idMaterial = al.idMaterial
       INNER JOIN tipomaterial tm ON al.tipoMaterial = tm.tipoMaterial
       WHERE ml.numSolicitud = ?`,
      [numeroSolicitud]
    );

    // Agrupar por tipo de material
    const materialesPorTipo = {};
    resultados.forEach(row => {
      const tipo = row.nombreTipo;
      if (!materialesPorTipo[tipo]) {
        materialesPorTipo[tipo] = [];
      }
      materialesPorTipo[tipo].push({
        nombre: row.nombreMaterial,
        id: row.idMaterial,
        cantidadAntes: row.cantidad_antesMuestreo || '',
        cantidadDespues: '', // lo puedes llenar luego si se requiere
        observaciones: ''
      });
    });

    const datos = { materialesPorTipo };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="listacheck_${numeroSolicitud}.pdf"`);

    const doc = generarChecklist(datos);
    doc.pipe(res);

  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});

// custodia externa
app.get('/custodiaExterna/:numero', async (req, res) => {
  const numeroSolicitud = req.params.numero;

  try {
    const [resultados] = await db.query(
      `SELECT ns.*, st.*, ds.*, dg.*, pm.*, dce.*, ce.*, tp.*, dgce.*
      FROM num_solicitudes ns
      INNER JOIN solicitud_trabajo st ON st.numSolicitud = ns.numSolicitud
      INNER JOIN datos_solicitudes ds ON st.numSolicitud = ds.numSolicitud
      INNER JOIN datos_generales dg ON dg.Id_datosGnl = 1
      INNER JOIN puntosmuestreo pm ON pm.idProyecto = st.IdProyecto
      INNER JOIN datos_gnl_custodiaexterna dgce ON pm.idProyecto = dgce.idProyecto 
      INNER JOIN desccustodia_externa dce ON dce.idMuestra = pm.idMuestra
      INNER JOIN custodia_externa ce ON ce.idMuestra = dce.idMuestra
      INNER JOIN tipo_parametro tp ON tp.idTipoParametro = ce.idContenedor
      WHERE pm.idProyecto = ?`,
      [numeroSolicitud]
    );

    if (!resultados || resultados.length === 0) {
    throw new Error("No se encontraron datos para la solicitud indicada.");
    }

    // Datos generales
    const informacionGeneral = {
      numSolicitud: resultados[0].numSolicitud,
      nombreProyecto: resultados[0].nombreProyecto,
      direccion: resultados[0].direccion,
      laboratorio: resultados[0].usuario,
      telefono: resultados[0].telefono,
      ext: resultados[0].ext,
      
      // datos de datos_gnl_custodiaexterna
      observaciones: resultados[0].Observaciones,
      parametrosFueraTiempo : resultados[0].Parametros_fuera_tiempo,
      muestrador: resultados[0].Muestrador,
      nombreEntrega: resultados[0].nombre_entrega,
      fechaEntrega: resultados[0].fecha_entrega,
      horaEntrega: resultados[0].hora_entrega,
      nombreReceptor: resultados[0].nombre_receptor,
      fechaReceptor: resultados[0].fecha_receptor,
      horaReceptor: resultados[0].hora_receptor,
    };

    // Agrupar puntos de muestreo
    const puntosMuestreo = [];

    for (const fila of resultados) {
      // Identificador único para punto de muestreo
      const claveUnica = `${fila.NombrePuntoMuestreo}|${fila.fecha}|${fila.hora}|${fila.idMatriz}|${fila.idTipo_agua}`;

      let punto = puntosMuestreo.find(p => p.clave === claveUnica);

      if (!punto) {
        punto = {
          clave: claveUnica,
          nombrePuntoMuestreo: fila.NombrePuntoMuestreo,
          fecha: fila.fecha,
          hora: fila.hora,
          matriz: fila.idMatriz,
          tipoAgua: fila.idTipo_agua,
          recipientes: []
        };
        puntosMuestreo.push(punto); 
      }

      if (fila.Nom_rec && fila.cantidad_recipiente) {
        const nombre = fila.Nom_rec;
        const cantidad = parseInt(fila.cantidad_recipiente);

        // Convertir a booleanos (por si vienen como 0/1)
        const reactivos = !!fila.reactivos;
        const hielo = !!fila.Hielo;
        const phAdecuado = !!fila.pH;

        if (!isNaN(cantidad)) {
          const existente = punto.recipientes.find(r => r.nombre === nombre);
          if (existente) {
            existente.cantidad += cantidad;

            // Opcional: actualizar booleanos si alguno es true
            existente.reactivos = existente.reactivos || reactivos;
            existente.hielo = existente.hielo || hielo;
            existente.phAdecuado = existente.phAdecuado || phAdecuado;
          } else {
            punto.recipientes.push({
              nombre,
              cantidad,
              reactivos,
              hielo,
              phAdecuado
            });
          }
        }
      }

    }

    const recipientesMap = new Map();

    for (const fila2 of resultados) {
      const nombre = fila2.Nom_rec;
      const cantidad = parseInt(fila2.cantidad_recipiente);
      const reactivos = !!fila2.reactivos;
      const hielo = !!fila2.Hielo;
      const phAdecuado = !!fila2.pH;

      if (nombre && !isNaN(cantidad)) {
        if (recipientesMap.has(nombre)) {
          const existente = recipientesMap.get(nombre);
          existente.cantidad += cantidad;

          // Asegurar que si uno es true, se mantenga
          existente.reactivos = reactivos;
          existente.hielo = existente.hielo || hielo;
          existente.phAdecuado = existente.phAdecuado || phAdecuado;
        } else {
          recipientesMap.set(nombre, {
            nombre,
            cantidad,
            reactivos,
            hielo,
            phAdecuado
          });
        }
      }
    }

    // Convertir a array final
    const recipientesMuestreo = Array.from(recipientesMap.values());



    // Generamos el PDF usando la estructura agrupada
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="custodiaexterna_${numeroSolicitud}.pdf"`);

    const doc = generarCustodiaExterna(informacionGeneral,recipientesMuestreo,puntosMuestreo); 
    doc.pipe(res);
  
  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});
// hoja de campo
app.get('/hojaCampo/:numero', async (req, res) => {
  const numeroSolicitud = req.params.numero;
  try {
    // console.log(numeroSolicitud);
    const [resultados] = await db.query(
    `SELECT dhm.*,pm.idProyecto,pm.idMuestra, pm.NombrePuntoMuestreo ,st.numSolicitud,st.nombreProyecto,tn.*,tm.*,ta.*,tf.*,
      u.clvUsuario AS clvMuestrador,
      uR.clvUsuario AS clvReceptor
    FROM desc_hoja_muestra dhm
    INNER JOIN puntosmuestreo pm ON pm.idProyecto = dhm.idProyecto
    INNER JOIN table_muestras tm ON tm.idMuestra = pm.idMuestra
    INNER JOIN solicitud_trabajo st ON st.idProyecto = dhm.idProyecto
    INNER JOIN tipoagua ta ON dhm.idTipo = ta.idTipoAgua
    INNER JOIN tipofinalidad tf ON dhm.idFinalidad = tf.idFinalidad
    INNER JOIN usuarios u ON dhm.idMuestrador = u.idUsuario
    INNER JOIN usuarios uR ON dhm.idReceptor = uR.idUsuario
    INNER JOIN table_norma tn ON tn.idNorma = dhm.idNorma 
    WHERE dhm.idProyecto = ?`,
    [numeroSolicitud]
  );

  if (resultados.length === 0) {
    return res.status(404).send({ error: 'Solicitud no encontrada' });
  }

  const datoSolicitud = {
    info: {
      nombre_proyecto: resultados[0].nombreProyecto,
      numSolicitud: resultados[0].numSolicitud,
      fechaMuestreo: resultados[0].fechaMuestreo,
      fechaRecepcion: resultados[0].fechaRecepcion,
      horaRecepcion: resultados[0].horaRecepcion,
      idMuestrador: resultados[0].idMuestrador,
      idReceptor: resultados[0].idReceptor,
      idTipo: resultados[0].idTipo,
      idFinalidad: resultados[0].idFinalidad,
      claveTermometro: resultados[0].claveTermometro,
      idNorma: resultados[0].idNorma,
      nombreNorma: resultados[0].tipoNorma,
      nombre_tipoAgua: resultados[0].nombreAgua,
      nombre_finalidad: resultados[0].nombreFinalidad,
      muestrador: resultados[0].clvMuestrador,
      receptor: resultados[0].clvReceptor,

    },
    muestras: resultados.map(fila => ({
      idMuestra: fila.idMuestra,
      NoMuestra: fila.NoMuestra,
      Procedencia: fila.NombrePuntoMuestreo,
      hora: fila.hora,
      color: fila.color,
      olor: fila.olor,
      gasto: fila.gasto,
      burbuja: fila.burbuja,
      transparencia: fila.transparencia,
      material_flotante: fila.material_flotante,
      tempAgua: fila.tempAgua,
      tempAmb: fila.tempAmb,
      pH: fila.pH,
      pH_incertidumbre: fila.pH_incertidumbre,
      COND_E: fila.COND_E,
      condE_incertidumbre: fila.condE_incertidumbre,
      SDT: fila.SDT,
      OD_PORCENT: fila.OD_PORCENT,
      OD_porcent_incertidumbre: fila.OD_porcent_incertidumbre,
      OD_ML: fila.OD_ML,
      OD_ml_incertidumbre: fila.OD_ml_incertidumbre,
      FQ: fila.FQ,
      GYA: fila.GYA,
      NH3: fila.NH3,
      Alcalinidad: fila.Alcalinidad,
      Dureza: fila.Dureza,
      H_H: fila.H_H,
      MB: fila.MB,
      OTROS: fila.OTROS,
    }))
  };

    const [resultados2] = await db.query(
      `SELECT dhm.*,pm.idProyecto,pm.idMuestra, st.numSolicitud,tm.*, 
      p.idParametro, tp.idTipoParametro, tp.Nom_rec
      FROM desc_hoja_muestra dhm
      INNER JOIN puntosmuestreo pm ON pm.idProyecto = dhm.idProyecto
      INNER JOIN table_muestras tm ON tm.idMuestra = pm.idMuestra
      INNER JOIN solicitud_trabajo st ON st.idProyecto = dhm.idProyecto
      INNER JOIN muestras_solicitud ms ON ms.idMuestra = pm.idMuestra
      INNER JOIN parametros p ON p.idParametro = ms.idParametro
      INNER JOIN tipo_parametro tp ON tp.idTipoParametro = p.idTipoParametro
      WHERE dhm.idProyecto = ?`,
      [numeroSolicitud]
    );

    // Extraer tipos únicos de parámetros
    const tiposParametrosUnicos = [...new Set(resultados2.map(fila => fila.Nom_rec))];
    const parametros = {
      nom_rec: tiposParametrosUnicos.join(', ')
    };


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="hojaCampo_${numeroSolicitud}.pdf"`);

    const doc = generarHojaCampo(datoSolicitud, parametros); // Usa `datoSolicitud`, no una fila única
    doc.pipe(res);
   
  } catch (error) {
    res.status(500).send({ error: 'Error al generar el PDF', detalle: error.message });
  }
});






// TERMINAN FUNCIONES DE PDF

// -----------FUNCIONES------------------
app.post("/api/insertar", async (req, res) => {
    console.log("Ruta /api/insertar alcanzada");
    console.log("Datos recibidos:", req.body); 

    const { informacionGNL, puntosMuestreo } = req.body;

    try {
        const result = await registrarSolicitud(informacionGNL, puntosMuestreo);
        
        // Si la inserción es exitosa, devolvemos un mensaje de éxito
        res.json({ message: "Datos registrados correctamente", result });
    } catch (error) {
        console.log("Error en registro:", error);
        // Si hay un error, devolvemos el error con un mensaje específico
        res.status(500).json({ error: "Error al insertar los datos. Verifique el servidor." });
    }
});
app.get('/api/etiquetas', async (req, res) => {
    const { numeroSolicitud } = req.query;

    // console.log("Llegó la solicitud con numSolicitud:", numeroSolicitud);
    try {
        const result = await extraerEtiquetas(numeroSolicitud);
        res.json({ message: 'Dato recogido correctamente', result });
    } catch (error) {
        console.error('Error al recoger datos:', error);
        res.status(500).json({ error: 'Error al extraer datos' });
    }
});
app.post('/api/insertar_desc_custodia_externa', async (req, res) => {
    const { informacionGeneral,resultados, estadoContenedores, numSolicitud , idProyecto } = req.body;

    try {
        await insertDescCustodia(numSolicitud, idProyecto, resultados, informacionGeneral, estadoContenedores);
        res.json({ message: 'Registro de custodia externa con éxito' });
    } catch (error) {
        console.error('Error al ingresar el dato:', error);
        res.status(500).json({ error: 'Error al ingresar el dato' });
    }
});
app.post('/api/insertar_hoja_campo', async (req,res) =>{

    const { termometroElegido, datosFormulario, informacionGeneral, proyecto } = req.body;

    const clave = termometroElegido[0].claveTermometro;
    try {
        await insertar_hoja_campo(clave, datosFormulario, informacionGeneral, proyecto); 
        res.json({ message: 'Registro de Hoja de Campo con éxito' });
    } catch (error) {
        console.error('Error al ingresar el dato:', error);
        res.status(500).json({ error: 'Error al ingresar el dato' });
    }
});


// ---------ACTUALIZAR--------------
app.put('/api/actualizar', async (req, res) => {
    const { solicitud, fechaOrden } = req.body;

    console.log("Ruta /api/actualizar alcanzada");
    console.log("Solicitud recibida:", solicitud);
    console.log("Fecha Orden recibida:", fechaOrden);

    try {
        const result = await actualizarOrden(solicitud,fechaOrden);
        res.json({ message: 'Dato actualizado correctamente', result });
    } catch (error) {
        console.error('Error al actualizar el dato:', error);
        res.status(500).json({ error: 'Error al actualizar el dato' });
    }

});
app.put('/api/actualizarSolicitud', async (req, res) => {
    const { solicitud } = req.body;

    console.log(solicitud)

    try {
        const result = await desactivarSolicitud(solicitud);
        res.json({ message: 'Dato actualizado correctamente', result });
    } catch (error) {
        console.error('Error al actualizar el dato:', error);
        res.status(500).json({ error: 'Error al actualizar el dato' });
    }

});
app.put('/api/activarSolicitud', async (req, res) => {
    const { solicitud } = req.body;

    console.log(solicitud)

    try {
        const result = await activarSolicitud(solicitud);
        res.json({ message: 'Dato actualizado correctamente', result });
    } catch (error) {
        console.error('Error al actualizar el dato:', error);
        res.status(500).json({ error: 'Error al actualizar el dato' });
    }

});
app.post('/api/insertarMateriales', async (req,res) =>{
    
    const { numSolicitud , Muestras } = req.body;

    // console.log("datos: "+req.body);

    try{
        const result = await actualizarMuestras(numSolicitud,Muestras);
        res.json({message: 'Materiales registrados correctamente', result});
    } catch(error){
        console.error('Error al ingresar el dato:', error);
        res.status(500).json({ error: 'Error al ingresar el dato' });
    }
});
app.post('/api/materialesMuestreo', async (req,res) =>{
    const { numSolicitud, idMateriales} = req.body;
    try{
        const result = await registrarMaterialMuestreo(numSolicitud,idMateriales);
        res.json({message: 'Materiales registrados', result});
    }catch(error){
        console.log('error al ingresar materiales');
        res.status(500).json({ error: 'error al ingresar los datos'});
    }
})

app.post('/api/actualizarTermometros', async (req,res) =>{
    const { informacionGeneral , idTermometro } = req.body;

    try{
        const result = await actualizarTermometro(informacionGeneral,idTermometro);
        res.json({message: 'Termometro actualizado', result});
    }catch(error){
        console.log('error al actualizar termometro');
        res.status(500).json({ error: 'error al ingresar los datos'});
    }
})

app.post('/api/buscarUser', async (req, res) => {
  const { usuarioSeleccionado, password } = req.body;

  try {
    const usuario = await buscarUsuario(usuarioSeleccionado, password);
    if (usuario) {
      res.json(usuario); 
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Error al verificar usuario" });
  }
});

app.put('/api/actualizarParametro', async (req, res) => {
    const { parametro } = req.body;

    try {
        const result = await desactivarParametro(parametro);
        res.json({ message: 'Dato actualizado correctamente', result });
    } catch (error) {
        console.error('Error al actualizar el dato:', error);
        res.status(500).json({ error: 'Error al actualizar el dato' });
    }

});

app.put('/api/activarParametro', async (req, res) => {
    const { parametro } = req.body;

    try {
        const result = await activarParametro(parametro);
        res.json({ message: 'Dato actualizado correctamente', result });
    } catch (error) {
        console.error('Error al actualizar el dato:', error);
        res.status(500).json({ error: 'Error al actualizar el dato' });
    }

});

app.put('/api/activarUsuarios', async (req,res) =>{
    const { usuario } = req.body;
    console.log(usuario);
    try{
        const data = await activarUsuarios(usuario);
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});

app.put('/api/desactivarUsuarios', async (req,res) =>{
    const { usuario } = req.body;
    console.log(usuario);
    try{
        const data = await desactivarUsuarios(usuario);
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});


// -----------LISTAS------------------
app.get('/api/parametros', async (req, res) =>{
    try{
        const data = await extraerParametros();
        res.json(data);
    } catch(error){
        console.log("error de parametros", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});

app.get('/api/extraerParametrosActivos', async (req, res) =>{
    try{
        const data = await extraerParametrosActivos();
        res.json(data);
    } catch(error){
        console.log("error de parametros", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});



app.put('/api/borrarSolicitud', async (req, res) =>{
    
    const {solicitud} = req.body;


    try{
        const data = await borrarSolicitud(solicitud);
        res.json(data);
    } catch(error){
        console.log("error de parametros", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});


app.get('/api/ordenes', async (req,res) => {
    try{
        const data = await extraerSolicitudes();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});
app.get('/api/solicitudes', async (req,res) =>{
    try{
        const data = await extraerAllSolicitudes();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener solicitud"});
    }
});

app.get('/api/solicitudesDesactivados', async (req,res) =>{
    try{
        const data = await extraerSolicitudesDesactivadas();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener solicitud"});
    }
});
app.get('/api/solicitudeStatus2', async (req,res) => {
    try{
        const data = await extraerSolicitud2();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});
app.get('/api/solicitudeStatus3', async (req,res) => {
    try{
        const data = await extraerSolicitud3();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});
app.get('/api/solicitudeStatus4', async (req,res) => {
    try{
        const data = await extraerSolicitud4();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});

app.get('/api/proyectosPorSolicitud/:numero', async (req, res) => {
    const numero = req.params.numero; // Aquí obtenemos el parámetro 'numero' de la URL
    // console.log('el numero es: '+numero);
    try {
        const data = await extraerProyectos(numero); // Suponiendo que extraerProyectos es la función que obtendrá los proyectos
        res.json(data);
    } catch (error) {
        console.log("Error en las solicitudes:", error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
}); 

app.get('/api/proyectosPorSolicitudArchivo/:numero', async (req, res) => {
    const numero = req.params.numero; // Aquí obtenemos el parámetro 'numero' de la URL
    // console.log('el numero es: '+numero);
    try {
        const data = await extraerProyectosArchivos(numero); // Suponiendo que extraerProyectos es la función que obtendrá los proyectos
        res.json(data);
    } catch (error) {
        console.log("Error en las solicitudes:", error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
}); 

app.get('/api/proyectosPorSolicitudHCampo/:numero', async (req, res) => {
    const numero = req.params.numero; // Aquí obtenemos el parámetro 'numero' de la URL
    // console.log('el numero es: '+numero);
    try {
        const data = await extraerProyectosHCampo(numero); // Suponiendo que extraerProyectos es la función que obtendrá los proyectos
        res.json(data);
    } catch (error) {
        console.log("Error en las solicitudes:", error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
}); 
app.get('/api/puntosMuestreoPorProyecto/:numero', async (req,res) =>{
    const numero = req.params.numero; 
    // console.log('el numero es: '+numero);
    try {
        const data = await extraerPuntosMuestreo(numero); // 
        res.json(data);
    } catch (error) {
        console.log("Error en las solicitudes:", error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

app.get('/api/puntosMuestreoCustodiaExterna/:numero', async (req,res) =>{
    const numero = req.params.numero; 
    // console.log('el numero es: '+numero);
    try {
        const data = await extraerPuntosCE(numero); // 
        res.json(data);
    } catch (error) {
        console.log("Error en las solicitudes:", error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
});
app.get('/api/usuarios', async (req,res) =>{
    try{
        const data = await extraerUsuarios();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});

app.get('/api/usuariosActivos', async (req,res) =>{
    try{
        const data = await extraerUsuariosActivos();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});



app.get('/api/termometros', async (req,res) =>{
    try{
        const data = await extraerTermometros();
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});

app.get('/api/termometrosID/:numero', async (req,res) =>{
    const numero = req.params.numero; 
    // console.log("el numero es: "+ numero);
    try{
        const data = await extraerTermometrosPorNumero(numero);
        res.json(data);
     } catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
});




//-----------SELECTS Y LR
app.get('/api/almacen', async (req,res) =>{ 
    try{
        const data = await extraerAlmacen();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})
app.get('/api/tipoagua', async (req,res) =>{
    try{
        const data = await extraerTipo(); 
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})
app.get('/api/tipofinalidad', async (req,res) =>{
    try{
        const data = await extraerFinalidad();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})
app.get('/api/tipoestudio', async (req,res) =>{
    try{
        const data = await extraerEstudio(); 
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})


// ------------LISTAS DE REGISTROS (LR)----------
app.get('/api/tipomaterial', async (req,res) =>{
    try{
        const data = await extraerTipoMaterial();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})

app.get('/api/tipomatriz', async (req,res) =>{
    try{
        const data = await extraerTipoMatriz();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})

app.get('/api/conservadores', async (req,res) =>{
    try{
        const data = await extraerConservadores();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
}) 

app.get('/api/tipoparametro', async (req,res) =>{
    try{
        const data = await extraerTipoParametro();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})


app.get('/api/tipoNorma', async (req,res) =>{
    try{
        const data = await extraerNorma();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})

app.get('/api/usuarios', async (req,res) =>{
    try{
        const data = await extraerUsuarios();
        res.json(data);
    }catch(error){
        console.log("error en las solicitudes", error);
        res.status(500).json({error: "error al obtener datos"});
    }
})





//------------------- REGISTROS--------------------

app.post('/api/insertar_parametros', async (req,res) =>{
    const { informacionGeneral } = req.body;
    try{
        const data = await registrarParametro(informacionGeneral);
        res.json(data);
    } catch(error){
        console.log("error en el registro ",error);
        res.status(500).json({error: "error al obtener datos"});
    }
})

app.post('/api/insertar_almacen', async (req, res) => {
    const { informacionGeneral } = req.body;

    
    try {
        const data = await registrarAlmacen(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_conservadores', async (req, res) => {
    const { informacionGeneral } = req.body;
    console.log(informacionGeneral);
    try {
        const data = await registrarConservadores(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_tipo_agua', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarTipoAgua(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_tipo_estudios', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarTipoEstudios(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_tipo_finalidad', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarTipoFinalidad(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_tipo_material', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarTipoMaterial(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_tipo_matriz', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarTipoMatriz(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_tipo_parametro', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarTipoParametro(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_usuarios', async (req, res) => {
    const { informacionGeneral } = req.body;
    try {
        const data = await registrarUsuarios(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});

app.post('/api/insertar_termometros', async (req, res) => {
    const { informacionGeneral } = req.body;

    try {
        const data = await registrarTermometros(informacionGeneral);
        res.json(data);
    } catch (error) {
        console.log("error en el registro ", error);
        res.status(500).json({ error: "error al obtener datos" });
    }
});




// funciona en localhost
app.listen(PORT, () => { 
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
   
// funciona en produccion
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
// });