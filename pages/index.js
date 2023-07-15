import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './form';

const stripe = loadStripe('pk_test_51Mizj9DJy5ivnUBD9seBP8FkB29z67wupiSKFf3B3oRJeZZqnfK2yssLq7twOjwGoqsYEOP4RBXRO42hcE8rKqNk00ZU1a3ELE');

export default function Home() {
  const [clientSecret, setClientSecret] = useState('pi_3NTjZ0DJy5ivnUBD1HXOSCPA_secret_gIfWxzJ8RDYLa8NRG19maltS5');
  const [paymentIntent, setPaymentIntent] = useState('');
  useEffect(() => {
    console.log("---------------------------")
    // Create PaymentIntent as soon as the page loads using our local API
    fetch('api/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 30000,
        payment_intent_id: '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data--------------------------------', data)
        setClientSecret(data.client_secret), setPaymentIntent(data.id);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
    labels: 'floating',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <Head>
        <title>Stripe Elements</title>
      </Head>
      <h1 className="text-2xl bold mb-4 mt-4 text-center">
        Accept payments with credit card
      </h1>
      
      {clientSecret && (
        <Elements options={options} stripe={stripe}>
          <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
      )}
    </div>
  );
}
