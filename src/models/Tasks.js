import mongoose from "mongoose";
/**
 * Task model
 * @typedef {Object} Task
 * @property {string} title - Title of the task
 * @property {string} description - Description of the task
 * @property {string} priority - Task priority ("low", "medium", "high")
 * @property {string} status - Task status ("todo", "inProgress", "done")
 * @property {Date} start - Start date
 * @property {Date} end - End date
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "La descripción no puede superar los 500 caracteres"]
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

    // Dates
    start: {
      type: Date,
      default: Date.now, 
    },
    end: {
      type: Date,
      required: [true, "La fecha de finalización es obligatoria"],
    },

    // User relationship
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
  },
  {
    timestamps: true, // automatically creates createdAt and updatedAt
  }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);