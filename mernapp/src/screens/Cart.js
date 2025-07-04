import React from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";
// import trash from "../trash.svg"

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
      </div>
    );
  }

  const handleCheckout = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/orderData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_data: data,
        email: localStorage.getItem("userEmail"),
        order_date: new Date().toDateString()
      })
    });

    console.log("HTTP status:", res.status);               // should be 200
    const json = await res.json();
    console.log("Parsed JSON:", json);                     // should log { success: true }

    if (res.ok && json.success) {
      console.log("About to dispatch DROP");              
      dispatch({ type: "DROP" });
    } else {
      console.error("Checkout failed:", json);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};


  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div>
      <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-ms">
        <table className="table table-hover">
          <thead className="text-success fs-4">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Option</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn p-0"
                    onClick={() => dispatch({ type: "REMOVE", index: index })}
                  >
                    {/* <img src={trash} alt="delete" /> */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className="fs-2">Total Price: {totalPrice}/-</h1>
        </div>
        <div>
          <button className="btn bg-success mt-5" onClick={handleCheckout}>Check Out</button>
        </div>
      </div>
    </div>
  );
}
