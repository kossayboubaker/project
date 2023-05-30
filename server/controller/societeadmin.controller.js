
const mysql = require('mysql2');



// get ALL offres
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

const societeadminController = {

  view: async (req, res) => {

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);


      // User the connection
      connection.query('SELECT * from societe ', (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('societe-admin', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

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
      connection.query('SELECT * from societe where nom_societe like ? OR ville like ? OR code_postale like ? OR address_soct like ? OR activite like ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('societe-admin', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      });
    });

  }, form: async (req, res) => {
    res.render('ajoute-societeadmin');
  },

  create: async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const { nom_societe, descpt_societe, address_soct, email_soct, telephone, num_fax, activite, ville, code_postale } = req.body;
    const url = req.file.filename;



    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      let searchTerm = req.body.search
      // User the connection
      connection.query('INSERT INTO societe SET nom_societe = ?, descpt_societe = ?, address_soct = ?, email_soct = ?, telephone = ?, num_fax = ?, activite = ?, ville = ?, code_postale = ?, url = ?', [nom_societe, descpt_societe, address_soct, email_soct, telephone, num_fax, activite, ville, code_postale, url], (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('ajoute-societeadmin');
        } else {
          console.log(err);
        }



      });
    });
  },
  editform: async (req, res) => {
    res.render('modifie-societeadmin');
  },
  edit: async (req, res) => {

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);


      // User the connection
      connection.query('SELECT * From societe where id = ?', [req.params.id], (err, rows) => {
        // when done with the connection, release it

        connection.release();
        rows = rows[0];
        console.log(rows);

        if (!err) {
          console.log(req.params.id);
          res.render('modifie-societeadmin', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from societe table: \n', rows);

      });
    });
  },
  compte: async (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      // Use the connection
      connection.query('SELECT COUNT(*) AS userCount FROM utilisateur', (err, userResult) => {
        if (err) {
          console.log(err);
          connection.release();
          return res.status(500).send('Error retrieving user count');
        }

        connection.query('SELECT COUNT(*) AS offreCount FROM offre', (err, offreResult) => {
          if (err) {
            console.log(err);
            connection.release();
            return res.status(500).send('Error retrieving offre count');
          }

          connection.query('SELECT COUNT(*) AS commentaireCount FROM commentaire', (err, commentaireResult) => {
            if (err) {
              console.log(err);
              connection.release();
              return res.status(500).send('Error retrieving commentaire count');
            }

            connection.query('SELECT COUNT(*) AS gerantCount FROM utilisateur WHERE type_util = "gerant"', (err, gerantResult) => {
              if (err) {
                console.log(err);
                connection.release();
                return res.status(500).send('Error retrieving gerant count');
              }

              connection.query('SELECT COUNT(*) AS stagiaireCount FROM utilisateur WHERE type_util = "stagiaire"', (err, stagiaireResult) => {
                connection.release();
                if (err) {
                  console.log(err);
                  return res.status(500).send('Error retrieving stagiaire count');
                }

                const data = {
                  userCount: userResult[0].userCount,
                  offreCount: offreResult[0].offreCount,
                  commentaireCount: commentaireResult[0].commentaireCount,
                  gerantCount: gerantResult[0].gerantCount,
                  stagiaireCount: stagiaireResult[0].stagiaireCount
                };
                res.render('dashboard-admin', { data });
              });
            });
          });
        });
      });
    });
  }

}

module.exports = societeadminController;