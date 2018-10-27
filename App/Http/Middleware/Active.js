class Active
{
    Account(Request, Response, Next)
    {
        if (Request.isAuthenticated())
        {
            if (Request.user.Active)
                return Next();

            Request.flash('Error', 'Active -_-');
            Request.logout();
            Response.clearCookie('Remember');
            return Response.redirect('/');
        }
        else
            Next();
    }
}

module.exports = new Active();
