import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  console.log(req.body);

  const inserted = await prisma.product.create({
    data: {
      name,
      price,
    },
  });
  res.status(201).json(inserted);
});

app.get("/products", async (req, res) => {
  const response = await prisma.product.findMany();
  res.status(200).json(response);
});
// app.get("/product/:id", async (req, res) => {})
// Add to Cart API
app.post("/cart", async (req, res) => {
  const { productId, quantity } = req.body;
  console.log(req.body, "add to cart");
  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        productId,
        quantity,
      },
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding to cart." });
  }
});

app.get("/cart", async (req, res) => {
  try {
    const response = await prisma.cartItem.findMany({
      include: {
        product: true, // Include product details in the response
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
});

app.post("/cart/total", async (req, res) => {
  const { itemIds } = req.body;
  console.log(
    req.body,
    "from check out button to calculate price but only itemIds",
    itemIds
  );

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { id: { in: itemIds } },
      include: { product: true },
    });

    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    res.json({ totalPrice });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating the total price." });
  }
});

app.post("/cart/checkout", async (req, res) => {
  const { itemIds } = req.body;
  console.log(req.body, "finally chckout button req.body");
  try {
    // Fetch cart items and their details
    const cartItems = await prisma.cartItem.findMany({
      where: { id: { in: itemIds } },
      include: { product: true },
    });

    // Create an order with the fetched cart items
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await prisma.order.create({
      data: {
        items: { createMany: { data: orderItems } },
      },
    });

    // Clear the cart after checkout (optional)
    await prisma.cartItem.deleteMany({ where: { id: { in: itemIds } } });
    console.log(order, "response for  checkout");
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during checkout." });
  }
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// // Protected route example
// app.get("/profile", authenticateToken, async (req, res) => {
//   const userId = req.user.userId;
//   try {
//     const userProfile = await prisma.user.findUnique({
//       where: { id: userId },
//       include: { cartItems: true },
//     });
//     res.json(userProfile);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(403).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err, user) => {
    if (err)
      return res.status(403).json({ error: "Token is invalid or has expired" });
    req.user = user;
    next();
  });
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
