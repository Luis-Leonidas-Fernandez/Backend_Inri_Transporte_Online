export const redondearNumber = (distancia) => {
  const res = distancia[0].dist.calculated;

  const result = Math.round(res);

  return result;
};
