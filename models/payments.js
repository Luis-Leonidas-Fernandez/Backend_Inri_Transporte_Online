import { Schema, model } from "mongoose";

const PaymentsSchema = Schema(
  {
    idBid: {
      type: Schema.Types.ObjectId,
      ref: "Bid",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currencyId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

PaymentsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const Payment = model("Payment", PaymentsSchema);

export default Payment;
