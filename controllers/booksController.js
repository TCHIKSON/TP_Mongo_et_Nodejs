import Book from "../models/books.js";


const getBooks = async (req, res) => {
  try {
    const { disponible, genre, auteur, search, minNote, tri, ordre } = req.query;

    let filter = {};

    if (disponible === 'true' || disponible === 'false') {
      filter.disponible = disponible === 'true';
    }
    if (genre) filter.genres = genre;
    if (auteur) filter.auteur = { $regex: auteur, $options: "i" };
    if (search) filter.titre = { $regex: search, $options: "i" };
    if (minNote) filter.note = { $gte: parseFloat(minNote) };

    let query = Book.find(filter);


    if (tri && tri.trim() !== '') {
      const sortDirection = ordre === 'desc' ? -1 : 1;
      query = query.sort({ [tri]: sortDirection });
    }
   
  const books = await query


    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Livre non trouvé");
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


const createBook = async (req, res) => {
  try {
    const { titre, auteur, annee, genres, note } = req.body;

    if (!titre || !auteur) {
      return res.status(400).json({ message: "Titre et auteur sont obligatoires" });
    }

    if (annee && annee < 1800) {
      return res.status(400).json({ message: "L'année doit être supérieure ou égale à 1800" });
    }

    if (note !== undefined && (note < 0 || note > 5)) {
      return res.status(400).json({ message: "La note doit être entre 0 et 5" });
    }

    if (!Array.isArray(genres)) {
      return res.status(400).json({ message: "Genres doit être un tableau" });
    }

    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


const updateBook = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;

    const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).send("Livre non trouvé");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Livre non trouvé");
    res.json({ message: "Livre supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export default {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
