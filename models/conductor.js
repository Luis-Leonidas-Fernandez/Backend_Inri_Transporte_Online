import { Schema, model } from "mongoose";

const ConductorSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  direccion: {
    calle: {
      type: String,
    },
    altura: {
      type: String,
    },
    provincia: {
      type: String,
    },
    ciudad: {
      type: String,
    },
    codigoPostal: {
      type: String,
    },
  },
  vehiculos: [
    {
      matricula: {
        type: String,
      },
      capacidadCarga: {
        peso: {
          type: Number,
        },
        unidadPeso: {
          type: String,
        },
      },
      tipoCarga: {
        type: String,
      },
      tipoVehiculo: {
        type: String,
      },
      modelo: {
        type: String,
      },
    },
  ],
  licencia: {
    type: String,
  },
});

ConductorSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const Conductor = model("Conductor", ConductorSchema);

export default Conductor;
