// import { redondearNumber } from "../helpers/redondear.js";
import driverRepository from "../respositories/drivers_repository.js";

export const searchDrivers = async (idBase) => {
  // Buscar Conductores de una base
  const drivers = await driverRepository.findAll(idBase);

  return drivers;
};

export const updateStatusDriverAsing = async (idDriver, noDisponible) => {
  //Actualiza el Estatus del Conductor
  const resp = await driverRepository.findByIdUpdateStatus(
    idDriver,
    noDisponible
  );
  return resp;
};
