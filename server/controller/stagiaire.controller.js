
const mysql = require('mysql2');



// get ALL offres
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})


const stagiaireController = {

  findone: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    console.log(context);
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      let id = req.params.id
      // User the connection
      //join stagiaire and utilisateur
      connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE  s.id = ?', [id], (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('profil-stagiaire', { data: { context }, rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      }
      );
    });
  },

  view: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    console.log(context);
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);


      // Use the connection
      const sql = 'SELECT s.avatar, u.nom, u.prenom, s.niveau, s.specialite, s.etablissement, s.address, s.id AS profile_id, c.id AS id, c.statut as statut FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id INNER JOIN candidature c ON c.stagiaire_id = s.id INNER JOIN offre o ON o.id = c.offre_id INNER JOIN societe d ON o.societe_id = d.id WHERE d.gerant_id = ?';
      const params = [context.user.id];
      connection.query(sql, params, (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error retrieving data from database' });
        }

        console.log('the data from user table: \n', rows);
        res.render('liste-stagiaire', { data: { context }, rows });
      });
    });
  },
  // Find  offre by search
  find: (req, res) => {

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      let searchTerm = req.body.search
      // User the connection
      connection.query('SELECT * from stagiaire where niveau like ? OR etablissement like ? OR address like ? OR specialite like ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('liste-stagiaire', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      });
    });

  },



  form: async (req, res) => {
    res.render('inscript-stagiaire');
  },

  create: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    console.log(req.body);
    console.log(req.file);
    const { niveau, specialite, etablissement, address, description_stagiaire, telephone } = req.body;
    const avatar = req.file.filename;
    const id = context.user.id

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);

      console.log(req.body);
      connection.query('UPDATE stagiaire SET niveau = ?, specialite = ?, etablissement = ?, address = ?, description_stagiaire = ?, avatar = ?, telephone = ? WHERE utilisateur_id = ?', [niveau, specialite, etablissement, address, description_stagiaire, avatar, telephone, id], (err, rows) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('inscript-stagiaire',  { data: { context }});
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      });
      req.session.user = {



      };
    });
  },
  editform: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };
    const id = req.params.id;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);


      // User the connection
      connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.id = ? AND u.id = s.id', [id], (err, rows) => {
        // when done with the connection, release it

        connection.release();
        rows = rows[0];
        console.log(rows);

        if (!err) {
          res.render('modifie-stagiaire',
            { data: { context }, rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      });
    });

  },
  edit: async (req, res) => {
    const context = {
      user: req.session.user || null,
    };


    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as ID' + connection.threadId);


      // User the connection
      connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.type_util = "stagiaire" AND u.id = s.id', [req.params.id], (err, rows) => {
        // when done with the connection, release it

        connection.release();
        rows = rows[0];
        console.log(rows);

        if (!err) {
          console.log(req.params.id);
          res.render('profil-stagiaire', { data: { context }, rows });
        } else {
          console.log(err);
        }

        console.log('the data from stagiaire table: \n', rows);

      });
    });
  },
  modifie: async (req, res) => {
    const { nom, prenom, email, niveau, specialite, etablissement, address, description_stagiaire, telephone } = req.body;
    console.log("req.params.id: ", req.params.id);
    console.log("req.body: ", req.body);
    // check if field not empty tell who is empty

    //Update stagiaire and utilisateur table
    pool.getConnection(async (err, connection) => {

      if (err) throw err;
      console.log('connected as ID' + connection.threadId);
      const query = 'UPDATE stagiaire s INNER JOIN utilisateur u ON s.utilisateur_id = u.id SET s.niveau = ?, s.specialite = ?, s.etablissement = ?, s.address = ?, s.description_stagiaire = ?, s.telephone = ?, u.nom = ?, u.prenom = ?, u.email = ? WHERE S.id = ?';
      const params = [niveau, specialite, etablissement, address, description_stagiaire, telephone, nom, prenom, email, req.params.id];
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      connection.query(' SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.type_util = "stagiaire"', (err, rows) => {
        // when done with the connection, release it
        connection.release();
        if (!err) {
          res.render('stagiaire-admin', { rows });
        } else {
          console.log(err);
        }

        console.log('the data from user table: \n', rows);

      });


    });
  }
}
module.exports = stagiaireController;