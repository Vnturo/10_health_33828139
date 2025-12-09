const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('../users/login');
    } else {
        next();
    }
}

// GET: Show Goals Dashboard
router.get('/', redirectLogin, function (req, res, next) {
    const user = req.session.userId;

    // Get Goal Settings
    let sqlGoals = "SELECT * FROM goals WHERE username = ?";
    
    // Get ALL weight history (Newest first)
    let sqlWeightHistory = "SELECT * FROM weight_history WHERE username = ? ORDER BY date DESC, id DESC";

    db.query(sqlGoals, [user], (err, goalResult) => {
        if (err) return next(err);

        db.query(sqlWeightHistory, [user], (err, historyResult) => {
            if (err) return next(err);
            let goalData = goalResult[0] || { height_cm: 0, start_weight: 0, target_weight: 0 };
            
            // Current weight logic
            let currentWeight = historyResult.length > 0 ? historyResult[0].weight : goalData.start_weight;

            // Calculate Progress
            let progress = 0;
            if (goalData.start_weight > 0 && goalData.target_weight > 0) {
                let totalToLose = goalData.start_weight - goalData.target_weight;
                let lostSoFar = goalData.start_weight - currentWeight;
                if (totalToLose !== 0) {
                    progress = (lostSoFar / totalToLose) * 100;
                }
            }
            // Calculate BMI
            let bmi = 0;
            let bmiCategory = "N/A";
            
            if (goalData.height_cm > 0 && currentWeight > 0) {
                let heightMeters = goalData.height_cm / 100;
                bmi = currentWeight / (heightMeters * heightMeters);
                bmi = Math.round(bmi * 10) / 10;

                if (bmi < 18.5) bmiCategory = "Underweight";
                else if (bmi < 25) bmiCategory = "Healthy Weight";
                else if (bmi < 30) bmiCategory = "Overweight";
                else bmiCategory = "Obese";
            }

            // Render the page
            res.render('goals.ejs', {
                data: goalData,
                currentWeight: currentWeight,
                progress: Math.round(progress * 10) / 10,
                weightHistory: historyResult,
                bmi: bmi,
                bmiCategory: bmiCategory
            });
        });
    });
});

// POST: Update Goals
router.post('/update', redirectLogin, [
    check('height').isFloat({ min: 1 }),
    check('target_weight').isFloat({ min: 1 }),
    check('start_weight').isFloat({ min: 1 })
], function (req, res, next) {
    let checkSql = "SELECT * FROM goals WHERE username = ?";
    db.query(checkSql, [req.session.userId], (err, result) => {
        if (err) return next(err);
        let sql, params;
        if (result.length === 0) {
            sql = "INSERT INTO goals (height_cm, target_weight, start_weight, username) VALUES (?, ?, ?, ?)";
            params = [req.body.height, req.body.target_weight, req.body.start_weight, req.session.userId];
        } else {
            sql = "UPDATE goals SET height_cm = ?, target_weight = ?, start_weight = ? WHERE username = ?";
            params = [req.body.height, req.body.target_weight, req.body.start_weight, req.session.userId];
        }
        db.query(sql, params, (err, result) => {
            if (err) return next(err);
            res.redirect(baseUrl + '/goals');
        });
    });
});

// POST: Log Weight
router.post('/log-weight', redirectLogin, [
    check('weight').isFloat({ min: 1 }),
    check('date').notEmpty()
], function (req, res, next) {
    let sql = "INSERT INTO weight_history (username, weight, date) VALUES (?, ?, ?)";
    let params = [req.session.userId, req.body.weight, req.body.date];
    db.query(sql, params, (err, result) => {
        if (err) return next(err);
        res.redirect(baseUrl + '/goals');
    });
});

// GET: Delete Weight Entry
router.get('/delete/:id', redirectLogin, function (req, res, next) {
    let sql = "DELETE FROM weight_history WHERE id = ? AND username = ?";
    db.query(sql, [req.params.id, req.session.userId], (err, result) => {
        if (err) return next(err);
        res.redirect(baseUrl + '/goals');
    });
});

module.exports = router;