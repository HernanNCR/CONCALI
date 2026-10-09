import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// generar pdf de solicitud
export const generarPDF = (datos, nombreArchivo = "salida.pdf") => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  const x = 100;
  const y = 100;
  const width = 50;
  const height = 30;

  const { info, detalles } = datos;

  // -------------------------------
  // Agrega el texto dentro de la celda con padding
  doc.fontSize(10).text("Organismos de cuenca Frontera Sur", 330, 50, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 285, 63, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 305, 76, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  

  const isProd = process.mainModule?.filename.includes('app.asar');
  const basePath = isProd
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
    : path.join(__dirname, 'public');

  const imagePath = path.join(basePath, 'conagua.png');

  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 70, 90, { width: 180, height: 70 });
  } else {
    doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
  }
  


  doc.rect(250, 95, 325, 65).stroke();
  doc.fontSize(15).text(" SOLICITUD DE TRABAJO", 245, 120, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.fontSize(15).text("F-PROT-1", 570, 120, {
    width: 160,
    height: height - 5,
    align: "center",
    valign: "center",
  });

  // ---------------------------

  // Dibuja el borde completo de la celda
  // doc.rect(x, y, width, height).stroke();

  doc.fontSize(12).text("DATOS GENERALES", 50, 170, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(35, 184, 700, 15).stroke();
  const fecha = new Date(datos.info.fechaSolicitud);
  const fechaFormateada = fecha.toISOString().split("T")[0]; // Resultado: "2025-04-21"

  doc.fontSize(10).text("Fecha Solicitud", 120, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(fechaFormateada, 270, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Numero de Solicitud", 450, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.numSolicitud, 620, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(35, 199, 700, 15).stroke();
  doc.fontSize(10).text("Nombre del usuario:", 110, 203, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.usuario, 265, 203, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(35, 214, 700, 15).stroke();
  doc.fontSize(10).text("Direccion:", 120, 217, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.direccion, 270, 217, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(35, 229, 700, 15).stroke();
  doc.fontSize(10).text("Ciudad:", 120, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.ciudad, 270, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Estado:", 470, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.estado, 620, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(35, 244, 700, 15).stroke();
  doc.fontSize(10).text("Telefono:", 120, 247, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.telefono, 270, 247, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("ext. " + datos.info.ext, 320, 247, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(35, 259, 700, 15).stroke();
  doc.fontSize(10).text("¿Ejecucion de muestreo en el Laborotorio?", 70, 262, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text(datos.info.Ejecucion_muestreo === 1 ? "SI" : "NO", 320, 262, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("Correo Electronico", 390, 262, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("cristina.delossantos@conagua.gob.mx", 520, 262, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // -----------------------
  doc.fontSize(12).text("SOLICITUD DE MUESTRAS", 250, 290, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.rect(35, 310, 150, 30).stroke();
  doc.fontSize(10).text("Nombre del Proyecto", 60, 320, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(185, 310, 550, 15).stroke();
  doc.fontSize(10).text("MES/NUMERO DE MUESTRAS", 380, 313, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(185, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("ENE", 197, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(227.3, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("FEB", 239.3, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(269.6, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("MAR", 281.6, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(311.9, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("ABR", 323.9, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(354.2, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("MAY", 366.2, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(396.5, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("JUN", 408.5, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(438.8, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("JUL", 450.8, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(481.1, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("AGO", 493.1, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(523.4, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("SEP", 535.4, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(565.7, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("OCT", 577.7, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(608, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("NOV", 620, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(650.3, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("DIC", 662.3, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(692.6, 325, 42.3, 15).stroke();
  doc.fontSize(10).text("TOTAL", 698.6, 329, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  let yProyecto = 340;
  let totalMuestras = 0;

  datos.detalles.forEach((proyecto, index) => {
    const date = new Date(proyecto.dateInicial);
    const muestras = proyecto.num_Muestras;
    totalMuestras += muestras;

    // === Posición de la celda ===
    const mes = date.getMonth() + 1;
    const dia = date.getDate();

    let posicionMes;
    if (dia >= 1 && dia <= 7) {
      posicionMes = 1;
    } else if (dia >= 8 && dia <= 14) {
      posicionMes = 2;
    } else if (dia >= 15 && dia <= 22) {
      posicionMes = 3;
    } else {
      posicionMes = 4;
    }

    const posicionFinal = (mes - 1) * 4 + posicionMes - 1;

    // === Nombre del proyecto ===
    // Mide la altura que va a ocupar el texto antes de dibujarlo
    const nombreProyecto = proyecto.nombreProyecto;
    const textOptions = {
      width: 150,
      align: "left",
    };

    // Calcula altura estimada del texto
    const alturaTexto = doc.heightOfString(nombreProyecto, textOptions);
    const alturaCelda = Math.max(alturaTexto + 10, 20); // mínimo 20 de alto

    // Dibuja rectángulo ajustado
    doc.rect(35, yProyecto, 150, alturaCelda).stroke();

    // Dibuja texto envuelto dentro de la celda
    doc.fontSize(10).text(nombreProyecto, 40, yProyecto + 5, textOptions);

    // Avanza en Y según la altura real usada
    yProyecto += alturaCelda;

    // === Celdas de los 48 periodos ===
    const cellWidth = 10.575;
    const cellHeight = 20;

    for (let i = 0; i < 48; i++) {
      const x = 185 + i * cellWidth;

      doc.rect(x, yProyecto - alturaCelda, cellWidth, alturaCelda).stroke();

      if (i === posicionFinal) {
        doc
          .fillColor("black")
          .fontSize(10)
          .text(muestras.toString(), x, yProyecto - alturaCelda + 10, {
            width: cellWidth,
            align: "center",
          });
      } else {
        doc
          .fillColor("#f3f3f3")
          .rect(
            x + 1,
            yProyecto - alturaCelda + 1,
            cellWidth - 1,
            alturaCelda - 2
          )
          .fill();

        doc
          .fillColor("black")
          .fontSize(6)
          .text("X", x, yProyecto - alturaCelda + 10, {
            width: cellWidth,
            align: "center",
          });
      }
    }

    // === Columna de total muestras ===
    doc.rect(692.6, yProyecto - alturaCelda, 42.3, alturaCelda).stroke();
    doc.fontSize(10).text(muestras, 695, yProyecto - alturaCelda + 10, {
      width: 42.3,
      align: "center",
    });

    yProyecto - alturaCelda + 22;
  });

  // === Fila de TOTAL ===
  doc.rect(35, yProyecto, 150, 20).stroke();
  doc.fontSize(10).text("TOTAL", 45, yProyecto + 6, {
    width: 150,
    align: "center",
  });

  doc.rect(185, yProyecto, 508, 20).stroke();

  doc.rect(692.6, yProyecto, 42.3, 20).stroke();
  doc.fontSize(10).text(totalMuestras, 695, yProyecto + 6, {
    width: 42.3,
    align: "center",
  });

  if (datos.info.status_solicitud == 1) {
    doc.fontSize(10).text("ELABORO", 240, 415, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 430, 200, 20).stroke();
    doc.fontSize(10).text("ACC", 250, 435, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 450, 200, 20).stroke();
    doc.fontSize(8).text("ING.CRISTINA DE LOS SANTOS VENTURA", 180, 455, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  } else if (datos.info.status_solicitud >= 2) {
    doc.fontSize(10).text("ELABORO", 240, 415, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 430, 200, 20).stroke();
    doc.fontSize(10).text("ACC", 250, 435, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 450, 200, 20).stroke();
    doc.fontSize(8).text("ING.CRISTINA DE LOS SANTOS VENTURA", 180, 455, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.fontSize(10).text("AUTORIZO", 540, 415, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(460, 430, 200, 20).stroke();
    doc.fontSize(10).text("JDFCALA", 545, 435, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(460, 450, 200, 20).stroke();
    doc.fontSize(8).text("ING.FRANCISCO DE LOS SANTOS TORRES", 480, 455, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  }

  doc.end();

  return doc;
};

//  generar pdf de orden
export const generarPDFOrden = (datos, nombreArchivo = "salida.pdf") => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });


  const x = 100;
  const y = 100;
  const width = 50;
  const height = 30;

  const { info, detalles } = datos;

  doc.fontSize(10).text("Organismos de cuenca Frontera Sur", 330, 50, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 285, 63, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 305, 76, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // Agregar una imagen (ajusta la ruta y las dimensiones)

  const isProd = process.mainModule?.filename.includes('app.asar');
  const basePath = isProd
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
    : path.join(__dirname, 'public');

  const imagePath = path.join(basePath, 'conagua.png');

  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 70, 90, { width: 180, height: 70 });
  } else {
    doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
  }

  // doc.image("./public/conagua.png", 70, 90, { width: 180, height: 70 });
  doc.rect(250, 95, 325, 65).stroke();
  doc.fontSize(15).text("ORDEN DE TRABAJO", 245, 120, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.fontSize(15).text("F-PROT3", 570, 120, {
    width: 160,
    height: height - 5,
    align: "center",
    valign: "center",
  });

  // ---------------------------

  doc.fontSize(10).text("DATOS GENERALES", 60, 170, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(55, 184, 700, 15).stroke();
  const fecha = new Date(datos.info.fechaSolicitud);
  const fechaFormateada = fecha.toISOString().split("T")[0];
  var fechaordenFormateada = 0;

  if (datos.info.fechaOrden) {
    const fechaorden = new Date(datos.info.fechaOrden);
    fechaordenFormateada = fechaorden.toISOString().split("T")[0];
  } else {
    fechaordenFormateada = " ";
  }
  doc.fontSize(10).text("Fecha Solicitud", 85, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(fechaFormateada, 220, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Fecha Orden", 320, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(fechaordenFormateada, 400, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Numero de Solicitud", 540, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.numSolicitud, 690, 188, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // -----------------------
  doc.rect(55, 210, 150, 30).stroke();
  doc.fontSize(10).text("Nombre del Proyecto", 70, 220, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(205, 210, 550, 15).stroke();
  doc.fontSize(10).text("MES/NUMERO DE MUESTRAS", 390, 213, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(205, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("ENE", 217, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(247.3, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("FEB", 259.3, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(289.6, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("MAR", 301.6, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(331.9, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("ABR", 343.9, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(374.2, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("MAY", 386.2, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(416.5, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("JUN", 428.5, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(458.8, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("JUL", 470.8, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(501.1, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("AGO", 513.1, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(543.4, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("SEP", 555.4, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(585.7, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("OCT", 597.7, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(628, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("NOV", 640, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(670.3, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("DIC", 682.3, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(712.6, 225, 42.3, 15).stroke();
  doc.fontSize(10).text("TOTAL", 718.6, 229, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  let yProyecto = 240;
  let totalMuestras = 0;

  datos.detalles.forEach((proyecto, index) => {
    const date = new Date(proyecto.dateInicial);
    const muestras = proyecto.num_Muestras;
    totalMuestras += muestras;

    // === Posición de la celda ===
    const mes = date.getMonth() + 1;
    const dia = date.getDate();

    let posicionMes;
    if (dia >= 1 && dia <= 7) {
      posicionMes = 1;
    } else if (dia >= 8 && dia <= 14) {
      posicionMes = 2;
    } else if (dia >= 15 && dia <= 22) {
      posicionMes = 3;
    } else {
      posicionMes = 4;
    }

    const posicionFinal = (mes - 1) * 4 + posicionMes - 1;

    // === Nombre del proyecto ===
    // Mide la altura que va a ocupar el texto antes de dibujarlo
    const nombreProyecto = proyecto.nombreProyecto;
    const textOptions = {
      width: 150,
      align: "left",
    };

    // Calcula altura estimada del texto
    const alturaTexto = doc.heightOfString(nombreProyecto, textOptions);
    const alturaCelda = Math.max(alturaTexto + 10, 20); // mínimo 20 de alto

    // Dibuja rectángulo ajustado
    doc.rect(55, yProyecto, 150, alturaCelda).stroke();

    // Dibuja texto envuelto dentro de la celda
    doc.fontSize(10).text(nombreProyecto, 60, yProyecto + 5, textOptions);

    // Avanza en Y según la altura real usada
    yProyecto += alturaCelda;

    // === Celdas de los 48 periodos ===
    const cellWidth = 10.575;
    const cellHeight = 20;

    for (let i = 0; i < 48; i++) {
      const x = 205 + i * cellWidth;

      doc.rect(x, yProyecto - alturaCelda, cellWidth, alturaCelda).stroke();

      if (i === posicionFinal) {
        doc
          .fillColor("black")
          .fontSize(10)
          .text(muestras.toString(), x, yProyecto - alturaCelda + 10, {
            width: cellWidth,
            align: "center",
          });
      } else {
        doc
          .fillColor("#f3f3f3")
          .rect(
            x + 1,
            yProyecto - alturaCelda + 1,
            cellWidth - 1,
            alturaCelda - 2
          )
          .fill();

        doc
          .fillColor("black")
          .fontSize(6)
          .text("X", x, yProyecto - alturaCelda + 10, {
            width: cellWidth,
            align: "center",
          });
      }
    }

    // === Columna de total muestras ===
    doc.rect(712.6, yProyecto - alturaCelda, 42.3, alturaCelda).stroke();
    doc.fontSize(10).text(muestras, 715, yProyecto - alturaCelda + 10, {
      width: 42.3,
      align: "center",
    });

    yProyecto - alturaCelda + 22;
  });

  // === Fila de TOTAL ===
  doc.rect(55, yProyecto, 150, 20).stroke();
  doc.fontSize(10).text("TOTAL", 65, yProyecto + 6, {
    width: 150,
    align: "center",
  });

  doc.rect(205, yProyecto, 508, 20).stroke();

  doc.rect(712.6, yProyecto, 42.3, 20).stroke();
  doc.fontSize(10).text(totalMuestras, 715, yProyecto + 6, {
    width: 42.3,
    align: "center",
  });

  doc.fontSize(10).text("ELABORO", 180, 415, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(100, 430, 200, 20).stroke();
  doc.fontSize(10).text("ACC", 190, 435, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(100, 450, 200, 20).stroke();
  doc.fontSize(8).text("ING.CRISTINA DE LOS SANTOS VENTURA", 120, 455, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  if (datos.info.status_solicitud >= 2) {
    doc.fontSize(10).text("ANALISTAS", 540, 340, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(370, 355, 200, 40).stroke();
    doc.rect(370, 395, 200, 20).stroke();
    doc.fontSize(8).text("MARICELA ARISMENDIZ DE PAZ", 410, 401, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(370, 420, 200, 40).stroke();
    doc.rect(370, 460, 200, 20).stroke();
    doc.fontSize(8).text("CESAR URBINA HERNANDEZ", 410, 465, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(580, 355, 200, 40).stroke();
    doc.rect(580, 395, 200, 20).stroke();
    doc.fontSize(8).text("FABIAN ARROYO COUTIÑO", 617, 401, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(580, 420, 200, 40).stroke();
    doc.rect(580, 460, 200, 20).stroke();
    doc.fontSize(8).text("EMANUEL RIOS INFANZON", 617, 465, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(580, 485, 200, 40).stroke();
    doc.rect(580, 525, 200, 20).stroke();
    doc.fontSize(8).text("HERNÁN FEDERICO GUTÍERREZ ROBLEDO", 600, 530, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  }

  doc.end();

  return doc;
};

//  generar pdf de parametros
export const generarParametros = (
  datos,
  datos2,
  fechasPorProyecto,
  nombreArchivo = "salida.pdf"
) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });


  const x = 100;
  const y = 100;
  const width = 50;
  const height = 30;

  const { info, detalles } = datos;

  // -------------------------------
  // Agrega el texto dentro de la celda con padding
  doc.fontSize(10).text("Organismos de cuenca Frontera Sur", 360, 30, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 315, 43, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 340, 56, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // Agregar una imagen (ajusta la ruta y las dimensiones)
  const isProd = process.mainModule?.filename.includes('app.asar');
  const basePath = isProd
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
    : path.join(__dirname, 'public');

  const imagePath = path.join(basePath, 'conagua.png');

  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 100, 70, { width: 150, height: 50 });
  } else {
    doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
  }
  // doc.image("./public/conagua.png", 100, 70, { width: 150, height: 50 });
  doc.rect(280, 75, 325, 30).stroke();
  doc.fontSize(15).text(" SOLICITUD DE PARAMETROS", 280, 85, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.fontSize(15).text("F-PROT-2", 600, 85, {
    width: 160,
    height: height - 5,
    align: "center",
    valign: "center",
  });

  // ---------------------------

  // Dibuja el borde completo de la celda
  // doc.rect(x, y, width, height).stroke();

  doc.fontSize(12).text("DATOS GENERALES", 80, 125, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(65, 149, 700, 15).stroke();
  const fecha = new Date(datos.info.fechaSolicitud);
  const fechaFormateada = fecha.toISOString().split("T")[0]; // Resultado: "2025-04-21"

  doc.fontSize(10).text("Fecha Solicitud", 150, 153, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(fechaFormateada, 300, 153, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Numero de Solicitud", 480, 153, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.numSolicitud, 650, 153, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(65, 164, 700, 15).stroke();
  doc.fontSize(10).text("Nombre del usuario:", 140, 167, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.usuario, 295, 168, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(65, 179, 700, 15).stroke();
  doc.fontSize(10).text("Direccion:", 150, 183, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.direccion, 300, 183, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(65, 194, 700, 15).stroke();
  doc.fontSize(10).text("Ciudad:", 150, 197, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.ciudad, 300, 197, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Estado:", 500, 197, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.estado, 650, 197, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(65, 209, 700, 15).stroke();
  doc.fontSize(10).text("Telefono:", 150, 212, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.telefono, 300, 212, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("ext. " + datos.info.ext, 360, 212, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(65, 224, 700, 15).stroke();
  doc.fontSize(10).text("¿Ejecucion de muestreo en el Laborotorio?", 100, 227, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text(datos.info.Ejecucion_muestreo === 1 ? "SI" : "NO", 350, 227, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("Correo Electronico", 420, 227, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("cristina.delossantos@conagua.gob.mx", 550, 227, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // -----------------------
  doc.fontSize(12).text("SOLICITUD DE PARAMETROS", 280, 245, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.rect(50, 260, 130, 20).stroke();
  doc.fontSize(8).text("Parametros", 95, 267, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(180, 260, 100, 20).stroke();
  doc.fontSize(8).text("Metodos", 215, 267, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(280, 260, 30, 20).stroke();
  doc.fontSize(6).text("ACREDI", 284, 267, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(310, 260, 470, 10).stroke();
  doc.fontSize(8).text("MES/NUMERO DE MUESTRAS", 465, 262, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(310, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("ENE", 320, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(346.15, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("FEB", 357, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(382.3, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("MAR", 392.3, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(418.45, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("ABR", 428.45, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(454.6, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("MAY", 464.6, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(490.75, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("JUN", 500.75, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(526.9, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("JUL", 536.9, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(563.05, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("AGO", 572.05, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(599.2, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("SEP", 609.2, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(635.35, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("OCT", 645.35, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(671.5, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("NOV", 679.5, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(707.65, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("DIC", 717.65, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(743.8, 270, 36.15, 10).stroke();
  doc.fontSize(8).text("TOTAL", 749.8, 272, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  const datosProcesados = [];

  datos2.forEach((fila) => {
    const fecha = new Date(fechasPorProyecto[fila.idProyecto]);
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();

    let posicionMes = 1;
    if (dia >= 8 && dia <= 14) posicionMes = 2;
    else if (dia >= 15 && dia <= 22) posicionMes = 3;
    else if (dia >= 23) posicionMes = 4;

    const posicionFinal = (mes - 1) * 4 + posicionMes;

    const existente = datosProcesados.find(
      (p) => p.idParametro === fila.idParametro
    );

    if (existente) {
      existente.totalCantidad += fila.cantidadParametro;
      existente.posiciones.push({
        posicion: posicionFinal,
        cantidad: fila.cantidadParametro,
      });
    } else {
      datosProcesados.push({
        nombreParametro: fila.nombreParametro,
        metodoParametro: fila.metodoParametro,
        acreditacionParametro: fila.acreditacionParametro,
        idParametro: fila.idParametro,
        totalCantidad: fila.cantidadParametro,
        posiciones: [
          { posicion: posicionFinal, cantidad: fila.cantidadParametro },
        ],
      });
    }
  });

  let yPos = 280; // Posición inicial en el eje Y
  let totalCantidadParametros = 0;

  datosProcesados.map((item) => {
    totalCantidadParametros += item.totalCantidad;
    // Rectángulo y texto para el nombre del parámetro
    doc.rect(50, yPos, 130, 10).stroke();
    doc.fontSize(8).text(item.nombreParametro, 53, yPos + 2, {
      // +5 para centrar verticalmente
      width: "100%",
      height: height,
      align: "center",
      valign: "center",
    });

    // Rectángulo y texto para el método del parámetro
    doc.rect(180, yPos, 100, 10).stroke();
    doc.fontSize(8).text(item.metodoParametro, 185, yPos + 2, {
      width: "100%",
      height: height,
      align: "center",
      valign: "center",
    });

    // Rectángulo y texto para la acreditación
    doc.rect(280, yPos, 30, 10).stroke();
    doc
      .fontSize(8)
      .text(item.acreditacionParametro == 0 ? "NO" : "SI", 291, yPos + 2, {
        width: "100%",
        height: height,
        align: "center",
        valign: "center",
      });

    // Rectángulo y texto para un valor estático (como '4')
    doc.rect(744.16, yPos, 35.7, 10).stroke();
    doc.fontSize(8).text(item.totalCantidad, 758, yPos + 2, {
      width: "100%",
      height: height,
      align: "center",
      valign: "center",
    });

    // Dibuja las celdas
    const cellWidth = 9.03;
    const cellHeight = 10;

    for (let i = 0; i < 48; i++) {
      const x = 310 + i * cellWidth;

      doc.rect(x, yPos, cellWidth, cellHeight).stroke();

      const posicion = item.posiciones.some((p) => p.posicion === i);

      if (posicion) {
        doc.rect(x, yPos, 9.03, 10).stroke();
        doc.fontSize(8).text(item.totalCantidad, x + 2, yPos + 2, {
          width: "100%",
          height: height,
          align: "center",
          valign: "center",
        });
      } else {
        doc
          .fillColor("#f3f3f3")
          .rect(x + 1, yPos + 1, cellWidth - 1, cellHeight - 2)
          .fill();

        doc
          .fillColor("black")
          .fontSize(6)
          .text("X", x, yPos + 2, {
            width: cellWidth,
            align: "center",
          });
      }
    }
    yPos += 10;
  });

  doc.rect(50, yPos, 260, 15).stroke();
  doc.fontSize(8).text("TOTAL", 157, yPos + 4, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(310, yPos, 435, 15).stroke();

  doc.rect(744.16, yPos, 35.7, 15).stroke();
  doc.fontSize(8).text(totalCantidadParametros, 758, yPos + 5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  if (datos.info.status_solicitud <= 1) {
    doc.fontSize(10).text("ELABORO", 240, 465, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 490, 200, 20).stroke();
    doc.fontSize(10).text("ACC", 250, 495, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 510, 200, 20).stroke();
    doc.fontSize(8).text("ING.CRISTINA DE LOS SANTOS VENTURA", 180, 505, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  } else if (datos.info.status_solicitud >= 2) {
    doc.fontSize(10).text("ELABORO", 240, 465, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 480, 200, 20).stroke();
    doc.fontSize(10).text("ACC", 250, 485, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(160, 500, 200, 20).stroke();
    doc.fontSize(8).text("ING.CRISTINA DE LOS SANTOS VENTURA", 180, 505, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.fontSize(10).text("AUTORIZO", 540, 465, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(460, 480, 200, 20).stroke();
    doc.fontSize(10).text("JDFCALA", 545, 485, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(460, 500, 200, 20).stroke();
    doc.fontSize(8).text("ING.FRANCISCO DE LOS SANTOS TORRES", 480, 505, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  }
  doc.end();

  return doc;
};

//  generar pdf de parametros de orden
export const generarParametrosOrden = (
  datos,
  datos2,
  fechasPorProyecto,
  nombreArchivo = "salida.pdf"
) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  

  const x = 100;
  const y = 100;
  const width = 50;
  const height = 30;

  const { info, detalles } = datos;

  // -------------------------------
  // Agrega el texto dentro de la celda con padding
  doc.fontSize(10).text("Organismos de cuenca Frontera Sur", 360, 30, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 315, 43, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 340, 56, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.fontSize(12).text("DATOS GENERALES", 80, 160, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(65, 174, 700, 15).stroke();
  const fecha = new Date(datos.info.fechaSolicitud);
  const fechaFormateada = fecha.toISOString().split("T")[0];
  var fechaordenFormateada = 0;

  if (datos.info.fechaOrden) {
    const fechaorden = new Date(datos.info.fechaOrden);
    fechaordenFormateada = fechaorden.toISOString().split("T")[0];
  } else {
    fechaordenFormateada = " ";
  }
  doc.fontSize(10).text("Fecha Solicitud", 85, 178, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(fechaFormateada, 220, 178, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Fecha Orden", 320, 178, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(fechaordenFormateada, 400, 178, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text("Numero de Solicitud", 540, 178, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(10).text(datos.info.numSolicitud, 690, 178, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // Agregar una imagen (ajusta la ruta y las dimensiones)
    const isProd = process.mainModule?.filename.includes('app.asar');
  const basePath = isProd
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
    : path.join(__dirname, 'public');

  const imagePath = path.join(basePath, 'conagua.png');

  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 100, 70, { width: 180, height: 70 });
  } else {
    doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
  }
  
  doc.rect(280, 75, 325, 65).stroke();
  doc.fontSize(15).text(" ORDEN DE PARAMETROS", 280, 100, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.fontSize(15).text("F-PROT-4", 600, 100, {
    width: 160,
    height: height - 5,
    align: "center",
    valign: "center",
  });

  doc.fontSize(12).text("ORDEN DE PARAMETROS", 280, 205, {
    width: 325,
    height: height - 5,
    align: "center",
    valign: "center",
  });
  doc.rect(50, 220, 130, 20).stroke();
  doc.fontSize(8).text("Parametros", 95, 227, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(180, 220, 100, 20).stroke();
  doc.fontSize(8).text("Metodos", 215, 227, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(280, 220, 30, 20).stroke();
  doc.fontSize(6).text("ACREDI", 284, 227, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(310, 220, 470, 10).stroke();
  doc.fontSize(8).text("MES/NUMERO DE MUESTRAS", 465, 222, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(310, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("ENE", 320, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(346.15, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("FEB", 357, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(382.3, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("MAR", 392.3, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(418.45, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("ABR", 428.45, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(454.6, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("MAY", 464.6, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(490.75, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("JUN", 500.75, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(526.9, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("JUL", 536.9, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(563.05, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("AGO", 572.05, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(599.2, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("SEP", 609.2, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(635.35, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("OCT", 645.35, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(671.5, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("NOV", 679.5, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(707.65, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("DIC", 717.65, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(743.8, 230, 36.15, 10).stroke();
  doc.fontSize(8).text("TOTAL", 749.8, 232, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  const datosProcesados = [];

  datos2.forEach((fila) => {
    const fecha = new Date(fechasPorProyecto[fila.idProyecto]);
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();

    let posicionMes = 1;
    if (dia >= 8 && dia <= 14) posicionMes = 2;
    else if (dia >= 15 && dia <= 22) posicionMes = 3;
    else if (dia >= 23) posicionMes = 4;

    const posicionFinal = (mes - 1) * 4 + posicionMes;

    const existente = datosProcesados.find(
      (p) => p.idParametro === fila.idParametro
    );

    if (existente) {
      existente.totalCantidad += fila.cantidadParametro;
      existente.posiciones.push({
        posicion: posicionFinal,
        cantidad: fila.cantidadParametro,
      });
    } else {
      datosProcesados.push({
        nombreParametro: fila.nombreParametro,
        metodoParametro: fila.metodoParametro,
        acreditacionParametro: fila.acreditacionParametro,
        idParametro: fila.idParametro,
        totalCantidad: fila.cantidadParametro,
        posiciones: [
          { posicion: posicionFinal, cantidad: fila.cantidadParametro },
        ],
      });
    }
  });

  let yPos = 240; // Posición inicial en el eje Y
  let totalCantidadParametros = 0;

  datosProcesados.map((item) => {
    totalCantidadParametros += item.totalCantidad;
    // Rectángulo y texto para el nombre del parámetro
    doc.rect(50, yPos, 130, 10).stroke();
    doc.fontSize(8).text(item.nombreParametro, 53, yPos + 2, {
      // +5 para centrar verticalmente
      width: "100%",
      height: height,
      align: "center",
      valign: "center",
    });

    // Rectángulo y texto para el método del parámetro
    doc.rect(180, yPos, 100, 10).stroke();
    doc.fontSize(8).text(item.metodoParametro, 185, yPos + 2, {
      width: "100%",
      height: height,
      align: "center",
      valign: "center",
    });

    // Rectángulo y texto para la acreditación
    doc.rect(280, yPos, 30, 10).stroke();
    doc
      .fontSize(8)
      .text(item.acreditacionParametro == 0 ? "NO" : "SI", 291, yPos + 2, {
        width: "100%",
        height: height,
        align: "center",
        valign: "center",
      });

    // Rectángulo y texto para un valor estático (como '4')
    doc.rect(744.16, yPos, 35.7, 10).stroke();
    doc.fontSize(8).text(item.totalCantidad, 758, yPos + 2, {
      width: "100%",
      height: height,
      align: "center",
      valign: "center",
    });

    // Dibuja las celdas
    const cellWidth = 9.03;
    const cellHeight = 10;

    for (let i = 0; i < 48; i++) {
      const x = 310 + i * cellWidth;

      doc.rect(x, yPos, cellWidth, cellHeight).stroke();

      const posicion = item.posiciones.some((p) => p.posicion === i);

      if (posicion) {
        doc.rect(x, yPos, 9.03, 10).stroke();
        doc.fontSize(8).text(item.totalCantidad, x + 2, yPos + 2, {
          width: "100%",
          height: height,
          align: "center",
          valign: "center",
        });
      } else {
        doc
          .fillColor("#f3f3f3")
          .rect(x + 1, yPos + 1, cellWidth - 1, cellHeight - 2)
          .fill();

        doc
          .fillColor("black")
          .fontSize(6)
          .text("X", x, yPos + 2, {
            width: cellWidth,
            align: "center",
          });
      }
    }
    yPos += 10;
  });

  doc.rect(50, yPos, 260, 15).stroke();
  doc.fontSize(8).text("TOTAL", 157, yPos + 4, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(310, yPos, 435, 15).stroke();

  doc.rect(744.16, yPos, 35.7, 15).stroke();
  doc.fontSize(8).text(totalCantidadParametros, 758, yPos + 5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.fontSize(10).text("ELABORO", 180, 415, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(100, 430, 200, 20).stroke();
  doc.fontSize(10).text("ACC", 190, 435, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(100, 450, 200, 20).stroke();
  doc.fontSize(8).text("ING.CRISTINA DE LOS SANTOS VENTURA", 120, 455, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  if (datos.info.status_solicitud >= 2) {
    doc.fontSize(10).text("ANALISTAS", 540, 385, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(370, 400, 200, 35).stroke();
    doc.rect(370, 435, 200, 20).stroke();
    doc.fontSize(8).text("MARICELA ARISMENDIZ DE PAZ", 410, 441, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(370, 465, 200, 35).stroke();
    doc.rect(370, 500, 200, 20).stroke();
    doc.fontSize(8).text("CESAR URBINA HERNANDEZ", 410, 505, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(580, 400, 200, 35).stroke();
    doc.rect(580, 435, 200, 20).stroke();
    doc.fontSize(8).text(" FABIAN ARROYO COUTIÑO", 617, 441, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(580, 465, 200, 35).stroke();
    doc.rect(580, 500, 200, 20).stroke();
    doc.fontSize(8).text("EMANUEL RIOS INFANZON", 617, 505, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });

    doc.rect(580, 530, 200, 35).stroke();
    doc.rect(580, 565, 200, 20).stroke();
    doc.fontSize(8).text("HERNÁN FEDERICO GUTÍERREZ ROBLEDO", 600, 570, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  }

  doc.end();

  return doc;
};

//  generar pdf de etiquetas
export const generarPDFEtiquetas = (
  etiquetas,
  nombreArchivo = "salida.pdf"
) => {
  const doc = new PDFDocument({ size: "A4" });



  const etiquetasPorFila = 2; // antes: 2
  const etiquetasPorColumna = 4; // antes: 2

  const blockWidth = 245; // nuevo tamaño más pequeño
  const blockHeight = 185;

  const startX = 20;
  const startY = 5;
  const gapX = 35;
  const gapY = 10;

  const drawEtiqueta = (x, y, datos) => {
    const {
      nombreProyecto,
      nombre,
      fechaMuestreo,
      nombres,
      conservador,
      recipientes,
      nombre_mostrador,
    } = datos;

    const anchoMarco = 250;
    const altoMarco = 176;

    // Marco general
    doc.rect(x, y, anchoMarco, altoMarco).stroke();

    // Encabezado
    const isProd = process.mainModule?.filename.includes('app.asar');
    const basePath = isProd
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
      : path.join(__dirname, 'public');

    const imagePath = path.join(basePath, 'conagua.png');

    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, x + 10, y + 5, { width: 60 });
    } else {
      doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
    }
    
    doc.rect(x + 70, y + 0, 100, 30).stroke();
    doc.fontSize(8).text("IDENTIFICACION\nDE MUESTRAS", x + 75, y + 6, {
      width: 90,
      align: "center",
    });
    doc.rect(x + 175, y + 0, 70, 30).stroke();
    doc.fontSize(8).text("FIPM2-1", x + 185, y + 10, {
      width: 50,
      align: "center",
    });

    // Info laboratorio
    doc.rect(x + 0, y + 35, 250, 30).stroke();
    doc.fontSize(6).text("Organismos de cuenca Frontera Sur", x + 25, y + 38, {
      width: 220,
      align: "right",
    });
    doc.text(
      "LABORATORIO REGIONAL DE CALIDAD DEL AGUA FRONTERA SUR",
      x + 25,
      y + 46,
      {
        width: 220,
        align: "right",
      }
    );
    doc.text("Tuxtla Gutiérrez, Chiapas", x + 25, y + 54, {
      width: 220,
      align: "right",
    });

    // Punto de muestreo
    doc.fontSize(10);
    const textoPunto = `PUNTO DE MUESTREO: ${nombre}`;
    const altoPunto = doc.heightOfString(textoPunto, { width: 245 }) + 2;

    doc.rect(x, y + 65, 250, altoPunto).stroke();
    doc.text(textoPunto, x + 5, y + 67, {
      width: 245,
    });

    // Proyecto
    doc.fontSize(8);
    const textoProyecto = `NOMBRE DEL PROYECTO: ${nombreProyecto}`;
    const altoProyecto = doc.heightOfString(textoProyecto, { width: 245 }) + 4;

    const yProyecto = y + 65 + altoPunto;
    doc.rect(x, yProyecto, 250, altoProyecto).stroke();
    doc.text(textoProyecto, x + 5, yProyecto + 2, {
      width: 245,
    });

    let yActual = yProyecto + altoProyecto; // Nueva posición base

    // Fecha y hora
    doc.rect(x, yActual, 110, 15).stroke();
    doc.text(`Fecha: ${fechaMuestreo || ""}`, x + 5, yActual + 4);

    doc.rect(x + 110, yActual, 140, 15).stroke();
    doc.text(`HORA:`, x + 120, yActual + 4);

    // Conservador
    doc.rect(x, yActual + 15, 110, 15).stroke();
    doc.text(`CONSERVADOR`, x + 5, yActual + 19);
    doc.rect(x + 60, yActual + 30, 50, 15).stroke();
    doc
      .fontSize(6)
      .text(conservador === "ND" ? "N/A" : "N/A", x + 35, yActual + 34, {
        width: 45,
        align: "left",
      });

    // Recipiente
    doc.rect(x + 110, yActual + 15, 140, 15).stroke();
    doc.fontSize(6).text("RECIPIENTE DE MUESTREO", x + 160, yActual + 20, {
      width: 85,
      align: "right",
    });
    doc.rect(x + 190, yActual + 30, 60, 15).stroke();
    doc.fontSize(6).text(recipientes, x + 155, yActual + 34, {
      width: 45,
      align: "left",
    });

    // Parámetros
    doc.rect(x + 0, y + 146, 250, 15).stroke();
    doc.fontSize(10).text(`PARÁMETROS: ${nombres.join(", ")}`, x + 5, y + 150, {
      width: 240,
    });

    // Muestrador
    doc.rect(x + 0, y + 161, 250, 15).stroke();
    doc
      .fontSize(8)
      .text(
        `NOMBRE Y FIRMA DEL MUESTRADOR: ${nombre_mostrador || ""}`,
        x + 5,
        y + 170,
        {
          width: 240,
        }
      );
  };

  etiquetas.forEach((etiqueta, i) => {
    const col = i % etiquetasPorFila;
    const row = Math.floor(i / etiquetasPorFila) % etiquetasPorColumna;
    const page = Math.floor(i / (etiquetasPorFila * etiquetasPorColumna));

    if (i % 8 === 0 && i !== 0) doc.addPage();

    const posX = startX + col * (blockWidth + gapX);
    const posY = startY + row * (blockHeight + gapY);

    drawEtiqueta(posX, posY, etiqueta);
  });

  doc.end();

  return doc;
};

export const generarChecklist = (datos, nombreArchivo = "salida.pdf") => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });


  const x = 100;
  const y = 100;
  const width = 50;
  const height = 30;

  const { info, detalles } = datos;

  // -------------------------------
  // Agrega el texto dentro de la celda con padding
  doc.fontSize(10).text("Organismos de cuenca Frontera Sur", 360, 30, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc
    .fontSize(10)
    .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 315, 43, {
      width: "100%",
      height: height - 10,
      align: "center",
      valign: "center",
    });
  doc.fontSize(10).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 340, 56, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // Agregar una imagen (ajusta la ruta y las dimensiones)
  const isProd = process.mainModule?.filename.includes('app.asar');
    const basePath = isProd
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
      : path.join(__dirname, 'public');

    const imagePath = path.join(basePath, 'conagua.png');

    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, 100, 70, { width: 180, height: 70 });
    } else {
      doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
    }
  // doc.image("./public/conagua.png", 100, 70, { width: 180, height: 70 });
  doc.rect(280, 75, 325, 65).stroke();
  doc
    .fontSize(12)
    .text(
      "LISTA DE CHEQUEO DE MATERIAL, REACTIVOS,\n EQUIPO Y PAPELERIA",
      280,
      95,
      {
        width: 325,
        height: height + 20,
        align: "center",
        valign: "center",
      }
    );
  doc.fontSize(15).text("F-IPM2-2", 600, 100, {
    width: 160,
    height: height - 5,
    align: "center",
    valign: "center",
  });

  // ---------------------------

  doc.rect(100, 140, 220, 45).stroke();
  doc.fontSize(10).text("DESCRIPCION", 172.5, 157.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(320, 140, 220, 15).stroke();
  doc.fontSize(8).text("CANTIDAD", 410, 145, {
    width: "100px",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  doc.rect(320, 155, 110, 30).stroke();
  doc.fontSize(10).text("ANTES DEL\nMUESTREO", 325, 160, {
    width: 100,
    height: height,
    align: "center",
    valign: "center",
  });

  doc.rect(430, 155, 110, 30).stroke();
  doc.fontSize(10).text("DESPUES DEL\nMUESTREO", 435, 160, {
    width: 100,
    height: height,
    align: "center",
    valign: "center",
  });

  doc.rect(540, 140, 220, 45).stroke();
  doc.fontSize(10).text("OBSERVACIONES", 612.5, 157.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // contenido

  // contenido agrupado por tipo de material
  const maxY = 520; // Límite vertical antes de crear nueva página
  let startY = 200;
  const rowHeight = 15;

  for (const tipo in datos.materialesPorTipo) {
    const materiales = datos.materialesPorTipo[tipo];

    // Verifica si hay espacio antes de agregar encabezado de tipo
    if (startY + rowHeight > maxY) {
      doc.addPage({ size: "A4", layout: "landscape" });
      startY = 50;
    }

    // Encabezado del tipo
    doc.fillColor("#f3f3f3").rect(100, startY, 660, rowHeight).fill();
    doc.rect(100, startY, 660, rowHeight).stroke();
    doc
      .fontSize(9)
      .fillColor("black")
      .text(tipo.toUpperCase(), 130, startY + 5);
    startY += rowHeight;

    // Filas de materiales
    for (let i = 0; i < materiales.length; i++) {
      const material = materiales[i];

      // Si ya no hay espacio, agregamos página nueva
      if (startY + rowHeight > maxY) {
        doc.addPage({ size: "A4", layout: "landscape" });
        startY = 50;
      }

      doc.rect(100, startY, 220, rowHeight).stroke();
      doc.fontSize(8).text(material.nombre || "", 100, startY + 5, {
        width: 220,
        align: "center",
      });

      doc.rect(320, startY, 110, rowHeight).stroke();
      doc.fontSize(8).text(material.cantidadAntes || "", 320, startY + 5, {
        width: 110,
        align: "center",
      });

      doc.rect(430, startY, 110, rowHeight).stroke();
      doc.rect(540, startY, 220, rowHeight).stroke();

      startY += rowHeight;
    }
  }

  if (startY + 100 > maxY) {
    doc.addPage({ size: "A4", layout: "landscape" });
    startY = 50;
  }

  // Altura inicial de la barra final después de la tabla de materiales
  const barraFinalY = startY + 10;

  // Lado izquierdo
  doc.rect(100, barraFinalY, 170, 45).stroke();
  doc.fontSize(9).text(" Muestrador: ", 162.5, barraFinalY + 17.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(265, barraFinalY, 55, 45).stroke();
  doc.fontSize(9).text("Fecha: ", 282.5, barraFinalY + 12.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // Segunda fila lado izquierdo
  doc.rect(100, barraFinalY + 45, 55, 45).stroke();
  doc.fontSize(9).text(" Firma: ", 112.5, barraFinalY + 65.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(155, barraFinalY + 45, 55, 45).stroke();
  doc.fontSize(9).text(" Recibe: ", 165, barraFinalY + 55.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(9).text("Entrega: ", 166, barraFinalY + 70.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(210, barraFinalY + 45, 55, 22.5).stroke();
  doc.rect(210, barraFinalY + 67.5, 55, 22.5).stroke();
  doc.rect(265, barraFinalY + 45, 55, 22.5).stroke();
  doc.rect(265, barraFinalY + 67.5, 55, 22.5).stroke();

  // Lado derecho
  doc.rect(430, barraFinalY, 200, 45).stroke();
  doc.fontSize(9).text("Recepcion de Muestras", 480, barraFinalY + 17.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(630, barraFinalY, 130, 45).stroke();
  doc.fontSize(9).text("Fecha: ", 680, barraFinalY + 17.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });

  // Segunda fila lado derecho
  doc.rect(430, barraFinalY + 45, 85, 45).stroke();
  doc.fontSize(9).text(" Firma: ", 452.5, barraFinalY + 62.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(515, barraFinalY + 45, 115, 45).stroke();
  doc.fontSize(9).text(" Recibe: ", 535, barraFinalY + 55.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.fontSize(9).text("Entrega: ", 536, barraFinalY + 70.5, {
    width: "100%",
    height: height - 10,
    align: "center",
    valign: "center",
  });
  doc.rect(630, barraFinalY + 45, 130, 22.5).stroke();
  doc.rect(630, barraFinalY + 67.5, 130, 22.5).stroke();

  doc.end();

  return doc;
};

export const generarCustodiaExterna = (
  informacionGeneral,
  recipientesMuestreo,
  puntosMuestreo,
  nombreArchivo = "salida.pdf"
) => {
  const doc = new PDFDocument({ size: [690, 850], layout: "landscape" });

  const height = 30;
  const porPagina = 8;
  const bloques = [];
  for (let i = 0; i < puntosMuestreo.length; i += porPagina) {
    bloques.push(puntosMuestreo.slice(i, i + porPagina));
  }
  let Lety = 250;
  const alturaFila = 20;
  let sumaTotalRecipientes = 0;

  bloques.forEach((bloque, pageIndex) => {
    if (pageIndex > 0) doc.addPage({ size: [690, 850], layout: "landscape" });
    Lety = 250;

    const isProd = process.mainModule?.filename.includes('app.asar');
    const basePath = isProd
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
      : path.join(__dirname, 'public');

    const imagePath = path.join(basePath, 'conagua.png');

    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, 20, 0, { width: 200, height: 80 });
    } else {
      doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
    }

    // doc.image("./public/conagua.png", 20, 0, { width: 200, height: 80 });
    doc.rect(210, 0, 565, 80).stroke();
    doc.fontSize(8).text("ORGANISMO DE CUENCA FRONTERA SUR", 555, 10, {
      width: 250,
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.fontSize(8).text("DIRECCION TECNICA", 595, 20, {
      width: 250,
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc
      .fontSize(8)
      .text("DEPARTAMENTO DE CALIDAD DEL AGUA E IMPACTO AMBIENTAL", 460, 30, {
        width: 350,
        height: height - 10,
        align: "center",
        valign: "center",
      });
    doc
      .fontSize(8)
      .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 530, 40, {
        width: 250,
        height: height - 10,
        align: "center",
        valign: "center",
      });
    doc.fontSize(8).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 530, 50, {
      width: 300,
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(775, 0, 75, 60).stroke();
    doc.fontSize(8).text("N° Folio:", 785, 10, {
      width: 50,
      height: height - 5,
      align: "center",
      valign: "center",
    });
    doc.fontSize(9).text(informacionGeneral.numSolicitud, 795, 30);
    doc.rect(775, 60, 75, 20).stroke();

    doc.fontSize(8).text("F-IPM3-2", 785, 65, {
      width: 50,
      height: height - 5,
      align: "center",
      valign: "center",
    });

    // LADO DERECHO DE LA INFORMACION
    doc.rect(10, 80, 450, 55).stroke();
    doc
      .fontSize(10)
      .text("CADENA DE CUSTODIA EXTERNA-RECEPCION DE MUESTRAS", 20, 90, {
        width: 250,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc
      .fontSize(9)
      .text("PROYECTO:      " + informacionGeneral.nombreProyecto, 20, 120, {
        width: 250,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc.rect(10, 135, 450, 30).stroke();
    doc
      .fontSize(9)
      .text("LABORATORIO:     " + informacionGeneral.laboratorio, 20, 153, {
        width: 250,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc.rect(10, 165, 450, 30).stroke();
    doc
      .fontSize(9)
      .text("DIRECCION:   " + informacionGeneral.direccion, 20, 183, {
        width: 350,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc.rect(10, 195, 450, 30).stroke();
    doc
      .fontSize(9)
      .text(
        "TELEFONO: " +
          informacionGeneral.telefono +
          "  ext. " +
          informacionGeneral.ext,
        20,
        213,
        {
          width: 250,
          height: height - 10,
          align: "left",
          valign: "center",
        }
      );
    doc.fontSize(9).text("FAX: ", 220, 213, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });

    const recipientesUnicos = recipientesMuestreo;

    // Títulos estáticos
    doc.rect(10, 225, 200, 25).stroke();
    doc
      .fontSize(9)
      .text("IDENTIFICACION DE MUESTRAS", 45, 235, { align: "left" });

    doc.rect(210, 225, 60, 25).stroke();
    doc.fontSize(9).text("FECHA", 225, 235, { align: "left" });

    doc.rect(270, 225, 50, 25).stroke();
    doc.fontSize(9).text("HORA", 283, 235, { align: "left" });

    doc.rect(320, 225, 70, 25).stroke();
    doc.fontSize(9).text("MATRIZ", 337, 235, { align: "left" });

    doc.rect(390, 225, 70, 25).stroke();
    doc.fontSize(9).text("TIPO AGUA", 400, 235, { align: "left" });

    // Configuración recipientes
    const startX = 460;
    const startYC = 105;
    const colWidth = 28.6;
    const colHeight = 145;
    const anchoExtra = 28.6;

    // Título principal de recipientes (una sola vez)
    doc
      .rect(startX, 80, colWidth * (11 * recipientesUnicos.length), 25)
      .stroke();
    doc.fontSize(10).text("RECIPIENTES DE MUESTREO", startX + 90, 90);

    // Dibujar encabezado de recipientes (una vez)
    recipientesUnicos.forEach((recipiente, index) => {
      const x = startX + index * colWidth;

      doc.rect(x, startYC, colWidth, colHeight).stroke();
      doc.fontSize(6).text(recipiente.nombre, x + 2, startYC + 60, {
        width: colWidth - 4,
        align: "center",
      });

      doc
        .rect(x, 405, colWidth, 20)
        .stroke()
        .fontSize(8)
        .text(recipiente.reactivos === true ? "SI" : "NO", x + 8, 410);
      doc
        .rect(x, 425, colWidth, 30)
        .stroke()
        .fontSize(8)
        .text(recipiente.hielo === true ? "SI" : "NO", x + 8, 430);
      doc
        .rect(x, 455, colWidth, 30)
        .stroke()
        .fontSize(8)
        .text(recipiente.phAdecuado === true ? "SI" : "NO", x + 8, 460);

      // console.log(recipiente.nombre+ ' '+ recipiente.reactivos +' '+recipiente.hielo+' '+recipiente.phAdecuado);
    });

    const startY = 105;
    bloque.forEach((punto, i) => {
      const fechaFormateada = new Date(punto.fecha).toLocaleDateString(
        "es-ES",
        {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }
      );
      const horaFormateada = punto.hora?.slice(0, 5) || "";
      let cantidadTotal = 0;
      let bloqueLleno = 0;

      doc.rect(10, Lety, 200, alturaFila).stroke();
      doc.fontSize(10).text(punto.nombrePuntoMuestreo, 15, Lety + 7);

      doc.rect(210, Lety, 60, alturaFila).stroke();
      doc.fontSize(10).text(fechaFormateada, 220, Lety + 7);

      doc.rect(270, Lety, 50, alturaFila).stroke();
      doc.fontSize(10).text(horaFormateada, 283, Lety + 7);

      doc.rect(320, Lety, 70, alturaFila).stroke();
      doc
        .fontSize(8)
        .text(punto.matriz === 1 ? "MANATINAL" : "ARROYO", 334, Lety + 7);

      doc.rect(390, Lety, 70, alturaFila).stroke();
      doc
        .fontSize(8)
        .text(punto.tipoAgua === 1 ? "POTABLE" : "DESECHO", 406, Lety + 7);

      // Dibujar cantidades de recipientes para este punto
      recipientesUnicos.forEach((recipiente, index) => {
        const x = startX + index * colWidth;
        const r = punto.recipientes.find((r) => r.nombre === recipiente.nombre);

        doc.rect(x, Lety, anchoExtra, alturaFila).stroke();
        if (r) {
          doc.fontSize(8).text(r.cantidad, x + 12, Lety + 7);
          cantidadTotal += r.cantidad;
        } else {
          doc
            .fillColor("#f3f3f3")
            .rect(x + 3, Lety + 3, anchoExtra - 5, alturaFila - 5)
            .fill();
          doc
            .fillColor("black")
            .fontSize(6)
            .stroke()
            .text("X", x + 10, Lety + 8);
        }

        bloqueLleno += 1;
      });

      // AQUI VAN LOS RECIPIENTES VACIOS RESTANTES QUE SE ITERAN

      const totalvacios = 11 - bloqueLleno;
      let xV = startX + bloqueLleno * colWidth;

      for (let i = 0; i < totalvacios; i++) {
        // bloque nombre recipiente
        doc.rect(xV, startY, colWidth, colHeight).stroke();
        doc
          .fillColor("#f3f3f3")
          .rect(xV + 3, startY + 3, colWidth - 5, colHeight - 5)
          .fill();
        doc
          .fillColor("black")
          .fontSize(6)
          .stroke()
          .text("X", xV + 10, startY + 60);

        // bloque cantidad recipiente
        doc.rect(xV, Lety, anchoExtra, alturaFila).stroke();
        doc
          .fillColor("#f3f3f3")
          .rect(xV + 3, Lety + 3, anchoExtra - 5, alturaFila - 5)
          .fill();
        doc
          .fillColor("black")
          .fontSize(6)
          .stroke()
          .text("X", xV + 10, Lety + 8);

        // bloques bajos
        doc.rect(xV, 405, 28.6, 20).stroke();
        doc
          .fillColor("#f3f3f3")
          .rect(xV + 3, 408, 23.6, 15)
          .fill();
        doc
          .fillColor("black")
          .fontSize(6)
          .stroke()
          .text("X", xV + 12, 413);

        doc.rect(xV, 425, 28.6, 30).stroke();
        doc
          .fillColor("#f3f3f3")
          .rect(xV + 3, 428, 23.6, 25)
          .fill();
        doc
          .fillColor("black")
          .fontSize(6)
          .stroke()
          .text("X", xV + 12, 438);

        doc.rect(xV, 455, 28.6, 30).stroke();
        doc
          .fillColor("#f3f3f3")
          .rect(xV + 3, 458, 23.6, 25)
          .fill();
        doc
          .fillColor("black")
          .fontSize(6)
          .stroke()
          .text("X", xV + 12, 468);

        xV += colWidth;
      }

      // AQUI TERMINA EL ESPACIO

      // Total recipiente a la derecha
      doc.rect(775, Lety, 75, alturaFila).stroke();
      doc.fontSize(10).text(cantidadTotal, 810, Lety + 5);

      Lety += alturaFila;
      sumaTotalRecipientes += cantidadTotal;
    });

    // Bloque total vertical y número final
    doc.rect(775, 80, 75, 170).stroke();
    doc.save(); // Guarda el estado actual del documento

    doc.rotate(-90, { origin: [750, 165] }); // Rota 45° desde ese punto
    doc.fontSize(10).text("TOTAL RECIPIENTES", 680, 225, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    }); // Escribe el texto

    doc.restore();
    doc.fontSize(10).text(sumaTotalRecipientes, 810, 460);

    doc.rect(10, 405, 260, 80).stroke();
    doc
      .fontSize(8)
      .text(
        "NOMBRE DEL MUESTRADOR: " + informacionGeneral.muestrador,
        30,
        415,
        {
          width: 250,
          height: height - 10,
          align: "left",
          valign: "center",
        }
      );
    doc.fontSize(8).text("FIRMA", 30, 455, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(270, 405, 120, 50).stroke();
    doc.fontSize(8).text("PRESERVACIÓN", 275, 410, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(270, 455, 120, 30).stroke();
    doc.fontSize(8).text("CONSERVACION EN HIELO", 274, 460, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });

    doc.rect(390, 405, 70, 20).stroke();
    doc.fontSize(8).text("pH (2,>12)", 402, 410);
    doc.rect(390, 425, 70, 30).stroke();
    doc.fontSize(8).text(" REACTIVOS: \n H2SO4, HNO3,\n HCL, NaOH", 397, 427);
    doc.rect(390, 455, 70, 30).stroke();
    doc.fontSize(10).text("SI/NO", 415, 460);

    doc.rect(774.6, 405, 75, 80).stroke();
    doc.fontSize(8).text("TOTAL DE \n RECIPIENTES", 780, 420, {
      width: 70,
      height: height - 10,
      align: "center",
      valign: "center",
    });

    // ------OBSERVACIONES-------

    doc.rect(10, 485, 380, 50).stroke();
    doc.fontSize(8).text("OBSERVACIONES", 30, 500, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(informacionGeneral.observaciones, 30, 515, {
      width: 400,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(10, 535, 380, 90).stroke();
    doc.fontSize(8).text("PARAMETROS FUERA DE TIEMPO DE ANALISIS", 30, 545, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc
      .fontSize(8)
      .text(
        "NOMBRE Y FIRMA DE QUIEN AUTORIZA SE REALICEN LOS ANALISIS",
        50,
        607,
        {
          width: 350,
          height: height - 10,
          align: "left",
          valign: "center",
        }
      );
    doc.fontSize(10).text("Ing. Cristina De Los Santos", 120, 595, {
      width: 350,
      height: height - 10,
      align: "left",
      valign: "center",
    });

    const fechaFormateadaEntrega = new Date(
      informacionGeneral.fechaEntrega
    ).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const fechaFormateadaReceptor = new Date(
      informacionGeneral.fechaReceptor
    ).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    doc.rect(390, 485, 230, 35).stroke();
    doc.fontSize(8).text("Nombre Entrega", 395, 490, {
      width: 150,
      height: "auto",
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(informacionGeneral.nombreEntrega, 410, 510);
    doc.rect(620, 485, 230, 35).stroke();
    doc.fontSize(8).text("Fecha Entrega", 650, 490, {
      width: 150,
      height: 10,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(fechaFormateadaEntrega, 650, 505);
    doc.rect(390, 520, 230, 35).stroke();
    doc.fontSize(8).text("Firma", 395, 525, {
      width: 150,
      height: 10,
      align: "left",
      valign: "center",
    });

    doc.rect(620, 520, 230, 35).stroke();
    doc.fontSize(8).text("Hora Entrega", 650, 525, {
      width: 150,
      height: 10,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(informacionGeneral.horaEntrega, 650, 540);

    doc.rect(390, 555, 230, 35).stroke();
    doc.fontSize(8).text("Nombre Recepcion", 395, 560, {
      width: 150,
      height: 10,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(informacionGeneral.nombreReceptor, 410, 570);

    doc.rect(620, 555, 230, 35).stroke();
    doc.fontSize(8).text("Fecha Recepcion", 650, 560, {
      width: 150,
      height: 10,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(fechaFormateadaReceptor, 650, 570);
    doc.rect(390, 590, 230, 35).stroke();
    doc.fontSize(8).text("Firma", 395, 595, {
      width: 150,
      height: 10,
      align: "left",
      valign: "center",
    });
    doc.rect(620, 590, 230, 35).stroke();
    doc.fontSize(8).text("Hora Recepcion", 650, 595, {
      width: 150,
      height: 0,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text(informacionGeneral.horaReceptor, 660, 605);
  });

  doc.end();

  return doc;
};

export const generarHojaCampo = (
  datoSolicitud,
  parametros,
  nombreArchivo = "salida.pdf"
) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  const height = 30;

  const { info, muestras } = datoSolicitud;

  const porPagina = 5;
  const bloques = [];
  for (let i = 0; i < muestras.length; i += porPagina) {
    bloques.push(muestras.slice(i, i + porPagina));
  }

  bloques.forEach((bloque, pageIndex) => {
    if (pageIndex > 0) doc.addPage({ size: "A4", layout: "landscape" });

    // ------------------------------------
    // cabecera
    const isProd = process.mainModule?.filename.includes('app.asar');
    const basePath = isProd
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'public')
      : path.join(__dirname, 'public');

    const imagePath = path.join(basePath, 'conagua.png');

    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, 20, 0, { width: 180, height: 70 });
    } else {
      doc.fontSize(10).text('NO ENCUENTRA IMAGEN: ' + imagePath, 70, 90);
    }
    // doc.image("./public/conagua.png", 20, 0, { width: 180, height: 70 });
    doc.rect(200, 0, 250, 65).stroke();
    doc.fontSize(12).text("HOJA DE CAMPO", 200, 25, {
      width: 255,
      height: height - 5,
      align: "center",
      valign: "center",
    });
    doc.rect(450, 0, 325, 65).stroke();
    doc.fontSize(8).text("ORGANISMO DE CUENCA FRONTERA SUR", 555, 10, {
      width: 250,
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.fontSize(8).text("DIRECCION TECNICA", 595, 20, {
      width: 250,
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc
      .fontSize(8)
      .text("DEPARTAMENTO DE CALIDAD DEL AGUA E IMPACTO AMBIENTAL", 460, 30, {
        width: 350,
        height: height - 10,
        align: "center",
        valign: "center",
      });
    doc
      .fontSize(8)
      .text("LABORATORIO DE CALIDAD DE AGUA FRONTERA SUR", 530, 40, {
        width: 250,
        height: height - 10,
        align: "center",
        valign: "center",
      });
    doc.fontSize(8).text("ASEGURAMIENTO Y CONTROL DE CALIDAD", 530, 50, {
      width: 300,
      height: height - 10,
      align: "center",
      valign: "center",
    });
    doc.rect(775, 0, 75, 32.5).stroke();
    doc.fontSize(8).text("N° Folio:", 785, 10, {
      width: 50,
      height: height - 5,
      align: "center",
      valign: "center",
    });
    doc.fontSize(9).text(info.numSolicitud, 795, 20);
    doc.rect(775, 32.5, 75, 32.5).stroke();
    doc.fontSize(8).text("F-IPM3-1", 785, 45, {
      width: 50,
      height: height - 5,
      align: "center",
      valign: "center",
    });

    doc.rect(10, 80, 820, 85).stroke();
    // parte derecha de informacion
    const fechaMuestreoFormateada = new Date(
      info.fechaMuestreo
    ).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const fechaRecepcionFormateada = new Date(
      info.fechaRecepcion
    ).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    doc.fontSize(8).text("FECHA MUESTREO: " + fechaMuestreoFormateada, 20, 90, {
      width: 150,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc
      .fontSize(8)
      .text("FECHA RECEPCION: " + fechaRecepcionFormateada, 20, 105, {
        width: 150,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc.fontSize(8).text("HORA RECEPCION: " + info.horaRecepcion, 20, 120, {
      width: 150,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.fontSize(8).text("NOMBRE PROYECTO:  " + info.nombre_proyecto, 20, 135, {
      width: 250,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc
      .fontSize(8)
      .text("TIPO DE ESTUDIO: [  ] SIMPLE    [  ]  COMPUESTO ", 20, 150, {
        width: 250,
        height: height - 10,
        align: "left",
        valign: "center",
      });

    // parte izquierda de informacion
    doc
      .fontSize(8)
      .text("NOMBRE/FIRMA MUESTRADOR: " + info.muestrador, 400, 90, {
        width: 150,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc.fontSize(8).text("NOMBRE/FIRMA RECEPTOR: " + info.receptor, 400, 105, {
      width: 150,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc
      .fontSize(8)
      .text("TIPO DE AGUA: [  ]  " + info.nombre_tipoAgua, 400, 120, {
        width: 250,
        height: height - 10,
        align: "left",
        valign: "center",
      });
    doc
      .fontSize(8)
      .text("FINALIDAD DE ANALISIS: [  ] " + info.nombre_finalidad, 400, 135, {
        width: 250,
        height: height - 10,
        align: "left",
        valign: "center",
      });

    doc.fontSize(8).text("NORMA UTILIZADA:", 400, 150);
    doc.fontSize(8).text(info.idNorma, 480, 150);
    doc.fontSize(8).text("- " + info.nombreNorma + "  [   ]", 550, 150);

    doc.rect(10, 170, 820, 300).stroke();
    doc.rect(10, 170, 20, 50).stroke();
    doc.fontSize(10).text("N°", 15, 180, {
      width: 30,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(30, 170, 80, 50).stroke();
    doc.fontSize(10).text("Procedencia", 40, 180, {
      width: 100,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(110, 170, 30, 50).stroke();
    doc.fontSize(10).text("Hora", 115, 180, {
      width: 100,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(140, 170, 60, 50).stroke();
    doc.fontSize(10).text("Color", 155, 180, {
      width: 100,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(200, 170, 30, 50).stroke();
    doc.fontSize(10).text("Olor", 206, 180, {
      width: 100,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(230, 170, 35, 50).stroke();
    doc.fontSize(10).text("Gasto", 235, 180);
    doc.fontSize(7).text("l/s", 245, 195);

    doc.rect(265, 170, 30, 50).stroke();
    doc.save();

    doc.rotate(-90, { origin: [255, 180] }); // Rota 45° desde ese punto
    doc.fontSize(8).text("Burbuja", 230, 202, {
      width: 100,
      height: height,
      align: "left",
      valign: "center",
    });

    doc.restore();

    doc.rect(295, 170, 30, 50).stroke();

    doc.save();

    doc.rotate(-90, { origin: [297, 180] }); // Rota 45° desde ese punto
    doc.fontSize(7).text("Transparencia \n          m", 260, 185);
    doc.restore();

    doc.rect(325, 170, 30, 50).stroke();
    doc.save();

    doc.rotate(-90, { origin: [297, 180] }); // Rota 45° desde ese punto
    doc.fontSize(8).text("Material\nFlotante", 270, 215, {
      width: 100,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.restore();

    doc.rect(355, 170, 60, 15).stroke();
    doc.fontSize(7).text("Temperatura °C", 361, 175);

    doc.rect(355, 185, 30, 35).stroke();
    doc.fontSize(8).text("AMB", 360, 190);

    doc.rect(385, 185, 30, 35).stroke();
    doc.fontSize(7).text("AGUA", 390, 190);

    doc.rect(415, 170, 50, 50).stroke();
    doc.fontSize(9).text("pH", 435, 180);
    doc.fontSize(7).text("UpH", 433, 195);
    // doc.rect(445, 170, 30, 50).stroke();
    // lo dejo por si en un futuro es necesario, solo tiene que volver a adaptar el tamaño de las celdas en el formato
    // doc.fontSize(7).text("REDOX \n   mV", 448, 185);
    doc.rect(465, 170, 45, 50).stroke();
    doc.fontSize(8).text("COND.\n    E", 477, 180);
    doc.fontSize(7).text("mS/cm", 475, 200);
    doc.rect(510, 170, 30, 50).stroke();
    doc.fontSize(9).text("SDT", 516, 182);
    doc.fontSize(7).text("mg/L", 518, 192);
    doc.rect(540, 170, 60, 15).stroke();
    doc.fontSize(8).text("OD", 565, 175);
    doc.rect(540, 185, 30, 35).stroke();
    doc.fontSize(8).text("%", 552, 195);
    doc.rect(570, 185, 30, 35).stroke();
    doc.fontSize(8).text("mg/L", 575, 195);
    // ---------RECIPIENTES DE MUESTREO------------
    doc.rect(600, 170, 230, 15).stroke();
    doc.fontSize(7).text("RECIPIENTES DE MUESTREO", 655, 175, {
      width: 150,
      height: height - 10,
      align: "left",
      valign: "center",
    });

    doc.rect(600, 185, 25, 35).stroke();
    doc.fontSize(7).text("FQ", 607, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(625, 185, 25, 35).stroke();
    doc.fontSize(7).text("GYA", 629, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(650, 185, 25, 35).stroke();
    doc.fontSize(7).text("NH3", 655, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(675, 185, 25, 35).stroke();
    doc.fontSize(7).text("ALC", 680, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(700, 185, 25, 35).stroke();
    doc.fontSize(7).text("DUR", 705, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(725, 185, 25, 35).stroke();
    doc.fontSize(7).text("H.H", 731, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(750, 185, 25, 35).stroke();
    doc.fontSize(7).text("MB", 757, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(775, 185, 27, 35).stroke();
    doc.fontSize(6).text("OTROS", 778, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });
    doc.rect(802, 185, 27, 35).stroke();
    doc.fontSize(7).text("TOTAL", 804, 195, {
      width: 50,
      height: height - 10,
      align: "left",
      valign: "center",
    });

    const startY = 220;
    const rowHeight = 50;

    // ------------------------------------
    // muestras em forEach

    bloque.forEach((muestra, index) => {
      const y = startY + index * rowHeight;
      // 🔽 Aquí va todo tu código que dibuja una fila
      // const y = startY + index * rowHeight;

      // Dibujo de celdas
      doc.rect(10, y, 20, rowHeight).stroke();
      doc.rect(30, y, 80, rowHeight).stroke();
      doc.rect(110, y, 30, rowHeight).stroke();
      doc.rect(140, y, 60, rowHeight).stroke();
      doc.rect(200, y, 30, rowHeight).stroke();
      doc.rect(230, y, 35, rowHeight).stroke();

      doc.rect(265, y, 30, rowHeight).stroke();

      doc.rect(295, y, 30, rowHeight).stroke();
      doc.rect(325, y, 30, rowHeight / 2).stroke();
      doc.rect(325, y + rowHeight / 2, 30, rowHeight / 2).stroke();
      doc.rect(355, y, 30, rowHeight).stroke();
      doc.rect(385, y, 30, rowHeight).stroke();
      doc.rect(415, y, 50, rowHeight).stroke();
      // doc.rect(445, y, 30, rowHeight).stroke();
      doc.rect(465, y, 45, rowHeight).stroke();
      doc.rect(510, y, 30, rowHeight).stroke();
      doc.rect(540, y, 30, rowHeight).stroke();
      doc.rect(570, y, 30, rowHeight).stroke();

      // Recipientes
      doc.rect(600, y, 25, rowHeight).stroke();
      doc.rect(625, y, 25, rowHeight).stroke();
      doc.rect(650, y, 25, rowHeight).stroke();
      doc.rect(675, y, 25, rowHeight).stroke();
      doc.rect(700, y, 25, rowHeight).stroke();
      doc.rect(725, y, 25, rowHeight).stroke();
      doc.rect(750, y, 25, rowHeight).stroke();
      doc.rect(775, y, 27, rowHeight).stroke();
      doc.rect(802, y, 27, rowHeight).stroke();

      const horaResetada = muestra.hora.slice(0, 5);

      // Texto en cada celda (ajusta fuentes y posicionamientos si es necesario)
      doc.fontSize(8).text(muestra.NoMuestra || "", 17, y + 15);
      doc.text(muestra.Procedencia || "", 36, y + 10, {
        width: 75,
      });
      doc.fontSize(8).text(horaResetada || "X", 114, y + 15);
      doc.fontSize(7).text(muestra.color, 143, y + 10, {
        width: 100,
        align: "left",
      });

      doc.fontSize(10).text(muestra.olor ? "P" : "A", 210, y + 15);
      doc.fontSize(8).text(muestra.gasto || "X", 233, y + 15, {
        width: 30,
        align: "center",
      });
      doc.fontSize(10).text(muestra.burbuja ? "P" : "A", 276, y + 15);
      doc.fontSize(8).text(muestra.transparencia || "X", 295, y + 15, {
        width: 30,
        align: "center",
      });

      doc
        .fontSize(10)
        .text(muestra.material_flotante === 1 ? "A" : "P", 337, y + 9);
      doc
        .fontSize(10)
        .text(muestra.material_flotante === 1 ? "V" : "N", 337, y + 32);

      doc.fontSize(8).text(muestra.tempAmb || "X", 365, y + 15);
      doc.fontSize(8).text(muestra.tempAgua || "X", 395, y + 15);

      if (muestra.pH === null) {
        doc.text(muestra.pH || "X", 425, y + 20, {
          width: 30,
          align: "center",
        });
      } else {
        doc.text(muestra.pH, 425, y + 10, {
          width: 30,
          align: "center",
        });
        doc.text("+/-", 435, y + 22);
        doc
          .fontSize(7)
          .text(
            parseFloat(muestra.pH_incertidumbre).toFixed(2) || "",
            425,
            y + 35,
            {
              width: 30,
              align: "center",
            }
          );
      }

      if (muestra.COND_E === null) {
        doc.text(muestra.COND_E || "X", 470, y + 20, {
          width: 35,
          align: "center",
        });
      } else {
        doc.text(muestra.COND_E || "X", 470, y + 10, {
          width: 35,
          align: "center",
        });
        doc.text("+/-", 483, y + 22);
        doc
          .fontSize(7)
          .text(
            parseFloat(muestra.condE_incertidumbre).toFixed(2) || "",
            470,
            y + 35,
            {
              width: 35,
              align: "center",
            }
          );
      }

      doc.fontSize(8).text(muestra.SDT || "X", 522, y + 15);

      if (muestra.OD_PORCENT === null) {
        doc.fontSize(8).text("X", 540, y + 15, {
          width: 30,
          align: "center",
        });
      } else {
        doc.text(
          parseFloat(muestra.OD_PORCENT).toFixed(1) || "X",
          540,
          y + 10,
          {
            width: 30,
            align: "center",
          }
        );
        doc.text("+/-", 550, y + 22);
        doc
          .fontSize(7)
          .text(
            parseFloat(muestra.OD_porcent_incertidumbre).toFixed(2) || "",
            540,
            y + 35,
            {
              width: 30,
              align: "center",
            }
          );
      }

      if (muestra.OD_ML === null) {
        doc.fontSize(8).text("X", 570, y + 15, {
          width: 30,
          align: "center",
        });
      } else {
        doc.text(parseFloat(muestra.OD_ML).toFixed(1) || "X", 570, y + 10, {
          width: 30,
          align: "center",
        });
        doc.text("+/-", 580, y + 22);
        doc
          .fontSize(7)
          .text(
            parseFloat(muestra.OD_ml_incertidumbre).toFixed(2) || "",
            570,
            y + 35,
            {
              width: 30,
              align: "center",
            }
          );
      }

      // Recipientes
      doc.text(muestra.FQ, 611, y + 15);
      doc.text(muestra.GYA, 636, y + 15);
      doc.text(muestra.NH3, 661, y + 15);
      doc.text(muestra.Alcalinidad, 684, y + 15);
      doc.text(muestra.Dureza, 710, y + 15);
      doc.text(muestra.H_H, 736, y + 15);
      doc.text(muestra.MB, 761, y + 15);
      doc.text(muestra.OTROS, 786, y + 15);

      // Total (última columna): suma de recipientes
      const total =
        (parseInt(muestra.FQ) || 0) +
        (parseInt(muestra.GYA) || 0) +
        (parseInt(muestra.NH3) || 0) +
        (parseInt(muestra.Alcalinidad) || 0) +
        (parseInt(muestra.Dureza) || 0) +
        (parseInt(muestra.H_H) || 0) +
        (parseInt(muestra.MB) || 0) +
        (parseInt(muestra.OTROS) || 0);

      doc.text(total, 813, y + 15);
    });
    doc.rect(10, 480, 820, 100).stroke();

    // ------------------------------------
    // pie de pagina
    doc.fontSize(10).text("PARAMETROS A DETERMINAR:", 20, 490, {
      width: 150,
      height: height - 10,
      align: "left",
      valign: "center",
    });

    doc.text(parametros.nom_rec, 40, 510);
  });

  doc.end();

  return doc;
};
