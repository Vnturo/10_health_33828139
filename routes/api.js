const express = require("express");
const router = express.Router();

router.get('/workouts', function(req, res, next) {
    
    if (!req.session.userId) {
        return res.status(403).json({ 
            status: "error", 
            message: "Access denied. Please log in first." 
        });
    }


    let sql = "SELECT name, duration, calories, date FROM workouts WHERE username = ? ORDER BY date DESC";

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            res.status(500).json({ status: "error", message: "Database error" });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;