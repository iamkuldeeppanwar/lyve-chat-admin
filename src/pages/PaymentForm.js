import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    // Use elements.getElement to access the CardElement
    const cardElement = elements.getElement(CardElement);

    // Use stripe.createPaymentMethod to create a PaymentMethod
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      console.log(paymentMethod);
      // Here, you can send the paymentMethod to your server for further processing
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
}

export default PaymentForm;
