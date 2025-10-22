// ✅ certificateController.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createCanvas, registerFont } from "canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

registerFont(path.join(__dirname, "../fonts/Poppins-Bold.ttf"), {
  family: "Poppins",
});

export const generateCertificate = async (req, res) => {
  try {
    const { name, course } = req.body;

    const canvas = createCanvas(1000, 700);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#fdfdfd";
    ctx.fillRect(0, 0, 1000, 700);

    // Border
    ctx.strokeStyle = "#001233";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 960, 660);

    // Header
    ctx.font = "bold 48px Poppins";
    ctx.fillStyle = "#002b5c";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 500, 180);

    // Name
    ctx.font = "bold 42px Poppins";
    ctx.fillStyle = "#333";
    ctx.fillText(name || "Student Name", 500, 350);

    // Course
    ctx.font = "28px Poppins";
    ctx.fillStyle = "#555";
    ctx.fillText(`for successfully completing ${course || "the course"}`, 500, 420);

    // Footer
    ctx.font = "20px Poppins";
    ctx.fillStyle = "#777";
    ctx.fillText("Clinigoal Academy", 500, 580);

    // Save
    const certificatePath = path.join(__dirname, "../uploads/certificate.png");
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(certificatePath, buffer);

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
