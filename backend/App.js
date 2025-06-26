import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  console.log(cartItems);
  console.log(quantity, "chek");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/cart");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const responseData = await axios.post("http://localhost:3001/cart", {
        productId,
        quantity,
      });

      console.log("Added to cart successfully!", responseData.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // const handleCheckout = async () => {
  //   try {
  //     // Calculate total price of items in the cart
  //     const itemIds = cartItems.map((item) => item.id);
  //     const response = await axios.post("http://localhost:3001/cart/total", {
  //       itemIds,
  //     });
  //     const totalPrice = response.data.totalPrice;

  //     // Handle checkout logic here (e.g., charge the card, create an order)
  //     console.log(`Order placed successfully! Total price: $${totalPrice}`);
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //   }
  // };

  const handleCheckout = async () => {
    try {
      // Calculate total price of items in the cart
      const itemIds = cartItems.map((item) => item.id);
      const response = await axios.post("http://localhost:3001/cart/total", {
        itemIds,
      });
      const totalPrice = response.data.totalPrice;

      // Handle checkout logic here (e.g., charge the card, create an order)
      console.log(`Order placed successfully! Total price: $${totalPrice}`);

      // Optionally clear the cart after checkout
      await axios.post("http://localhost:3001/cart/checkout", { itemIds });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} == count -{quantity}
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
            <button onClick={() => setQuantity(quantity - 1)}>-</button>
            <button onClick={() => handleAddToCart(product.id)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      <h1>Cart Items</h1>
      <ul>
        {cartItems.map((item) => (
          <div key={item.id}>
            <h1> product Id is {item.productId}</h1>
            {/* <h2> quantity is {item.quantity}</h2>
            <p>{item.product.name}</p>
            <p>{item.product.price}</p>
            <p>{item.product.id}</p> */}
            <div>
              <li key={item.id}>
                {item.product.name} - ${item.product.price} x {item.quantity} =
                ${(item.product.price * item.quantity).toFixed(2)}
              </li>
            </div>
          </div>
        ))}
      </ul>

      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState([]);

//   console.log(products, cartItems);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/products");
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/cart");
//         setCartItems(response.data);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   const handleAddToCart = async (productId) => {
//     try {
//       await axios.post("http://localhost:3001/cart", {
//         productId,
//         quantity: 1,
//       });
//       console.log("Added to cart successfully!");
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   const handleCheckout = async () => {
//     try {
//       // Calculate total price of items in the cart
//       const itemIds = cartItems.map((item) => item.id);
//       const response = await axios.post("http://localhost:3001/cart/total", {
//         itemIds,
//       });
//       const totalPrice = response.data.totalPrice;

//       // Handle checkout logic here (e.g., charge the card, create an order)
//       console.log(`Order placed successfully! Total price: $${totalPrice}`);
//     } catch (error) {
//       console.error("Error during checkout:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Products</h1>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id}>
//             {product.name} - ${product.price}
//             <button onClick={() => handleAddToCart(product.id)}>
//               Add to Cart
//             </button>
//           </li>
//         ))}
//       </ul>

//       <h1>Cart Items</h1>
//       <ul>
//         {cartItems.map((item) => (
//           <li key={item.id}>
//             {item.product.name} - ${item.product.price} x {item.quantity} = $
//             {(item.product.price * item.quantity).toFixed(2)}
//           </li>
//         ))}
//       </ul>

//       <button onClick={handleCheckout}>Checkout</button>
//     </div>
//   );
// }

// export default App;

// // ###############################

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState([]);

//   console.log(cartItems);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/products");
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/cart");
//         setCartItems(response.data);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   const handleAddToCart = async (productId) => {
//     try {
//       await axios.post("http://localhost:3001/cart", {
//         productId,
//         quantity: 1,
//       });
//       console.log("Added to cart successfully!");
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   const handleCheckout = async () => {
//     try {
//       // Calculate total price of items in the cart
//       const itemIds = cartItems.map((item) => item.id);
//       const response = await axios.post("http://localhost:3001/cart/total", {
//         itemIds,
//       });
//       const totalPrice = response.data.totalPrice;

//       // Handle checkout logic here (e.g., charge the card, create an order)
//       console.log(`Order placed successfully! Total price: $${totalPrice}`);
//     } catch (error) {
//       console.error("Error during checkout:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Products</h1>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id}>
//             {product.name} - ${product.price}
//             <button onClick={() => handleAddToCart(product.id)}>
//               Add to Cart
//             </button>
//           </li>
//         ))}
//       </ul>

//       <h1>Cart Items</h1>
//       <ul>
//         {cartItems.map((item) => (
//           <div key={item.id}>{item.id}</div>
//           // <li key={item.id}>
//           //   {item.product.name} - ${item.product.price} x {item.quantity} = $
//           //   {(item.product.price * item.quantity).toFixed(2)}
//           // </li>
//         ))}
//       </ul>

//       <button onClick={handleCheckout}>Checkout</button>
//     </div>
//   );
// }

// export default App;
