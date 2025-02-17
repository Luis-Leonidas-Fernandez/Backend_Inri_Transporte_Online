import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { dbConnection } from "./database/config.js";
import http from "http";
import { Server } from "socket.io";
import "./sockets/socket.js";
import authRoute from "./routes/auth.js";
import usuariosRoute from "./routes/usuarios.js";
import ubicacionesRoute from "./routes/ubicaciones.js";
import authDriverRoute from "./routes/authDriver.js";
import driversRoute from "./routes/drivers.js";
import estadoViajesRoute from "./routes/estadoViajes.js";
import locationDriverRoute from "./routes/locationDriver.js";
import authAdminRoute from "./routes/authAdmin.js";
import baseRoute from "./routes/base.js";
import bookingRoute from "./routes/booking.js";
import bookingDriverRoute from "./routes/bookingDriver.js";
import viajesRoute from "./routes/viajes.js";
import cuponRoute from "./routes/cupon.js";
import invoiceRoute from "./routes/invoice.js";
import { fileURLToPath } from "url";
import ordersRoute from "./routes/orders.js";
import cookieParser from "cookie-parser";
import conductorRoute from "./routes/authConductor.js"
// import { google } from "googleapis";
// import admin from "firebase-admin";
// import serviceAccount from "./firebase-admin.json" with { type: "json" };


import {    
  createInvoiceJob,
  createInvoicePdfJob,
} from "./service/invoice_server.js";

import {
  getPrice, 
} from "./Generators/price.js";

import {
  dispatchDrivers
} from "./service/dispatch_server.js";

import {
  createVauchers
} from "./service/cupon_server.js";

import {
  createPrice
} from "./service/price_server.js";



// Cargar las variables de entorno del archivo .env
dotenv.config();

// App de Express
const app = express();

// Lectura y parseo del Body
app.use(express.json());

// Habilita el acceso a las cookies
app.use(cookieParser());

//Cors
app.use(cors());

// DB Config
dbConnection();

// Node Server
const server = http.createServer(app);
export const io = new Server(server);

// Path público
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// // Inicializar Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Obtener token de acceso para Firebase
// const getAccessToken = async () => {
//   const jwtClient = new google.auth.JWT(
//       serviceAccount.client_email,
//       null,
//       serviceAccount.private_key,
//       ["https://www.googleapis.com/auth/firebase.messaging"]
//   );

//   try {
//       const tokens = await jwtClient.authorize();
//       return tokens.access_token;
//   } catch (error) {
//       console.error("Error obteniendo el token de Firebase:", error);
//       return null;
//   }
// };


// Mis Rutas Usuarios
app.use("/api", authRoute);
app.use("/api/usuarios", usuariosRoute);
app.use("/api/ubicaciones", ubicacionesRoute);

// Ruta de orders
app.use("/api", ordersRoute);

// Ruta de conductores
app.use("/api/driver", conductorRoute)

// Mis Rutas Drivers
app.use("/api/logindriver", authDriverRoute);
app.use("/api/drivers", driversRoute);
app.use("/api/status", estadoViajesRoute);
app.use("/api/location", locationDriverRoute);

// Mis Rutas Admin
app.use("/api/loginadmin", authAdminRoute);
app.use("/api/base", baseRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/travel", bookingDriverRoute);

// Obtener viajes desde distintos roles
app.use("/api/viajes", viajesRoute);

// Asignar vaucher
app.use("/api/cupon", cuponRoute);

//Asignar Factura
app.use("/api/invoice", invoiceRoute);

const startServer = () => {
  try {
    const port = process.env.PORT || 3000;
    server.listen(port);
    console.log("Servidor conectado en el puerto:", port);
  } catch (error) {
    console.log(error);
  }
};

startServer();

//servicio de despacho de ordenes

cron.schedule(
  "*/1 * * * *",
  async function () {
    await dispatchDrivers();
  },
  {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires",
  }
);

cron.schedule(
  "* */22 * * *",
  async function () {
    //GUARDA EN STORAGE EL PRECIO DEL DOLAR BLUE

    await getPrice();
  },
  {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires",
  }
);

//servicio de despacho de vauchers cada 24 hs horario: 00:00 /"0 0 * * *"

cron.schedule(
  "* */23 * * *",
  async function () {
    //CREA UN VAUCHER RANDOM 01FG-25SD-3528-ADF25

    await createVauchers();
  },
  {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires",
  }
);

cron.schedule(
  "0 0 * * *",
  async function () {
    // GUARDA EN COLLECTION USUARIO EL PRECIO DEL VAUCHER

    await createPrice();
  },
  {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires",
  }
);

cron.schedule(
  "* * 25 * *",
  async function () {
    //GUARDA EN COLLECTION INVOICE LA FACTURA MENSUAL A COBRAR

    await createInvoiceJob();
  },
  {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires",
  }
);

cron.schedule(
  "* * 26 * *",
  async function () {
    //GUARDA PDF FACTURA EN DIRECTORIO

    await createInvoicePdfJob();
  },
  {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires",
  }
);
