import axios from "axios";

const newInvoiceAxios = axios.create({
  baseURL: "https://www.inriservice.com/api/invoice", //cambiar url para produccion y puerto debe ser 5000
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});

const createInvoicePdfAxios = axios.create({
  baseURL: "https://www.inriservice.com/api/invoice", //cambiar url para produccion y puerto debe ser 5000
  timeout: 3000,
  headers: { "Content-Type": "multipart/form-data" },
});

export const createInvoiceJob = async () => {
  const result = await newInvoiceAxios.post(`/new`);

  const response = result.data;

  return response;
};

export const createInvoicePdfJob = async () => {
  const result = await createInvoicePdfAxios.get(`/create-pdf-invoice`);

  const response = result.data;

  return response;
};
