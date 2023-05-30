
const mysql = require('mysql2');



// get ALL offres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const commentaireController = {

    view: async (req, res) => {
        const context = {
            user: req.session.user || null,
        };
        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID' + connection.threadId);

            // User the connection
            connection.query('SELECT * from commentaire ', (err, rows) => {
                // when done with the connection, release it
                connection.release();

                if (!err) {
                    res.render('commentaires', { data: {context} , rows });
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
                    res.render('commentaires', { rows });
                } else {
                    console.log(err);
                }

                console.log('the data from user table: \n', rows);

            });
        });

    },
    form: async (req, res) => {
        res.render('home');
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
                    res.render('home');
                } else {
                    console.log(err);
                }



            });
        });
    },
}
module.exports = commentaireController;

