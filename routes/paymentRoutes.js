// backend/routes/paymentRoutes.js
import express from "express";

const router = express.Router();

/**
 * 💳 Dummy Razorpay order creation
 *  - Works without API keys
 *  - Always returns a fake order
 */
router.post("/create-order", async (req, res) => {
  try {
    // Just simulate a successful response
    const fakeOrder = {
      id: "order_" + Math.random().toString(36).substring(2, 10),
      amount: 49900, // ₹499.00 in paise
      currency: "INR",
      status: "created",
      message: "✅ Dummy order created successfully (no Razorpay key needed)",
    };

    res.status(200).json(fakeOrder);
  } catch (err) {
    console.error("❌ Error creating dummy order:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create dummy order",
      error: err.message,
    });
  }
});

export default router;
