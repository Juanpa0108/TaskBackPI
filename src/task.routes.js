// task.routes.js
import express from "express";
import Task from "./models/Task.js"; // ajusta la ruta si es distinta
import { verifyToken } from "./middlewares/auth.js"; // si usas auth

const router = express.Router();

// Crear nueva tarea
router.post("/tasks", async (req, res) => {
  try {
    const { title, description, priority, status, start, end, user } = req.body;

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      start,
      end,
      user,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creando tarea:", err);
    res.status(500).json({ error: err.message });
  }
});

// (opcional) obtener todas las tareas
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
