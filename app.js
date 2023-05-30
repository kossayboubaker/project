const express = require('express');
const engine = require('express-handlebars').engine;
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const path = require('path');
const session = require('express-session')
const app = express();
const port = process.env.PORT || 3000;
const handlebars = require("express-handlebars");
const hbs = handlebars.create();

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


hbs.handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
app.use(
  session({
    secret: "123aze",
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/login');
});

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require('dotenv').config();

// Parser middleware
//parser application
app.use(bodyParser.urlencoded({ extended: false }));
// parser application/json
app.use(bodyParser.json());

// Temlating Engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');



app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);



app.get('/dashboard-admin', (req, res) => {
  res.render('dashboard-admin');
});


app.get('/formstagiaire-admin', (req, res) => {
  res.render('formstagiaire-admin');
});
app.get('/ajoute-gerantadmin',(req, res) =>{
  res.render('ajoute-gerantadmin');
})

app.get('/ajoute-societeadmin', (req, res) => {
  res.render('ajoute-societeadmin');
});

app.get('/commentaires', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('commentaires', { data: { context } });
});


app.get('/societe-admin', (req, res) => {
  res.render('societe-admin');
});

app.get('/offre-admin', (req, res) => {
  res.render('offre-admin');
});

app.get('/gerant-admin', (req, res) => {
  res.render('gerant-admin');
});
app.get('/commentaire-admin', (req, res) => {
  res.render('commentaire-admin');
});

app.get('/modifie-societeadmin/:id', (req, res) => {
  res.render('modifie-societeadmin');
});

app.get('/modifie-gerantadmin/:id', (req, res) => {
  res.render('modifie-gerantadmin');
});


app.get('/publier-offre', (req, res) => {
  res.render('publier-offre');
});
app.get('/modifie-stagiaire/:id', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('modifie-stagiaire', { data: { context } });
});

app.get('/home', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('home', { data: { context } });
});
app.get('/', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('home', { data: { context } });
});
app.get('/inscript-stagiaire', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('inscript-stagiaire', { data: { context } });
});
app.get('/apropos', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('apropos', { data: { context } });
});
app.get('/profil-gerant', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('profil-gerant', { data: { context } });
});

app.get('/profil-entreprise', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('profil-entreprise', { data: { context } });
});
app.get('/forms-entreprise', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('forms-entreprise', { data: { context } });
});
app.get('/forms-gerant', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('forms-gerant', { data: { context } });
});
app.get('/liste-offres', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('liste-offres', { data: { context } });
});
app.get('/modifie-offre/:id', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('modifie-offre', { data: { context } });
});


app.get('/stagiaire-admin', (req, res) => {
  res.render('stagiaire-admin');
});

app.get('/liste-stagiaire', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('liste-stagiaire', { data: { context } });
});


app.get('/inscription', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('inscription', { data: { context } });
});
app.get('/ajouter-commentaireadmin', (req, res) => {
  res.render('ajouter-commentaireadmin');
});
app.get('/login', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('login', { data: { context } });
});

app.get('/profil-stagiaire', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('profil-stagiaire', { data: { context } });
});


app.get('/politique', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('politique', { data: { context } });
});

app.get('/support', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('support', { data: { context } });
});

app.get('/authentificate', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('authentificate', { data: { context } });
});


app.get('/chatroom', (req, res) => {
  console.log(req.session);
  const context = {
    user: req.session.user || null,
  };
  res.render('chatroom', { data: { context } });
});

//routes des register 
const registerRouter = require('./server/routes/register.router');
app.use('/register', registerRouter);


//routes des login 
const loginRouter = require('./server/routes/login.router');
app.use('/login', loginRouter);


// routes des offres
const offreRouter = require('./server/routes/offre.router');
app.use('/offre', offreRouter);

//routes des commentaires

const commentaireRouter = require('./server/routes/commentaire.router');
app.use('/commentaire', commentaireRouter);

//routes des stagiaires

const stagiaireRouter = require('./server/routes/stagiaire.router');
app.use('/stagiaire', stagiaireRouter);

//routes des stagiaires d'admin

const stagiaireadminRouter = require('./server/routes/stagiaireadmin.router');
app.use('/stagiaireadmin', stagiaireadminRouter);

//routes des societe
const societeadminRouter = require('./server/routes/societeadmin.router');
app.use('/societeadmin', societeadminRouter);


//routes des offre d'admin

const offreadminRouter = require('./server/routes/offreadmin.router');
app.use('/offreadmin', offreadminRouter);

//routes des stagiaires


const societeRouter = require('./server/routes/societe.router');
app.use('/societe', societeRouter);


//routes des condidature

const candidatureRouter = require('./server/routes/candidature.router');
app.use('/candidature', candidatureRouter);
//routes commantaire

const commentaireadminRouter = require('./server/routes/commentaireadmin.router');
app.use('/commentaireadmin', commentaireadminRouter);

const gerantadminRouter = require('./server/routes/gerantadmin.router');
app.use('/gerantadmin', gerantadminRouter);



//Connecting database

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log('connected as ID' + connection.threadId);
})



app.listen(port, () => console.log(`Listening on port ${port}`));