// task.routes.js
import express from "express";
import Task from "../models/Tasks.js"; // Asegúrate de que la ruta sea correcta
import { verifyToken } from "../middlewares/auth.js"; // Ajusta la ruta si es necesario

const router = express.Router();

// Crear nueva tarea
router.post("/tasks", async (req, res) => {
  try {
    console.log("📝 Creando nueva tarea con datos:", req.body);
    
    const { title, description, priority, status, start, end, user } = req.body;

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      start,
      end,
      user, // puede ser undefined si no se proporciona
    });

    await newTask.save();
    console.log("✅ Tarea creada exitosamente:", newTask);
    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Error creando tarea:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las tareas
router.get("/tasks", async (req, res) => {
  try {
    console.log("📋 Obteniendo todas las tareas");
    const tasks = await Task.find().populate("user", "name email");
    console.log('✅ Se encontraron ${tasks.length} tareas');
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error obteniendo tareas:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener una tarea por ID
router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user", "name email");
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json(task);
  } catch (err) {
    console.error("Error obteniendo tarea:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar tarea
router.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, priority, status, start, end } = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        status,
        start,
        end,
      },
      { 
        new: true, // retornar el documento actualizado
        runValidators: true // ejecutar validaciones del schema
      }
    ).populate("user", "name email");

    if (!updatedTask) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error actualizando tarea:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar tarea
router.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea eliminada exitosamente", task: deletedTask });
  } catch (err) {
    console.error("Error eliminando tarea:", err);
    res.status(500).json({ error: err.message });
  }
});

// (Opcional) Obtener tareas de un usuario específico
router.get("/users/:userId/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId }).populate("user", "name email");
    res.json(tasks);
  } catch (err) {
    console.error("Error obteniendo tareas del usuario:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;