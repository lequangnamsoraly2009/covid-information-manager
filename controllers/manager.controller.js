class ManagerController {
  // GET /
  relatedCovidView(req, res, next) {
    if (!req.authenticated) {
      res.redirect("/");
    } else {
      if (req.query.q) {
        require("../db")
          .query('SELECT * FROM public."Nguoi" WHERE "hoten" LIKE $1;', [
            "%" + req.query.q + "%",
          ])
          .then((data) => {
            if (data.rowCount == 0) {
              console.log("khong co du lieu");
              res.render("manager/related", {
                authenticated: req.authenticated,
              });
            } else {
              res.render("manager/related", {
                authenticated: req.authenticated,
                data: data.rows,
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        require("../db")
          .query('select *  from public."Nguoi"')
          .then((data) => {
            if (data.rowCount == 0) {
              console.log("khong co du lieu");
              res.render("manager/related", {
                authenticated: req.authenticated,
              });
            } else {
              res.render("manager/related", {
                authenticated: req.authenticated,
                data: data.rows,
              });
            }
          });
      }
    }
  }
  detailCovidUser(req, res, next) {
    if (!req.authenticated) {
      res.redirect("/");
    } else {
      require("../db")
        .query('select *  from public."Nguoi" where "id"=$1', [req.params.id])
        .then((data) => {
          if (data.rowCount == 0) {
            console.log("khong co du lieu");
            res.render("manager/detailUser", {
              authenticated: req.authenticated,
            });
          } else {
            res.render("manager/detailUser", {
              authenticated: req.authenticated,
              data: data.rows[0],
            });
          }
        });
    }
  }
  addCovidUser(req, res, next) {
    if (!req.authenticated) {
      res.redirect("/");
    } else {
      res.render("manager/addCovidUser", {
        authenticated: req.authenticated,
      });
    }
  }
}

module.exports = new ManagerController();
