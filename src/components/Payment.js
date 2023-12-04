import React, { useState, useEffect } from "react";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountToPay, setAmountToPay] = useState(0);

  useEffect(() => {
   
    fetch("http://localhost:3000/getAmountToPay")
      .then((response) => response.json())
      .then((data) => {
        setAmountToPay(data.amount);
      })
      .catch((error) => {
        console.error("Error fetching amount to pay:", error);
      });
  }, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePayment = () => {
   
    fetch("http://localhost:3000/makePayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod,
        paymentAmount: amountToPay,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Payment successful:", data);
      })
      .catch((error) => {
        console.error("Error making payment:", error);
      });
  };

  return (
    <div>
      <h2>Payment</h2>
      <div>
        <label>Select Payment Method:</label>
        <select value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="debit_card">Debit Card</option>
          <option value="mobile_payment">Mobile Payment</option>
          <option value="bank_account">Bank Account</option>
        </select>
      </div>
      <div>
        <p>Amount to Pay: ${amountToPay}</p>
      </div>
      <div>
        <button onClick={handlePayment}>Pay Now</button>
      </div>
    </div>
  );
};

export default Payment;
