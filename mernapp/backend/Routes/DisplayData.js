const express = require("express");
const router = express.Router();

router.get('/foodData', (req, res) => {
    try {
        res.send([global.items, global.category]);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;