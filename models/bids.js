import { Schema, model } from "mongoose";

const BidsSchema = Schema(
  {
    idConductor: {
      type: Schema.Types.ObjectId,
      ref: "Conductor",
      required: true,
    },
    idOrder: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    oferta: {
      valor: {
        type: Number,
        required: true,
      },
      moneda: {
        type: String,
        required: true,
      },
    },
    comentario: {
      type: String,
    },
  },
  { timestamps: true }
);

BidsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const Bid = model("Bid", BidsSchema);

export default Bid;
