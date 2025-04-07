import fetch from "node-fetch";

/** Devuelve el ultimo valor de la nafta Super extraido desde el sitio web: https://surtidores.com.ar/precios/
 * @returns number | undefined
 */

export const getSuperGasPrice = async () => {
  try {
    const response = await fetch("https://surtidores.com.ar/precios/");
    const html = await response.text();
    // Corta la primera Tabla, la etiqueta que tiene la nafta Super, y las etiquetas donde tiene el precio del combustible
    const tdList = html
      .split("<table>")[1]
      .split("<strong>Super</strong></td>")[1]
      .split("</tr>")[0];

    const matches = [...tdList.matchAll(/<td>(.*?)<\/td>/gs)];

    const precios = matches
      .map((match) => match[1].trim()) // Extrae y elimina los espacios alrededor
      .filter((value) => value !== ""); // Filtra los vacíos

    return parseFloat(precios[precios.length - 1]);
  } catch (error) {
    console.log(
      "[scrapper-combustible.scrapper] Error al obtener el valor de la nafta:",
      error
    );
  }
};

/** Devuelve el valor estimado del viaje
 * @param {number} totalKm Numero de kilometros del viaje a realizar
 * @param {number} gasPrice Valor del litro de nafta
 * @returns {number} Valor del viaje
 */

export const calculateFuelCost = (totalKm, gasPrice) => {
  const litersRequired = totalKm / 11; // El promedio de autonomia que se tiene por litro de nafta es de aproximadamente 11km
  const tripCost = litersRequired * gasPrice;
  return tripCost;
};
