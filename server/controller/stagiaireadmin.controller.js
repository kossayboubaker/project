
const mysql = require('mysql2');



// get ALL offres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const stagiaireadminController = {


    view: async (req, res) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            // join ulisateur and stagiaire tables, and select data from both
            connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.type_util = "stagiaire" ', (err, rows) => {
                // when done with the connection, release it

                connection.release();

                if (!err) {
                    res.render('stagiaire-admin', { rows });

                } else {
                    console.log(err);
                }

                console.log('the data from offre table: \n', rows);

            }
            );

        });

    },
    // Find  offre by search
    find: async (req, res) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            let searchTerm = req.body.search
            // User the connection
            connection.query(' SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.type_util = "stagiaire" AND u.id = s.id  AND s.niveau LIKE ? OR s.etablissement LIKE ? OR s.address LIKE ? OR s.specialite LIKE ? OR u.nom LIKE ? OR u.prenom LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {

                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('stagiaire-admin', { rows });
                } else {
                    console.log(err);
                }

            });
        });

    },



    form: async (req, res) => {
        res.render('formstagiaire-admin');
    },

    create: async (req, res) => {
        console.log(req.body);
        console.log(req.file);
        const { niveau, telephone, specialite, etablissement, address, description_stagiaire, avatar, nom, prenom, email, mot_pass } = req.body;


        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            // Use the connection
            connection.query(
                'INSERT INTO utilisateur (nom, prenom, email, mot_pass) VALUES (?, ?, ?, ?)',
                [nom, prenom, email, mot_pass],
                (err, utilisateurRows) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    const utilisateurId = utilisateurRows.insertId;

                    connection.query(
                        'INSERT INTO stagiaire (niveau, telephone, specialite, etablissement, address, description_stagiaire, utilisateur_id, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [niveau, telephone, specialite, etablissement, address, description_stagiaire, utilisateurId, avatar],
                        (err, stagiaireRows) => {
                            // When done with the connection, release it
                            connection.release();

                            if (err) {
                                console.log(err);
                                return;
                            }

                            // Retrieve the inserted utilisateur entry
                            connection.query(
                                'SELECT * FROM utilisateur WHERE id = ?',
                                [utilisateurId],
                                (err, retrievedUtilisateurRows) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }

                                    const retrievedUtilisateur = retrievedUtilisateurRows[0];

                                    res.render('formstagiaire-admin', { utilisateur: retrievedUtilisateur });
                                }
                            );
                        }
                    );
                }
            );
        });
    },

    editform: async (req, res) => {
        res.render('modifie-stagiaireadmin');
    },
    edit: async (req, res) => {


        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.type_util = "stagiaire" ', [req.params.id], (err, rows) => {
                // when done with the connection, release it

                connection.release();
                rows = rows[0];
                console.log(rows);

                if (!err) {
                    console.log(req.params.id);
                    res.render('modifie-stagiaireadmin', { rows });

                } else {
                    console.log(err);
                }

                console.log('the data from offre table: \n', rows);

            });
        });
    },
    modifie: async (req, res) => {

        const id = req.params.id;
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const email = req.body.email;
        const telephone = req.body.telephone;
        const niveau = req.body.niveau;
        const specialite = req.body.specialite;
        const etablissement = req.body.etablissement;
        const address = req.body.address;
        const description_stagiaire = req.body.description_stagiaire;

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);
            // update both the utilisateur and stagiaire tables
            connection.query('UPDATE utilisateur INNER JOIN stagiaire ON utilisateur.id = stagiaire.utilisateur_id SET utilisateur.nom = ?, utilisateur.prenom = ?, utilisateur.email = ?, stagiaire.telephone = ?, stagiaire.niveau = ?, stagiaire.specialite = ?, stagiaire.etablissement = ?, stagiaire.address = ?, stagiaire.description_stagiaire = ? WHERE stagiaire.id = ?', [nom, prenom, email, telephone, niveau, specialite, etablissement, address, description_stagiaire, id], (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                    pool.getConnection((err, connection) => {
                        if (err) throw err;
                        console.log('connected as ID' + connection.threadId);

                        // Use the connection
                        connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.type_util = "stagiaire"', (err, rows) => {
                            // When done with the connection, release it
                            connection.release();
                            if (!err) {
                                res.render('stagiaire-admin', { rows });
                            } else {
                                console.log(err);
                            }
                        });
                    });
                } else {
                    console.log(err);
                }
            });
        });
    },
    delete: async (req, res) => {
        const id = req.params.id;
        pool.getConnection(async (err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            await new Promise((resolve, reject) => {
                connection.query('delete from stagiaire where id = ?', [id], (err, result) => {
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

                // Use the connection
                connection.query('SELECT u.*, s.* FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.tupe_util = "stagiaire"', (err, rows) => {
                    // When done with the connection, release it
                    connection.release();
                    if (!err) {
                        res.render('stagiaire-admin', { rows });
                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table: \n', rows);
                });
            });
        });
    },
}

module.exports = stagiaireadminController;