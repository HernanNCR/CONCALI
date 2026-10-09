import { useState } from "react";
import Menu from "./components/Menu";
import Solicitud from "./components/SolicitudT";
import Orden from "./components/Orden";
import Etiquetas from "./components/Etiquetas";
import Checklist from "./components/Checklist";
import Archivo from "./components/Archivo";
import HCampo from "./components/HCampo";
import Cexterna from "./components/Cexterna";
import Registros from "./components/Registros";
import Mensaje from "./screen/Mensaje";

function App() {
  const [paginaActual, setPaginaActual] = useState("menu");

  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  return (
    <div>

      {/* {paginaActual !== "menu" && <Nav cambiarPagina={cambiarPagina} />}  */}

      {paginaActual === "menu" && <Menu cambiarPagina={cambiarPagina} />}
      {paginaActual === "solicitud" && <Solicitud cambiarPagina={setPaginaActual} />}
      {paginaActual === "orden" && <Orden cambiarPagina={setPaginaActual} />}
      {paginaActual === "etiquetas" && <Etiquetas cambiarPagina={setPaginaActual} />}
      {paginaActual === "check" && <Checklist cambiarPagina={setPaginaActual} />}
      {paginaActual === "campo" && <HCampo cambiarPagina={setPaginaActual} />}
      {paginaActual === "externa" && <Cexterna cambiarPagina={setPaginaActual} />}
      {paginaActual === "registros" && <Registros cambiarPagina={setPaginaActual} />}
      {paginaActual === "archivos" && <Archivo cambiarPagina={setPaginaActual} />}
      {paginaActual === "mensaje" && <Mensaje cambiarPagina={setPaginaActual} />}
      

    </div>
  );
}

export default App;
