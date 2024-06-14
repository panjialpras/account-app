const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/company", {
  useNewUrlparser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const Account = mongoose.model("Account", {
  nama: {
    type: String,
    requiree: true,
  },
  nohp: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
  },
});

module.exports = Account;
