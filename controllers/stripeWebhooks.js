import stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { bookingId } = session.metadata;

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentLink: "",
      });

      await inngest.send({
        name: "app/show.booked",
        data: { bookingId },
      });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook logic error:", err);
    res.status(500).send("Webhook handler failed");
  }
};
