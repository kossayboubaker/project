const pool = require("../database/db")

// get ALL condidatures

const candidatureController = {

    getALL: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from candidature")
            console.log(rows);
            res.json({
                data: rows
            })
            res.render('liste-stagiaire', { data: { context }, rows });
        } catch (error) {
            console.log(error);
            res.json({ status: "ilya un erreur d'affichage des candidatures" })

        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from candidature where id = ?", [id])
            console.log(rows);
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error);
            res.json({ status: "ilya un erreur d'affichage de candidature" })

        }
    },
    create: async (req, res) => {
        try {
            const { statut, offre_id, stagiaire_id } = req.body
            const sql = "insert into candidature (statut, offre_id, stagiaire_id) values (?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [statut, offre_id, stagiaire_id])
            res.json({
                data: rows
            })
            console.log("data insert", rows);
        } catch (error) {
            console.log(error);
            res.json({ status: "ilya un erreur d'insertion de candidature" })

        };
    },
    update: async (req, res) => {
        const context = {
            user: req.session.user || null,
        };
        try {
            const { statut } = req.body
            const { id } = req.params
            const sql = "update candidature set statut = ? where id = ?"
            pool.query(sql, [statut, id])
            console.log("data update");
            res.render('home', { data: { context } })

        } catch (error) {
            console.log(error);
            res.json({ status: error.message })
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from candidature where id = ?", [id])
            console.log("data delete");
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error);
            res.json({ status: "ilya un erreur de suppression d'un candidature" })
        }
    }
}



module.exports = candidatureController