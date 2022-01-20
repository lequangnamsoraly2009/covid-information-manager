const e = require("express");
const LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./scratch");
const axios = require("axios");
const db = require("../db");
const bcrypt = require("bcrypt");

class UserSystemController {
  // GET Information User /
  viewInforUser(req, res) {
    const sodu = localStorage.getItem("sodu");
    res.render("./user/informationUser", {
      authenticated: req.authenticated,
      sodu,
    });
  }

  // GET Notify Payment User /
  notifyPaymentUser(req, res) {
    res.render("./user/notifyPayment", {
      authenticated: req.authenticated,
    });
  }

  // GET Cart User /
  cartUser(req, res) {
    res.render("./user/cartUser", {
      authenticated: req.authenticated,
    });
  }

  // GET Checkout User /
  checkoutUser(req, res) {
    res.render("./user/checkoutPayment", {
      authenticated: req.authenticated,
    });
  }
  // patch Checkout Cart / - Thanh Toán Đơn Hàng Qua Hệ Thống Bên Kia
  async checkoutCartUser(req, res) {
    try {
      const idWallet = localStorage.getItem("idPayMent");
      const amount = 100000;
      // const amount = 100000;
      let response = await axios.put(`http://localhost:3003/api/payment`, {
        id: idWallet,
        amount,
      });
      res.render("./user/informationUser", {
        authenticated: req.authenticated,
        message: response.data.message,
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
  }

  // GET Balance User /
  balanceUser(req, res) {
    const idWallet = localStorage.getItem("idPayMent");
    const sodu = localStorage.getItem("sodu");

    res.render("./user/accountBalance", {
      authenticated: req.authenticated,
      idWallet,
      sodu,
    });
  }

  // GET Connect Wallet /
  connectWalletUser(req, res) {
    res.render("./user/connectWallet", {
      authenticated: req.authenticated,
    });
  }

  // POST Connect Wallet /
  async connectPostWalletUser(req, res) {
    try {
      const { idWallet } = req.body;
      let response = await axios(
        `http://localhost:3003/api/connect-wallet/${idWallet}`
      );
      localStorage.setItem("idPayMent", response.data.data.rows[0].id);
      localStorage.setItem("sodu", response.data.data.rows[0].sodu);
      res.render("./user/informationUser", {
        authenticated: req.authenticated,
        message: response.data.message,
        type: "success",
        sodu: response.data.data.rows[0].sodu,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // GET Change Password User /
  changePasswordViewUser(req, res) {
    res.render("./user/changePassword", {
      authenticated: req.authenticated,
    });
  }

  // POST Change Password User /
  changePasswordUser(req, res) {
    const { username, password, newpassword } = req.body;
    db.query('select "password" from public."User" where "username" = $1', [
      req.body.username,
    ]).then((data) => {
      if (data.rowCount == 0) {
        res.render("./user/changePassword", {
          message: "tai khoan hoac mk khong chinh xac",
          type: "warning",
          authenticated: req.authenticated,
        });
      } else if (data.rowCount == 1 && data.rows[0].password === "") {
        bcrypt
          .hash(newpassword, 10)
          .then((hash) => {
            db.query(
              'update public."User" set "password" = $1 where "username" = $2',
              [hash, username]
            );
            res.render("./user/changePassword", {
              message: "doi mat khau thanh cong",
              type: "success",
              authenticated: req.authenticated,
            });
          })
          .catch((err) => console.log(err));
      } else {
        // Load hash from your password DB.
        bcrypt
          .compare(password, data.rows[0].password)
          .then((match) => {
            if (match) {
              bcrypt
                .hash(newpassword, 10)
                .then((hash) => {
                  db.query(
                    'update public."User" set "password" = $1 where "username" = $2',
                    [hash, username]
                  );
                  res.render("./user/changePassword", {
                    message: "doi mat khau thanh cong",
                    type: "success",
                    authenticated: req.authenticated,
                  });
                })
                .catch((err) => console.log(err));
            } else {
              res.render("./user/changePassword", {
                message: "sai mat khau cu",
                type: "warning",
                authenticated: req.authenticated,
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });
  }
}

module.exports = new UserSystemController();
