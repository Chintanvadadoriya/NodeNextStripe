import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function Form(paymentIntent) {
  const [email, setEmail] = useState('');
  const [locAmount, setLocAmount] = useState('300');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    //Grab the client secret from url params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    // const clientSecret = 'pi_3NTiH3DJy5ivnUBD0HEWBRPs_secret_b8nkoZze3YIWAUtCunDNz49Je'
    console.log('clientSecret', clientSecret)

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleAmount = async (val) => {
    setLocAmount(val);
    fetch('api/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: val * 100,
        payment_intent_id: paymentIntent.paymentIntent,
      }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('not loaded');
      return;
    }
    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/',
        receipt_email: email,
      },
    });
 console.log('result', result)
    if (result.type === 'card_error' || result.type === 'validation_error') {
      setMessage(result.message);
    } else {
      setMessage(result?.error?.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit} className="m-auto">
        {/* <div className="mb-3">
          Plane Amount:
          <input
            id="amount"
            type="text"
            value={locAmount}
            className="block
            w-full
            rounded-md
            border-gray-300
            shadow-sm h-16"
            onChange={(e) => handleAmount(e.target.value)}
            placeholder="Enter email address"
          />
        </div> 
        <div className="mb-6">
          Email address:
          <input
            className="block
            w-full
            rounded-md
            border-gray-300
            shadow-sm h-16"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div> */}
        <PaymentElement id="payment-element" />
        <button
          className="elements-style-background"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              'Pay now'
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
