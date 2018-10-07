// Node Native
const fs = require('fs');

// Node Module
const multer = require('multer');
const mkdirp = require('mkdirp');

const GetDirectory = () =>
{
    let Year = new Date().getFullYear();
    let Month = new Date().getMonth() + 1;
    let Day = new Date().getDate();

    return `./Public/Images/Uploads/${Year}/${Month}/${Day}`;
};

const ImageStorage = multer.diskStorage(
{
    destination: (Request, File, Callback) =>
    {
        mkdirp(GetDirectory(), Error =>
        {
            if (Error)
                Logger.Analyze('FileError', Error);

            Callback(null, GetDirectory());
        });
    },
    filename: (Request, File, Callback) =>
    {
        if (!fs.existsSync(GetDirectory() + '/' + File.originalname))
            Callback(null, File.originalname);
        else
            Callback(null, Date.now() + '-' + File.originalname);
    }
});

const Image = multer(
{
    storage: ImageStorage
});

module.exports = Image;
