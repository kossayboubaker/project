
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const pool = require('../database/db');

const registerController = {
  create: async (req, res) => {

    try {
      const { email, mot_pass, mot_passConfirm, nom, prenom, type_util } = req.body;

      const conn = await pool.promise();


      // Validation du mot de passe


      if (mot_pass.length < 6) {
        console.log({ error: "Le mot de passe doit contenir au moins 6 caractères" });
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
      } if (!mot_pass) {
        console.log({ error: "Veuillez saisir une mot de passe valide" });
        return res.status(400).json({ error: "Veuillez saisir une mot de passe valide" });
      }
      // Validation du nom
      if (!nom || nom.trim().length === 0) {
        console.log({ error: "Le nom de famille ne doit pas être vide" });
        return res.status(400).json({ error: "Le nom de famille ne doit pas être vide" });
      } if (!/^[a-zA-Z]+$/.test(nom)) {
        console.log({ error: "Le nom de famille ne doit contenir que des lettres" });
        return res.status(400).json({ error: "Le nom de famille ne doit contenir que des lettres" });
      }


      // Validation du nom de famille
      if (!prenom || prenom.trim().length === 0) {
        console.log({ error: "Le prenom  ne doit pas être vide" });
        return res.status(400).json({ error: "Le prenom ne doit pas être vide" });
      } if (!/^[a-zA-Z]+$/.test(prenom)) {
        console.log({ error: "Le prenom ne doit contenir que des lettres" });
        return res.status(400).json({ error: "Le prenom ne doit contenir que des lettres" });
      }


      // Validation du rôle
      if (!type_util || type_util.trim().length === 0) {
        console.log({ error: "Le role  ne doit pas être vide" });
        return res.status(400).json({ error: "Le role ne doit pas être vide" });
      }



      // Vérifier si le mot de passe et la confirmation de mot de passe correspondent
      if (mot_pass !== mot_passConfirm) {
        console.log({ error: "Le mot de passe et la confirmation de mot de passe ne correspondent pas" });
        return res.status(400).json({ error: "Le mot de passe et la confirmation de mot de passe ne correspondent pas" });
      }

      // Vérifier si l'utilisateur existe déjà
      const selectSql = "SELECT * FROM utilisateur WHERE email = ?";
      const [selectRows, selectFields] = await conn.query(selectSql, [email]);

      if (selectRows.length > 0) {
        console.log("Cet utilisateur existe déjà");
        return res.status(409).json({ error: "Cet utilisateur existe déjà" });

      }

      // Hasher le mot de passe
      bcrypt.hash(mot_pass, 10).then(function (hash) {
        const sql = "INSERT INTO utilisateur (email, mot_pass, nom, prenom, type_util) VALUES (?, ?, ?, ?, ?)";

        pool.query(sql, [email, hash, nom, prenom, type_util], function (err, results, fields) {
          if (err) {
            res.sendStatus(500);
          } else {
            const utilisateur_id = results.insertId;
            // Insertion dans la table correspondante en fonction du type_util de l'utilisateur
            switch (type_util) {
              case "gérant":
                const sqlGerant = "INSERT INTO stagiaire (utilisateur_id,telephone,specialite,etablissement,address,description_stagiaire, avatar) VALUES (?,99999999,'Gérant','Societé','Tozeur,degech','Gérant','avatar-1683285817278.jpg')";
                pool.query(sqlGerant, [utilisateur_id]);
                break;
              case "stagiaire":
                const sqlStagiaire = "INSERT INTO stagiaire (utilisateur_id) VALUES (?)";
                pool.query(sqlStagiaire, [utilisateur_id]);
                break;
              case "admin":
                const sqlAdministrateur = "INSERT INTO stagiaire (utilisateur_id, avatar) VALUES (?,'avatar-1683285817278.jpg')";
                pool.query(sqlAdministrateur, [utilisateur_id]);
                break;
              default:
                // type_util inconnu
                break;
            }

            res.render('login');
          }
        });
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Une erreur s'est produite lors de la création de l'utilisateur" });
    }
  },


  getALL: async (req, res) => {
    try {

      res.render('inscription');

    } catch (error) {
      console.log(error);
      res.json({ status: "ilya un erreur d'affichage utilisateur" })

    }
  },
};

module.exports = registerController;
