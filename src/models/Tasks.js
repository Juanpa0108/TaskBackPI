import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
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

    // Fechas
    start: {
      type: Date,
      default: Date.now, // por defecto la fecha actual
    },
    end: {
      type: Date,
      required: [true, "La fecha de finalización es obligatoria"],
    },

    // Relación con usuario
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [false],
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt
  }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
