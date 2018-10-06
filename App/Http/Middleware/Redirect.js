class Redirect
{
    IsAuthenticated(Request, Response, Next)
    {
        if (Request.isAuthenticated())
            return Response.redirect('/');

        Next();
    }

    IsAdmin(Request, Response, Next)
    {
        if (Request.isAuthenticated() && Request.user.Admin)
            return Next();

        Response.redirect('/');
    }
}

module.exports = new Redirect();
