
const mysql = require('mysql2');



// get ALL offres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const commentaireadminController = {

    view: async (req, res) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query('SELECT * from commentaire ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('commentaire-admin', { rows });
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
            connection.query('SELECT * from commentaire where nom like ? OR role like ? OR description like ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('commentaire-admin', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });

    },
    form: async (req, res) => {
        res.render('commentaireadmin');
    },

    create: async (req, res) => {
        console.log(req.body);

        const { nom, role, description } = req.body;


        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            let searchTerm = req.body.search
            // User the connection
            connection.query('INSERT INTO commentaire SET nom = ?, role = ?, description = ?', [nom, role, description], (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('ajouter-commentaireadmin');
                } else {
                    console.log(err);
                }



            });
        });
    },
    editform: async (req, res) => {
        res.render('modifie-commentaireadmin');
    },
    edit: async (req, res) => {


        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);


            // User the connection
            connection.query('SELECT * FROM commentaire where id =?', [req.params.id], (err, rows) => {
                // when done with the connection, release it

                connection.release();
                rows = rows[0];
                console.log(rows);

                if (!err) {
                    console.log(req.params.id);
                    res.render('modifie-commentaireadmin', { rows });

                } else {
                    console.log(err);
                }

                console.log('the data from offre table: \n', rows);

            });
        });
    },
    modifie: async (req, res) => {
        try {
            const { nom, role, description_stagiaire } = req.body;
            const { id } = req.params;
            const sql = "UPDATE commentaire SET nom = ?, role = ?, description = ? WHERE id = ?";
            //why i can't use await here
            await new Promise((resolve, reject) => {
                pool.query(sql, [nom, role, description_stagiaire, id], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            pool.getConnection((err, connection) => {
                if (err)
                    throw err;
                console.log('connected as ID' + connection.threadId);
                // User the connection
                connection.query('SELECT * from commentaire ', (err, rows) => {
                    // when done with the connection, release it
                    connection.release();

                    if (!err) {
                        res.render('commentaire-admin', { rows });
                    } else {
                        console.log(err);
                    }

                    console.log('the data from user table: \n', rows);

                });
            });
        } catch (error) {
            console.log(error);
            res.json({ status: error.message });
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const sql = "DELETE FROM commentaire WHERE id = ?";
        //use promise like modifie
        await new Promise((resolve, reject) => {
            pool.query(sql, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        pool.getConnection((err, connection) => {
            if (err)
                throw err;
            console.log('connected as ID' + connection.threadId);
            // User the connection
            connection.query('SELECT * from commentaire ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('commentaire-admin', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });
    },
}
module.exports = commentaireadminController;

