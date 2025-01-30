import { Schema, model } from "mongoose";

const OrdersSchema = Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: false,
    },
    tipoCarga: {
      type: String,
      required: false,
    },
    peso: {
      peso: {
        type: Number,
        required: false,
      },
      unidadPeso: {
        type: String,
        required: false,
      },
    },
    tamaño: {
      alto: {
        type: Number,
        required: false,
      },
      ancho: {
        type: Number,
        required: false,
      },
      profundidad: {
        type: Number,
        required: false,
      },
    },
    ubicacion: {
      calle: {
        type: String,
        required: false,
      },
      altura: {
        type: Number,
        required: false,
      },
      provincia: {
        type: String,
        required: false,
      },
      ciudad: {
        type: String,
        required: false,
      },
    },
    prioridad: {
      type: String,
      required: false,
    },
    estadoSubasta: {
      type: String,
      required: false,
    },
  },
  { timestamps: true } // Se corrige la definición de timestamps
);

OrdersSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const Orders = model("Orders", OrdersSchema);

export default Orders;
