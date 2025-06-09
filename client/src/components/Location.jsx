import React from "react";
import { Link } from "react-router-dom";

const Location = () => {
  return (
    <div>
      <div className="max-w-[1540px] mx-auto h-[500px] flex justify-center items-center py-8 mt-4">
        <iframe
          className="w-full"
          height={"450px"}
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=Hospital%20Central+(Sistema%20de%20Historial%20Cl%C3%ADnico%20Digital)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          title="Mapa de Ubicación"
        >
          <Link to="#">Ver ubicación del centro médico</Link>
        </iframe>
      </div>
    </div>
  );
};

export default Location;
