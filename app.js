const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const app = express();
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");
const port = 3000;
require("./utils/db");
const account = require("./model/account");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// Setup override
app.use(methodOverride("_method"));

//Setup EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Flash config
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Homepage
app.get("/", (req, res) => {
  const karyawan = [
    {
      nama: "Riko",
      email: "rikohachima@gmail.com",
      gaji: 25000000,
    },
    {
      nama: "Ardian",
      email: "ardian223@gmail.com",
      gaji: 32000000,
    },
    {
      nama: "Yuli",
      email: "yulia@gmail.com",
      gaji: 54000000,
    },
  ];
  res.render("index", {
    name: "Nji",
    title: "Home",
    karyawan,
    layout: "partials/mainLayout",
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "partials/mainLayout",
  });
});

// Accounts page
app.get("/accounts", async (req, res) => {
  const accounts = await account.find();
  res.render("accounts", {
    title: "Accounts",
    layout: "partials/mainLayout",
    accounts,
    msg: req.flash("msg"),
  });
});

// Add new account page
app.get("/accounts/add", (req, res) => {
  res.render("add", {
    title: "Add account",
    layout: "partials/mainLayout",
  });
});

// proses add data account
app.post(
  "/accounts",
  [
    body("nama").custom(async (value) => {
      const duplicate = await account.findOne({ nama: value });
      if (duplicate) {
        throw new Error("Your name has registered before");
      }
      return true;
    }),
    check("nohp", "Your phone number is invalid").isMobilePhone("id-ID"),
    check("nama", "Your name is not an alphabet").isAlpha(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add", {
        title: "Add account",
        layout: "partials/mainLayout",
        errors: errors.array(),
      });
    } else {
      account.insertMany(req.body, (e, result) => {
        // mengirimkan redirect
        req.flash("msg", "The account added successfully");
        res.redirect("/accounts");
      });
    }
  }
);

// Route delete accounts
app.delete("/accounts", (req, res) => {
  account.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "The account deleted successfully");
    res.redirect("/accounts");
  });
});

// Form edit account
app.get("/accounts/edit/:nama", async (req, res) => {
  const accs = await account.findOne({ nama: req.params.nama });
  res.render("edit", {
    title: "Form edit an account",
    layout: "partials/mainLayout",
    accs,
  });
});

app.put(
  "/accounts",
  [
    body("nama").custom(async (value, { req }) => {
      const duplicate = await account.findOne({ nama: value });
      if (value !== req.body.oldNama && duplicate) {
        throw new Error("Your name has registered before");
      }
      return true;
    }),
    check("nohp", "Your phone number is invalid").isMobilePhone("id-ID"),
    check("nama", "Your name is not an alphabet").isAlpha(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit", {
        title: "Form edit an account",
        layout: "partials/mainLayout",
        errors: errors.array(),
        account: req.body,
      });
    } else {
      account
        .updateOne(
          { _id: req.body._id },
          {
            $set: {
              nama: req.body.nama,
              nohp: req.body.nohp,
              alamat: req.body.alamat,
            },
          }
        )
        .then(() => {
          // mengirimkan redirect
          req.flash("msg", "The account updated successfully");
          res.redirect("/accounts");
        });
    }
  }
);

// Route detail accounts
app.get("/accounts/:nama", async (req, res) => {
  const acc = await account.findOne({
    nama: req.params.nama,
  });
  res.render("detail", {
    title: "Accounts detail",
    layout: "partials/mainLayout",
    acc,
  });
});

app.listen(port, () => {
  console.log(`Mongo account app | listening at http://localhost:${port}`);
});
