function Paginate(Query, Options, CallBack)
{
    Query = Query || { };
    Options = Object.assign({ }, this.Options, Options);

    let Limit = Options.limit || 10;
    let Page, Offset, Skip;

    if (Limit <= 0)
        Limit = 10;

    if (Options.offset)
    {
        Offset = Options.offset;
        Skip = Offset;
    }
    else if (Options.page)
    {
        Page = Options.page;
        Skip = (Page - 1) * Limit;
    }
    else
    {
        Page = 1;
        Offset = 0;
        Skip = Offset;
    }

    let DocQuery = this.find(Query).select(Options.select).sort(Options.sort).skip(Skip).limit(Limit);

    if (Options.populate)
        [].concat(Options.populate).forEach(item => DocQuery.populate(item));

    return Promise.all([DocQuery.exec(), this.countDocuments(Query).exec()]).then(Data =>
    {
        let Result = { Docs: Data[0], Total: Data[1], Limit };

        if (Offset !== undefined)
            Result.Offset = Offset;

        if (Page !== undefined)
        {
            Result.Page = Page;
            Result.Pages = Math.ceil(Data[1] / Limit) || 1;
        }

        if (typeof CallBack === 'function')
            return CallBack(null, Result);

        return Result;
    });
};

module.exports = Schema =>
{
    Schema.statics.Paginate = Paginate;
};

module.exports.Paginate = Paginate;
