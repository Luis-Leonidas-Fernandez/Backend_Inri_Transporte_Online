import Address from "../models/ubicacion";
import Driver from "../models/driver";

export const driverConectado = async (uid = "") => {
  const driver = await Driver.findById(uid);
  driver.online = true;
  driver.status = "disponible";
  driver.order = "libre";
  await driver.save();
  return driver;
};

export const driverDesconectado = async (uid = "") => {
  const driver = await Driver.findById(uid);
  driver.online = false;
  driver.status = "no disponible";
  await driver.save();
  return driver;
};

export const grabarLocation = async (payload) => {
  try {
    const miId = req.uid;

    Address.findOneAndUpdate(
      { idDriver: miId },
      { $set: { mensaje: payload } }
    );

    return true;
  } catch (error) {
    return false;
  }
};
