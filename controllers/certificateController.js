// ✅ certificateController.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createCanvas, registerFont } from "canvas";

// ✅ Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure fonts folder exists or handle missing font gracefully
const fontPath = path.join(__dirname, "../fonts/Poppins-Bold.ttf");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "Poppins" });
} else {
  console.warn("⚠️ Font not found — using default system font instead.");
}

export const generateCertificate = async (req, res) => {
  try {
    const { name, course } = req.body;

    // ✅ Create Canvas
    const canvas = createCanvas(1000, 700);
    const ctx = canvas.getContext("2d");

    // ✅ Background
    ctx.fillStyle = "#fdfdfd";
    ctx.fillRect(0, 0, 1000, 700);

    // ✅ Border
    ctx.strokeStyle = "#001233";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 960, 660);

    // ✅ Header Text
    ctx.font = "bold 48px Poppins, sans-serif";
    ctx.fillStyle = "#002b5c";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 500, 180);

    // ✅ Name
    ctx.font = "bold 42px Poppins, sans-serif";
    ctx.fillStyle = "#333";
    ctx.fillText(name || "Student Name", 500, 350);

    // ✅ Course
    ctx.font = "28px Poppins, sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText(`for successfully completing ${course || "the course"}`, 500, 420);

    // ✅ Footer
    ctx.font = "20px Poppins, sans-serif";
    ctx.fillStyle = "#777";
    ctx.fillText("Clinigoal Academy", 500, 580);

    // ✅ Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Save certificate image
    const certificatePath = path.join(uploadDir, "certificate.png");
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(certificatePath, buffer);

    // ✅ Return image URL
    res.status(200).json({
      success: true,
      message: "Certificate generated successfully!",
      imageUrl: `/uploads/certificate.png`,
    });
  } catch (error) {
    console.error("❌ Certificate generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate certificate image",
      error: error.message,
    });
  }
};
