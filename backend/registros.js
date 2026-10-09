import mysql2 from 'mysql2'

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password:'root',
    database:'laboratoriodb',
})
.promise(); 

pool.getConnection() 
.then(()=>{ 
    console.log('conexion exitosa a la base de datos');
})
.catch((error) => {
    console.log('error en la conexion', error);
});
export default pool;


export async function registrarParametro(informacionGeneral){
    const {
        nombre,
        metodo,
        tipo,
        acreditacion,
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();
      

      await connection.query(
        `INSERT INTO parametros(nombreParametro, metodoParametro, acreditacionParametro, idtipoParametro,id_estado)
        VALUES (?, ?, ?, ?,?)`,
        [nombre, metodo, acreditacion, tipo,"1"]
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

export async function registrarAlmacen(informacionGeneral){
    const {
        tipo,
        nombre,
        descripcion,
        cantidad,
        cuantidad
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();
      

      await connection.query(
        `INSERT INTO almacen_laboratorio(tipoMaterial, nombreMaterial, descMaterial, cuantidadMaterial, cantidadMaterial)
        VALUES (?, ?, ?, ?,?)`,
        [tipo,nombre, descripcion,cuantidad,cantidad]
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
export async function registrarConservadores(informacionGeneral){
    const {
        nombre,
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();

      // 1. Obtener el último idConservador
        const [rows] = await connection.query(
        `SELECT MAX(idConservador) AS ultimoID FROM table_conservadores`
        );
        const nuevoID = rows[0].ultimoID ? rows[0].ultimoID + 1 : 1;
      

      await connection.query(
        `INSERT INTO table_conservadores(idConservador, name_conservador)
        VALUES (?, ?)`,
        [nuevoID,nombre]
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

export async function registrarTipoAgua(informacionGeneral){
    const {
        nombre,
        descripcion,
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();

      const [rows] = await connection.query(
        `SELECT MAX(idTipoAgua) AS ultimoID FROM tipoagua`
        );
        const nuevoID = rows[0].ultimoID ? rows[0].ultimoID + 1 : 1;
      

      await connection.query(
        `INSERT INTO tipoagua(idTipoAgua, nombreAgua, descAgua)
        VALUES (?, ?, ?)`,
        [nuevoID,nombre,descripcion]
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

export async function registrarTipoEstudios(informacionGeneral){
    const {
        nombre,
        descripcion
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();
      
      const [rows] = await connection.query(
        `SELECT MAX(idEstudio) AS ultimoID FROM tipoestudio`
        );
        const nuevoID = rows[0].ultimoID ? rows[0].ultimoID + 1 : 1;

      await connection.query(
        `INSERT INTO tipoestudio(idEstudio, nombreEstudio, descEstudio)
        VALUES (?, ?, ?)`,
        [nuevoID,nombre, descripcion]
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

export async function registrarTipoFinalidad(informacionGeneral){
    const {
        nombre,
        descripcion
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();

      const [rows] = await connection.query(
        `SELECT MAX(idFinalidad) AS ultimoID FROM tipofinalidad`
        );
        const nuevoID = rows[0].ultimoID ? rows[0].ultimoID + 1 : 1;
      
      
      await connection.query(
        `INSERT INTO tipofinalidad(idFinalidad, nombreFinalidad, descFinalidad)
        VALUES (?, ?, ?)`,
        [nuevoID,nombre,descripcion]
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

export async function registrarTipoMaterial(informacionGeneral){
    const {
        nombre,
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();
      

      await connection.query(
        `INSERT INTO tipomaterial(nombreTipo)
        VALUES (?)`,
        [nombre]
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

export async function registrarTipoMatriz(informacionGeneral){
    const {
        nombre,

    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();

      const [rows] = await connection.query(
        `SELECT MAX(idMatriz) AS ultimoID FROM tipomatriz`
        );
        const nuevoID = rows[0].ultimoID ? rows[0].ultimoID + 1 : 1;
      

      await connection.query(
        `INSERT INTO tipomatriz(idMatriz, nombreMatriz)
        VALUES (?, ?)`,
        [nuevoID,nombre]
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
export async function registrarTipoParametro(informacionGeneral){
    const {
        nombre,
        conservador,
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();
      

      await connection.query(
        `INSERT INTO tipo_parametro(Nom_rec, idConservador)
        VALUES (?, ?)`,
        [nombre, conservador]
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
export async function registrarUsuarios(informacionGeneral){
    const {
        clave,
        pass,
        tipo,
    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();
      

      await connection.query(
        `INSERT INTO usuarios(clvUsuario, passUsuario,tipoUsuario,id_estado)
        VALUES (?, ?, ?, ?)`,
        [clave, pass, tipo, "1"]
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

export async function registrarTermometros(informacionGeneral){
    const {
        ID,
        marca,
        clave,
        inicio_limite,
        final_limite,
        dato_10,
        dato_15,
        dato_25,
        dato_30,
        dato_35,
        dato_44,
        dato_50,

    } = informacionGeneral;


    const connection = await pool.getConnection();
    try {
    
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO table_termometro(idTermometro, marcaTermometro, De, A, claveTermometro, incertidumbre_10, incertidumbre_15, incertidumbre_25, incertidumbre_30, incertidumbre_35, incertidumbre_44, incertidumbre_50)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ID,marca,inicio_limite,final_limite,clave,dato_10,dato_15,dato_25,dato_30,dato_35,dato_44,dato_50]
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





