const BookInstance = require("../models/bookinstance");
var Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all BookInstances.
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate("book")
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }
      //succesfull so render
      res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list_bookinstances,
      });
    });

  // res.send("NOT IMPLEMENTED: BookInstance list");
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) return next(err);
      if (bookinstance == null) {
        let err = new Error("Book instance not found");
        err.status = 404;
        return next(err);
      }
      //succesfull, so render
      res.render("bookinstance_detail", {
        title: "Copy " + bookinstance.book.title,
        bookinstance: bookinstance,
      });
    });

  //res.send("NOT IMPLEMENTED: BookInstance detail: " + req.params.id);
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, "title").exec((err, books) => {
    if (err) return next(err);
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books,
    });
  });
  //  res.send("NOT IMPLEMENTED: BookInstance create GET");
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate and sanitise fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      Book.find({}, "title").exec(function (err, books) {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance,
        });
      });
      return;
    } else {
      // Data from form is valid.
      bookinstance.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new record.
        res.redirect(bookinstance.url);
      });
    }
  },
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res, next) => {
  BookInstnace.findById(req.params.book)
    .populate("book")
    .exec(function (err, results) {
      if (err) return next(err);
      if (results == null) {
        let err = new Error("Book instance not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_delete", {
        title: "Delete Book Instance",
        book_instance: results,
      });
    });

  //  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }

      if (results === null) {
        res.render("bookinstance_delete", {
          title: "Delete Book Instance",
          book_instance: results,
        });
        return;
      } else {
        BookInstance.findByIdAndRemove(
          req.body.bookinstanceid,
          function deleteBookInstance(err) {
            if (err) {
              return next(err);
            }

            res.redirect("/catalog/bookinstances");
          }
        );
      }
    });

  // res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};
