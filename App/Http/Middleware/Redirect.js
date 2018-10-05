class Redirect
{
    IsAuthenticated(Request, Response, Next)
    {
        if (Request.isAuthenticated())
            return Response.redirect('/');

        Next();
    }
}

module.exports = new Redirect();
