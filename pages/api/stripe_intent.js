import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51Mizj9DJy5ivnUBD4bLjcMVKLLJG7WoFNexDoradaqkVFITt083bgGeU5N7nYc5vUkhjTZbsD8Yia6GX1nYj1Why00OhdO3t6m', {
  apiVersion: '2020-08-27',
});
const handler = async (req, res) => {
  const { amount, payment_intent_id } = req.body;
  if (payment_intent_id) {
    try {
      // If a payment_intent_id is passed, retrieve the paymentIntent
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );
      // If a paymentIntent is retrieved update its amount
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: amount,
          }
        );
        res.status(200).json(updated_intent);
        return;
      }
    } catch (e) {
      //Catch any error and return a status 500
      if (e.code !== 'resource_missing') {
        const errorMessage =
          e instanceof Error ? e.message : 'Internal server error';
        res.status(500).json({ statusCode: 500, message: errorMessage });
        return;
      }
    }
  }
  try {
    // Create PaymentIntent
    const params = {
      amount:1000,
      currency: 'chf',
      description: 'Payment description',
      automatic_payment_methods: {
        enabled: true,
      },
      
    };
    const payment_intent = await stripe.paymentIntents.create(params);
    //Return the payment_intent object
    res.status(200).json(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};
export default handler;
