const fs = require('fs');
const path = require('path');
const StringManipulation = require('../tools/stringManipulation');



class FolderActions {
    constructor() {}

    mkUserDir(req, res) {
        const userId = req.params.userid;
        const filePath = path.join(__dirname, '/imageLibrary', `/user-${stringManipulation.sixPad(userId)}`);
        fs.mkdir(filePath, err => {
            if (err) {
                console.log(err);
                res.status(400).send("This users existed")
            } else {
                res.status(200).end()
            }
        });
    }

    readUserDir(req, res) {
        const userId = req.params.userid;
        const filePath = path.join(__dirname, '/imageLibrary', `/user-${stringManipulation.sixPad(userId)}`);
        fs.readdir(filePath, 'utf8', (err, nameArray) => {
            if (err) {
                res.status(400).send("This user does not exist");
            } else {
                res.status(200).json(nameArray);
            }
        })
    }

    removeUserDir(req, res) {
        const userId = req.params.userid;
        const filePath = path.join(__dirname, '/imageLibrary',
            `/user-${stringManipulation.sixPad(userId)}`);

        fs.rmdir(filePath, err => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).json("We are sorry to see you go, bye m8.");
            }
        })
    }

    mkPresentationDir(req, res) {
        const userId = req.params.userid;
        const presentationId = req.params.presentationid;
        const filePath = path.join(__dirname, '/imageLibrary',
            `/user-${stringManipulation.sixPad(userId)}`,
            `presentation-${stringManipulation.sixPad(presentationId)}`);

        fs.mkdir(filePath, (err) => {
            if (err) {
                res.status(400).send("Can't make this presentation");
            } else {
                res.status(200).json("New presentation is being made.");
            }
        })
    }
    readPresentationDir(req, res) {
        const userId = req.params.userid;
        const presentationId = req.params.presentationid;
        const filePath = path.join(__dirname, '/imageLibrary',
            `/user-${stringManipulation.sixPad(userId)}`,
            `presentation-${stringManipulation.sixPad(presentationId)}`)

        fs.readdir(filePath, (err, nameString) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(nameString);
            }
        });
    }

    // Remove presentationdir when the presentation is removed entirly
    removePresentationDir(req, res) {
        const userId = req.params.userid;
        const presentationId = req.params.presentationid;
        const filePath = path.join(__dirname, '/imageLibrary',
            `/user-${stringManipulation.sixPad(userId)}`,
            `presentation-${stringManipulation.sixPad(presentationId)}`)
        fs.rmdir(filePath, (err) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).json("Presentation is now gone.");
            }
        });
    }

}

module.exports = FolderActions;