import { Schema, model } from "mongoose";

const OrdersSchema = Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    carga: [
      {
        tipoCarga: {
          type: String,
        },
        pesoTotal: {
          peso: {
            type: Number,
          },
          unidadPeso: {
            type: String,
          },
        },
        medidasTotal: {
          alto: {
            type: Number,
          },
          ancho: {
            type: Number,
          },
          profundidad: {
            type: Number,
          },
          unidadMedida: {
            type: String,
          },
        },
      },
    ],
    origen: {
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
      referencia: {
        type: String,
      },
    },
    destino: {
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
      referencia: {
        type: String,
      },
    },
    prioridad: {
      type: String,
    },
    estadoSubasta: {
      type: String,
    },
    fechaRetiro: {
      type: Date,
    },
  },
  { timestamps: true }
);

OrdersSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const Orders = model("Orders", OrdersSchema);

export default Orders;
