const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const baseUrl = process.env.HEALTH_BASE_PATH || '';

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect(baseUrl + '/users/login')
    } else { 
        next ();
    } 
}

// List workouts
router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM workouts WHERE username = ?"; 
    // We use the session userId (which stores the username)
    db.query(sqlquery, [req.session.userId], (err, result) => {
        if (err) { next(err); }
        res.render("listworkouts.ejs", { availableWorkouts: result });
    });
});

router.get('/add', redirectLogin, function (req, res, next) {
    res.render("addworkout.ejs");
});

// Add workout (With username)
router.post('/added', redirectLogin, 
    [check('name').notEmpty(),
     check('duration').isInt({ min: 1 }),
     check('calories').isInt({ min: 1 })
    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('addworkout.ejs', { errors: errors.array() });
    }

    // Include the username from the session
    let sqlquery = "INSERT INTO workouts (username, name, duration, calories) VALUES (?,?,?,?)";
    let newrecord = [req.session.userId, req.body.name, req.body.duration, req.body.calories];
    
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) { next(err); }
        else {
            res.redirect(baseUrl + '/workouts/list')
        }
    });
});

// Search workouts
router.get('/search', redirectLogin, function(req, res, next){
    res.render("search.ejs");
});

router.get('/search-result', redirectLogin, [check('keyword').notEmpty()], function (req, res, next) {
    let keyword = req.sanitize(req.query.keyword);
    let sqlquery = "SELECT * FROM workouts WHERE username = ? AND name LIKE ?";
    let search_term = '%' + keyword + '%';

    db.query(sqlquery, [req.session.userId, search_term], (err, result) => {
        if (err) { next(err); }
        res.render("listworkouts.ejs", { availableWorkouts: result });
    });
});
router.get('/delete/:id', redirectLogin, function(req, res, next) {
    let sql = "DELETE FROM workouts WHERE id = ? AND username = ?";
    db.query(sql, [req.params.id, req.session.userId], (err, result) => {
        if (err) return next(err);
        res.redirect('/workouts/list');
    });
});
module.exports = router;