import authorService from "./author.service";
import linkAuthorBook from "./authorBook.service"
import bookService from "./book.service";
const services = {
  authorService: authorService,
  linkAuthorBook: linkAuthorBook,
  bookService: bookService
};
export default services;
