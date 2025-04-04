import express from "express"
import booksController from "../controllers/booksController.js";
const router = express.Router();


router.get("/", booksController.getBooks);
router.get("/:id", booksController.getBookById);
router.post("/", booksController.createBook);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

  export default  router;
