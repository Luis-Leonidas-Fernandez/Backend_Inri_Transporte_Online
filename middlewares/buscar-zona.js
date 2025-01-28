import { redondearNumber } from "../helpers/redondear.js";
import zonaRepository from "../respositories/zona_respository.js";

export const buscarZonas = async () => {
  // validar si existen zonas
  const zonas = await zonaRepository.findAll();

  if (!zonas) {
    return true;
  } else {
    return false;
  }
};

export const buscarZonaCercanaPost = async (ubicacion) => {
  // buscar las zonas mas cercanas
  const zonas = await zonaRepository.findZonaCercana(ubicacion);

  if (!zonas || zonas.length === 0) {
    const distance = 4000;
    return distance;
  } else {
    // elije la base mas cercana y redondea la distancia
    const dist = redondearNumber(zonas);

    return dist;
  }
};

export const buscarZonaCercana = async (ubicacion) => {
  // buscar las zonas mas cercanas
  const zonas = await zonaRepository.findZonaCercana(ubicacion);

  if (zonas === null || zonas.length === 0 || zonas === undefined) {
    const result = {
      basesId: null,
      dist: 4000,
    };

    return result;
  } else {
    // elije la base mas cercana y redondea la distancia
    const dist = redondearNumber(zonas);
    const basesIds = zonas[0].bases._id;

    const result = {
      basesIds,
      dist: dist,
    };

    return result;
  }
};
