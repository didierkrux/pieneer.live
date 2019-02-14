const fs = require('fs');
const path = require('path');
const StringManipulation = require('../tools/stringManipulation');


class ImageActions {

    readImage(userId, presentationId, md5Code, fileType) {
        const paddedUserId = StringManipulation.sixPad(userId);
        const paddedPresentationId = StringManipulation.sixPad(presentationId);

        const filePath = path.join(__dirname, '/imageLibrary', `/user-${paddedUserId}`, `/presentation-${paddedPresentationId}`, `/${paddedUserId}-${paddedPresentationId}-${md5Code}.${fileType}`);

        const image = new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, imageData) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(imageData);
                }
            });
        });
        return image;
    }
    writeImage(usId, presId, md5, fileType, buffer) {

        const userId = StringManipulation.sixPad(usId);
        const presentationId = StringManipulation.sixPad(presId);

        const writingPath = path.join(__dirname,
            '/imageLibrary',
            `/user-${userId}`,
            `/presentation-${presentationId}`,
            `/${userId}-${presentationId}-${md5}.${fileType}`)

        const file = new Promise((resolve, reject) => {
            console.log(writingPath);
            fs.writeFile(writingPath, buffer, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(writingPath);
                }
            })

        })

        return file;

    }
    removeImage(userId, presentationId, md5Code, fileType) {
        const paddedUserId = StringManipulation.sixPad(userId);
        const paddedPresentationId = StringManipulation.sixPad(presentationId);

        const filePath = path.join(__dirname, '/imageLibrary', `/user-${paddedUserId}`, `/presentation-${paddedPresentationId}`, `/${paddedUserId}-${paddedPresentationId}-${md5Code}.${fileType}`);

        const image = new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return image;
    }


}

module.exports = ImageActions;