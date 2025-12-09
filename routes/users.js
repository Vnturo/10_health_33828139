const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const baseUrl = process.env.HEALTH_BASE_PATH || '';

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../users/login')
    } else { 
        next ();
    } 
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
});

router.post('/registered',
    [check('username').isLength({ min: 5, max: 20}).isAlphanumeric(),
     check('first').notEmpty().isAlpha(),
     check('last').notEmpty().isAlpha(),
     check('email').isEmail(), 
     check('password').isLength({ min: 8 })], 
    function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('register.ejs', { errors: errors.array() }); 
    }
    else {
        const first = req.sanitize(req.body.first);
        const last = req.sanitize(req.body.last);
        const email = req.sanitize(req.body.email);
        const username = req.sanitize(req.body.username);
        const plainPassword = req.body.password;
        const saltRounds = 10;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            if (err) { return next(err); }

            let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
            let newrecord = [username, first, last, email, hashedPassword];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.render('register.ejs', { 
                            errors: [{ msg: 'Username is already taken. Please choose another.' }] 
                        });
                    }
                    return next(err);
                }
                else {
                    res.render('registered.ejs', {
                        first: first,
                        last: last,
                        email: email,
                        username: username,
                        hashedPassword: hashedPassword,
                        password: plainPassword
                    });
                }
            });
        });
    }
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
});

router.post('/loggedin',
    [check('username').notEmpty(), check('password').notEmpty()],
    function (req, res, next) {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login.ejs', { error: 'Username and password are required.' });
    }
    
    const username = req.sanitize(req.body.username);
    const plainPassword = req.body.password;

    let sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, results) => {
        if (err) { return next(err); }
        
        if (results.length === 0) {
            return res.render('login.ejs', { error: 'Invalid username or password' });
        }
        
        const user = results[0];
        bcrypt.compare(plainPassword, user.hashedPassword, function(err, compareResult) {
            if (compareResult === true) {
                // Login Successful
                req.session.userId = username; 
                res.render('loggedin.ejs', { user: user }); 
            } else {
                // Login Failed
                res.render('login.ejs', { error: 'Invalid username or password' });
            }
        });
    });
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(function(err) {
        if(err) { return next(err); }
        res.render('logout.ejs');
    });
});

module.exports = router;