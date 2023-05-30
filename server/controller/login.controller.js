const bcrypt = require('bcrypt')
const mysql = require('mysql2');

const pool = require("../database/db")

const loginController = {

  create: async (req, res) => {
    const email = req.body.email;
    const mot_pass = req.body.mot_pass;
    console.log("login email: ", email);
    console.log("login mot_pass: ", mot_pass);
    if (!email || !mot_pass) {
      return res
        .status(400)
        .json({ message: "Email and mot_pass are required" });
    }

    pool.query(
      "SELECT u.* , s.avatar , s.id as profile_id FROM utilisateur u INNER JOIN stagiaire s ON u.id = s.utilisateur_id WHERE u.email = ?",
      [email],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "An error occurred" });
        }
        if (results.length === 0) {
          console.log("email");
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const utilisateur = results[0];
        console.log(utilisateur.mot_pass);
        bcrypt.compare(mot_pass, utilisateur.mot_pass, (err, result) => {

          console.log("mot_pass", typeof (mot_pass));
          console.log("utilisateur.mot_pass", typeof (utilisateur.mot_pass));
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred" });
          }
          if (!result) {
            console.log("mot de passe");
            return res.status(401).json({ message: "Invalid credentials mot de passe" });

          }
          req.session.user = {
            id: utilisateur.id,
            profile_id: utilisateur.profile_id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            type_util: utilisateur.type_util,
            avatar: utilisateur.avatar,
            url: utilisateur.url
          };
          res.cookie("sessionID", req.sessionID, { httpOnly: true });
          return res.status(200).json({ type_util: utilisateur.type_util });

        });
      }
    );
  },
};


module.exports = loginController;
