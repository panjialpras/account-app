const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/company", {
  useNewUrlparser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// // Coba tambah 1 data
// const account1 = new Account({
//   nama: "Yuna",
//   nohp: "085891292387",
//   alamat: "Cikarang",
// });

// // Simpan ke collection
// account1.save().then((account) => console.log(account));
