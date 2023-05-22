const express = require("express");
const { fetchAllData, fetchMatchingDataByField, fetchDataById } = require("../services/database");
const constants = require("../utils/constants");
const router = express.Router();

router.get("/", async (req, res) => {
    let docs = await fetchAllData(constants.CAMPUS_TABLE);
    res.status(200).json(docs);
});

router.get("/:id/room", async (req, res) => {
    let id = req.params['id'];
    let docs = await fetchMatchingDataByField(constants.ROOMS_TABLE, 'campusId', id)
    if (docs === -1) {
        res.status(300).json({
            msg: "This campus has no room"
        })
    } else {
        res.status(200).json(docs);
    }
});

router.get("/room", async (req, res) => {
    let id = req.query.id;
    console.log(id);
    if (id) {
        let doc = await fetchDataById(constants.ROOMS_TABLE, id);
        if (doc !== -1) {
            res.status(200).json(doc);
        } else {
            res.status(300).json({
                msg: "No matching room with ID"
            })
        }

    } else {
        res.status(300).json({
            msg: "No ID was input"
        })
    }

})

router.post("/", async (req, res) => { });

router.delete("/", async (req, res) => { });

router.put("/", async (req, res) => { });

module.exports = router;
