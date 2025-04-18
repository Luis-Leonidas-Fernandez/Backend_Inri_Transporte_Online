import { Schema, model } from "mongoose";

const PaymentCredentialsSchema = Schema(
  {
    idConductor: {
      type: Schema.Types.ObjectId,
      ref: "Conductor",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

PaymentCredentialsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const PaymentCredential = model("PaymentCredential", PaymentCredentialsSchema);

export default PaymentCredential;
