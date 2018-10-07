class Convert
{
    FileToField(Request, Response, Next)
    {
        if (!Request.file)
            Request.body.Image = undefined;

        Request.body.Image = Request.file.filename;

        Next();
    }
}

module.exports = new Convert();
