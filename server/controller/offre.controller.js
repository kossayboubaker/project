
const mysql = require('mysql2');

const pool = require("../database/db")

// get ALL offres



const offreController = {

  postule: async (req, res) => {
    console.log(req.body);
    const context = {
      user: req.session.user || null,
    };
    const { id_offre, id_user } = req.body;
    const date_candidature = new Date();
    const statut = "En attente";

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      // Use the connection candidature table(date_candidature	statut	offre_id	stagiaire_id)
      connection.query('INSERT INTO candidature SET date_candidature = ?, statut = ?, offre_id = ?, stagiaire_id = ?', [date_candidature, statut, id_offre, id_user], (err, rows) => {

        // When done with the connection, release it
        connection.release();

        if (!err) {
          res.render('home', { data: { context } });
        } else {
          console.log(err);
        }
      });
    });
  },
  // Find offre by id
  findoffrebyid: async (req, res) => {
    // find offre by id of user
    const context = {
      user: req.session.user || null,
    };
    // join offre and societe table and 
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);
      // get offers with pic from societe table
      const id = req.params.id;
      const sql = 'SELECT * FROM offre o INNER JOIN societe s ON o.societe_id = s.id WHERE s.gerant_id = ?';
      const params = [id];
      connection.query(sql, params, (err, rows) => {
        // when done with the connection, release it
        connection.release();
        if (!err) {
          res.render('liste-offres', {
            rows,
            data: { context }
          });
        } else {
          console.log(err.message);
        }
        console.log('the data from user table: \n', rows);
      });
    });
  },



  // View offres

  view: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    console.log(context);
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID offer' + connection.threadId);
      // get offers with pic from societe table
      connection.query('SELECT o.*,s.* FROM offre o  INNER JOIN societe s ON o.societe_id = s.id ', (err, rows) => {
        // when done with the connection, release it
        console.log("rows offer ", rows);
        if (!err) {
          // get id of stagiaire of current user id
          connection.query('SELECT * FROM `stagiaire` WHERE utilisateur = ?',[context.user.id], (err, rowsWithUserID) => {
            // when done with the connection, release it
            connection.release();
            if (!err) {
              // add id to rows from societe table
              const rowsWithUserIDMapped = rows.map(row => {
                row.id_user = rowsWithUserID[0].id;
                return row;
              });
              res.render('offre-stage', {
                rows: rowsWithUserIDMapped,
                data: { context }
              });
            } else {
              console.log(err.message);
            }
            console.log('the data from user table: \n', rows);
          });
        }
      });
    });
  },





  // Find  offre by search
  find: async (req, res) => {

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      let searchTerm = req.body.search
      // User the connection
      connection.query('SELECT o.*, s.url, s.FROM offre o INNER JOIN societe s ON o.societe_id = s.id where o.specialite like ? OR o.titre like ? OR s.like ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('offre-stage', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      });
    });

  },

  form: async (req, res) => {
    res.render('forms-entreprise');
  },

  create: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    console.log(req.body);

    const { titre, descpt, date_debut, date_fin, dateexp, specialite, } = req.body;

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      // Use the connection
      connection.query('INSERT INTO offre SET titre = ?, descpt = ?, date_debut = ?, date_fin = ?, dateexp = ?, specialite = ?,nom_societe = ?', [titre, descpt, date_debut, date_fin, dateexp, specialite, nom_societe], (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          res.render('forms-entreprise');
        } else {
          if (offre_id=== societe_id) {
            const sqlsociete = "INSERT INTO societe SET societe_id = ? + id";
            
            pool.query(sqlsociete, [rows.insertId, societe_id], (err, result) => {
              if (err) throw err;
              res.render("forms-entreprise", { data: { context } });
            });
          }
        }
      });
    });
  },
  editoffre: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    const { titre, descpt, date_debut, date_fin, dateexp, specialite } = req.body;
    const id = req.params.id;
    pool.getConnection(async (err, connection) => {
      if (err) throw err;
      const sql = 'update offre SET  titre = ?, descpt = ?, date_debut = ?, date_fin = ?, dateexp = ?, specialite = ? where id = ?';
      const params = [titre, descpt, date_debut, date_fin, dateexp, specialite, id];
      // User the connection
      await new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      });
      connection.query('SELECT * from offre where id = ?', [id], (err, rows) => {
        // when done with the connection, release it
        connection.release();
        if (!err) {
          res.render('modifie-offre', { rows, data: { context } });
        } else {
          console.log(err);
        }
        console.log('the data from user table: \n', rows);
      });
    });
  },

  edit: async (req, res) => {
    console.log(req.body);

    const { descpt, date_debut, date_fin, dateexp, specialite } = req.body;
    console.log(req.body)


    const id = req.params.id;


    pool.getConnection(async (err, connection) => {
      if (err) throw err;

      const query = 'update offre SET  descpt = ?, date_debut = ?, date_fin = ?, dateexp = ?, specialite = ? where id = ?';
      const params = [descpt, date_debut, date_fin, dateexp, specialite, id];

      // User the connection
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      });
      connection.query('SELECT * from offre ', (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('offre-admin', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from edited table: \n', rows);

      });
    })
  },
  editform: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    const id = req.params.id;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      // Use the connection
      connection.query('SELECT * FROM offre WHERE id = ?', [id], (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          const row = rows[0]
          res.render('modifie-offre',
            { row, data: { context } });
        } else {
          console.log(err);
        }

        console.log('the data from offre table: \n', rows);

      });
    });
  },

  delete: async (req, res) => {
    console.log(req.body);

    const id = req.params.id;

    pool.getConnection(async (err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      // Use the connection
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM offre WHERE id = ?', [id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });

        connection.query('SELECT * from offre ', (err, rows) => {
          // when done with the connection, release it
          connection.release();

          if (!err) {
            res.render('offre-admin', { rows });
          } else {
            console.log(err);
          }

          console.log('the data from edited table: \n', rows);

        });

      });
    });
  },
  deleteoffre: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    console.log(req.body);

    const id = req.params.id;

    pool.getConnection(async (err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      // Use the connection
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM offre WHERE id = ?', [id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });

        connection.query('SELECT * from offre ', (err, rows) => {
          // when done with the connection, release it
          connection.release();

          if (!err) {
            res.render('home', { data: { context } });
          } else {
            console.log(err);
          }

          console.log('the data from edited table: \n', rows);

        });

      });
    });
  },
}
module.exports = offreController;