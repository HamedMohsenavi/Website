class ErrorHandler
{
    E404(Request, Response, Next)
    {
        try
        {
            Response.statusCode = 404;
            throw new Error('404 Page Not Found');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    Index(Error, Request, Response, Next)
    {
        const StatusCode = Error.statusCode || 500;
        const Message = Error.message || '';
        const Stack = Error.stack || '';

        if (process.env.DEBUG.toLowerCase() === 'true')
            return Response.render('Errors/Stack', { layout: 'Errors/Layout', Title: `Error ${StatusCode}`, Message, Stack });

        return Response.render(`Errors/${StatusCode}`, { layout: 'Errors/Layout', Title: `Error ${StatusCode}` });
    }

    CSURF(Error, Request, Response, Next)
    {
        if (Error.code !== 'EBADCSRFTOKEN')
            return Next(Error);

        // handle CSRF token errors here
        Response.status(403);
        Response.send('form tampered with');
    }
}

module.exports = new ErrorHandler();
