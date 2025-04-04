import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Le titre est requis"],
    trim: true,
  },
  auteur: {
    type: String,
    required: [true, "L'auteur est requis"],
  },
  annee: {
    type: Number,
    min: [0, "L'année doit être positive"],
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  genres: {
    type: [String],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Au moins un genre est requis",
    },
  },
  note: {
    type: Number,
    min: [0, "La note doit être au moins 0"],
    max: [5, "La note ne peut pas dépasser 5"],
  },
  stock: {
    type: Number,
    min: [0, "Le stock ne peut pas être négatif"],
    default: 0,
  },
});

export default mongoose.model("livres", bookSchema);
