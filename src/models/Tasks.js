import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },

  status: {
    type: String,
    enum: ["todo", "inProgress", "done"],
    default: "todo",
  },

  // fechas
  start: {
    type: Date,
    default: Date.now, // se asigna automáticamente la fecha de creación
  },
  end: {
    type: Date,
  },

  // Relación con usuario (si quieres ligar tareas a un usuario específico)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
}, {
  timestamps: true // crea automáticamente createdAt y updatedAt
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);