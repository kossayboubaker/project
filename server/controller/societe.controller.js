const mysql = require('mysql2');



// get ALL offres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const societeController = {

    findone: async (req, res) => {
        pool.getConnection((err, connection) => {
            const context = {
                user: req.session.user || null,
            };
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            let searchTerm = req.params.id
            // User the connection
            connection.query('SELECT * from societe where gerant_id = ?', [searchTerm], (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('profil-entreprise', { data: { context }, rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });

    },


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

    },
    form: async (req, res) => {
        res.render('forms-gerant');
    },
    create: async (req, res) => {
        context = {
            user: req.session.user || null,
        };
        console.log(req.body);
        console.log(req.file);
        const { nom_societe, descpt_societe, address_soct, email_soct, telephone, num_fax, activite, ville, code_postale } = req.body;
        const url = req.file;
        const id = context.user.id



        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            let searchTerm = req.body.search
            // User the connection
            connection.query('INSERT INTO societe SET nom_societe = ?, descpt_societe = ?, address_soct = ?, email_soct = ?, telephone = ?, num_fax = ?, activite = ?, ville = ?, code_postale = ?, url = ?, gerant_id = ?', [nom_societe, descpt_societe, address_soct, email_soct, telephone, num_fax, activite, ville, code_postale, url, id], (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('forms-gerant', { data: { context } });
                } else {
                    console.log(err);
                }



            });
        });
    },
    update: async (req, res) => {
        try {
            console.log("body: ", req.body)
            const { nom_societe, descpt_societe, address_soct, email_soct, telephone, num_fax, ville, code_postale, activite } = req.body
            //check if all field is empty
            if (!nom_societe || !descpt_societe || !address_soct || !email_soct || !telephone || !num_fax || !ville || !code_postale || !activite) {
                return res.json({ status: "error", error: "Remplir tous les champs" })
            }
            const { id } = req.params
            const sql = "update societe set nom_societe = ?, descpt_societe = ?, address_soct = ?, email_soct = ?, telephone = ?, num_fax = ?, ville = ?, code_postale = ?, activite = ? where id = ? "
            await new Promise((resolve, reject) => {
                pool.query(sql, [nom_societe, descpt_societe, address_soct, email_soct, telephone, num_fax, ville, code_postale, activite, id], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
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
        } catch (error) {
            console.log(error);
            res.json({ status: "ilya un erreur de modification d'un societe" })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            await new Promise((resolve, reject) => {
                pool.query("delete from societe where id = ?", [id], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log('connected as ID' + connection.threadId);

                // User the connection
                connection.query('SELECT * from societe ', (err, rows) => {
                    // when done with the connection, release it
                    connection.release();
                    if (!err) {
                        res.render('offre-admin', { rows });
                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table: \n', rows);
                });
            });
        } catch (error) {
            console.log(error);
            res.json({ status: "ilya un erreur de suppression d'un societe" })
        }
    }
}



module.exports = societeController