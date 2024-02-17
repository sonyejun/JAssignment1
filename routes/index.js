var express = require('express');
var router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ObjectId } = require("mongodb");

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/`; //default port is 27017
const client = new MongoClient(dbUrl);

/* GET home page. */
router.get('/', async function(req, res, next) {
  let movies = await getMoviesTop4()
  res.render('main', { title: 'main', movies });
});

/* GET list page. */
router.get('/list', async function(req, res, next) {
  let movies = await getMovies()
  res.render('list', { title: 'list', movies });
});

/* GET detail page. */
router.get('/detail/:movieId', async function(req, res, next) {
  let movie = await getMovie(req.params.movieId);
  res.render('detail', { title: 'detail', movie });
});

/* GET create page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'create' });
});




router.post("/api/movie/create", async (req, res) => {
  var newMovie = req.body;  //get form data
  await addMovie(newMovie);
  res.redirect('/list'); //redirect back to list page
});

router.get("/movie/top4", async (req, res) => {
  var newMovie = req.body;  //get form data
  await addMovie(newMovie);
  res.redirect('/list'); //redirect back to list page
});

//mongodb
async function connection() {
  db = client.db("Http5222db");
  return db;
};

async function getMovies() {
  db = await connection();
  let results = db.collection("movies").find({});
  let res = await results.toArray();
  return res;
};

async function getMoviesTop4() {
  db = await connection();
  let results = db.collection("movies").find({}).sort({rating: -1}).limit(4);
  let res = await results.toArray();
  return res;
};

async function getMovie(id) {
  db = await connection();
  const getSingleId = { _id: new ObjectId(id) };
  const result = await db.collection("movies").findOne(getSingleId);
  return result;
};

async function addMovie(newMovie) {
  db = await connection();
  await db.collection("movies").insertOne(newMovie);
};

module.exports = router;
