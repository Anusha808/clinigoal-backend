import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

/* ============================================================
   🧩 CREATE a new Quiz
   This endpoint creates a new quiz document in the database.
   It expects a JSON body in the request, for example:
   {
     "title": "JavaScript Basics",
     "courseName: "Biology 101",
     "questions": [
       {
         "question": "What is the output of 2+2?",
         "options": ["3", "4", "5", "22"],
         "correctAnswer": "4"
       }
     ]
   }
===============================================================*/
router.post("/", async (req, res) => {
  try {
    console.log("📤 [ROUTE] POST /api/quizzes - Create new quiz request received.");
    const quiz = new Quiz(req.body);
    await quiz.save();
    console.log("✅ [ROUTE] Quiz saved to DB:", quiz._id);
    res.status(201).json({ success: true, message: "Quiz created successfully.", quiz });
  } catch (err) {
    console.error("❌ [ROUTE] Error creating quiz:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   📋 GET All Quizzes
   This endpoint retrieves a list of all quizzes from the database,
   sorted by their creation date (newest first).
===============================================================*/
router.get("/", async (req, res) => {
  try {
    console.log("🔍 [ROUTE] GET /api/quizzes - Fetching all quizzes.");
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    console.log(`✅ [ROUTE] Found ${quizzes.length} quizzes.`);
    res.status(200).json({ success: true, count: quizzes.length, quizzes });
  } catch (err) {
    console.error("❌ [ROUTE] Error fetching all quizzes:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   📘 GET Single Quiz by ID
   This endpoint retrieves a single quiz document by its unique ID.
   The ID is passed as a URL parameter.
===============================================================*/
router.get("/:id", async (req, res) => {
  try {
    console.log(`🔍 [ROUTE] GET /api/quizzes/${req.params.id} - Fetching quiz by ID.`);
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      console.log("❌ [ROUTE] Quiz not found with ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }
    console.log("✅ [ROUTE] Quiz found:", quiz.title);
    res.status(200).json({ success: true, quiz });
  } catch (err) {
    console.error("❌ [ROUTE] Error fetching quiz by ID:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   ✏️ UPDATE Quiz by ID
   This endpoint updates an existing quiz document by its ID.
   The ID is passed as a URL parameter, and the updated data is in the request body.
===============================================================*/
router.put("/:id", async (req, res) => {
  try {
    console.log(`🔄 [ROUTE] PUT /api/quizzes/${req.params.id} - Updating quiz by ID.`);
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      console.log("❌ [ROUTE] Quiz not found for update with ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }
    console.log("✅ [ROUTE] Quiz updated successfully:", quiz.title);
    res.status(200).json({ success: true, message: "Quiz updated successfully.", quiz });
  } catch (err) {
    console.error("❌ [ROUTE] Error updating quiz:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ============================================================
   🗑️ DELETE Quiz by ID
   This endpoint deletes a quiz document from the database by its ID.
   The ID is passed as a URL parameter.
===============================================================*/
router.delete("/:id", async (req, res) => {
  try {
    console.log(`🗑️ [ROUTE] DELETE /api/quizzes/${req.params.id} - Deleting quiz by ID.`);
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      console.log("❌ [ROUTE] Quiz not found for deletion with ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }
    console.log("✅ [ROUTE] Quiz deleted successfully.");
    res.status(200).json({ success: true, message: "Quiz deleted successfully." });
  } catch (err) {
    console.error("❌ [ROUTE] Error deleting quiz:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;