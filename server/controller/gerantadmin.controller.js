
const mysql = require('mysql2');
const bcrypt = require('bcrypt');



// get ALL offres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const gerantadminController = {


    view: async (req, res) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query(' SELECT * FROM utilisateur  WHERE type_util = "gérant" ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('liste-gerant', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });

    },
    profile: async (req, res) => {
        const context = {
            user: req.session.user || null,
        };
        const id = req.params.id;
        console.log(id);
        pool.getConnection((err, connection) => {
            //join utilisateur and societe
            connection.query('SELECT * FROM utilisateur u INNER JOIN societe s ON u.id = s.gerant_id WHERE u.id = ?', [id], (err, rows) => {
                connection.release();
                if (!err) {
                    res.render('profil-gerant', { rows, data :{ context } });
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
            connection.query('SELECT * FROM utilisateur u INNER JOIN societe s  WHERE u.type_util = "gérant" AND nom LIKE ? OR prenom LIKE ? OR email LIKE ? ', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {

                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('liste-gerant', { rows });
                } else {
                    console.log(err);
                }

            });
        });

    },

    form: async (req, res) => {
        res.render('ajoute-gerantadmin');
    },

    create: async (req, res) => {
        console.log("Request body: ", req.body);

        const { nom, prenom, email } = req.body;
        const mot_pass = bcrypt.hashSync("password", 10);
        const type_util = "gérant";
        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            let searchTerm = req.body.search
            // User the connection
            connection.query('INSERT INTO utilisateur SET nom = ?, prenom = ?, email = ?, mot_pass = ?, type_util = ?', [nom, prenom, email, mot_pass, type_util], (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('ajoute-gerantadmin');
                } else {
                    console.log(err);
                }



            });
        });
    },

    editform: async (req, res) => {
        res.render('modifie-gerantadmin');
    },
    edit: async (req, res) => {


        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query('SELECT * FROM utilisateur  WHERE type_util = "gérant"', [req.params.id], (err, rows) => {
                // when done with the connection, release it

                connection.release();
                rows = rows[0]
                console.log(rows);

                if (!err) {
                    console.log(req.params.id);
                    res.render('modifie-gerantadmin', { rows });

                } else {
                    console.log(err);
                }

                console.log('the data from gérant table: \n', rows);

            });
        });
    },
    update: async (req, res) => {
        const { nom, prenom, email } = req.body;
        let { id } = req.params;

        pool.getConnection(async (err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            // User the connection
            await new Promise((resolve, reject) => {
                connection.query('UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, id], (err, rows) => {
                    if (err) return reject(err);
                    else resolve(rows);
                });
            });
            connection.query(' SELECT u.*, s.* FROM utilisateur u INNER JOIN societe s  WHERE u.type_util = "gérant" ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('liste-gerant', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
            // when done with the connection, release it



        });
    },

    delete: async (req, res) => {
        let { id } = req.params;

        pool.getConnection(async (err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            // User the connection
            await new Promise((resolve, reject) => {
                connection.query('DELETE FROM utilisateur WHERE id = ?', [id], (err, rows) => {
                    if (err) return reject(err);
                    else resolve(rows);
                });
            });
            connection.query(' SELECT u.*, s.* FROM utilisateur u INNER JOIN societe s  WHERE u.type_util = "gérant" ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('liste-gerant', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });

        });
    }

}
module.exports = gerantadminController;