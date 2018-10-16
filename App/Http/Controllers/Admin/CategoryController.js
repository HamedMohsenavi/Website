// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Category = require('App/Models/Category');

class CategoryController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Category = await Category.Paginate({ }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10, populate: 'Parent' });
            Response.render('Admin/Categories', { Title: 'Category Page', Categories: _Category });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async CreateIndex(Request, Response)
    {
        const _Category = await Category.find({ Parent: null });

        Response.render('Admin/Categories/Create', { Title: 'Create Category Page', Categories: _Category });
    }

    async CreateProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            let { Name, Parent } = Request.body;

            await new Category({ Name, Parent: Parent !== 'None' ? Parent : null }).save();

            return Response.redirect('/Admin/Categories');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async EditIndex(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Category = await Category.findById(Request.params.ID);
            const Categories = await Category.find({ Parent: null });

            if (!_Category)
                this.SetError('Category Not Found', 404);

            Response.render('Admin/Categories/Edit', { Title: 'Edit Category Page', Category: _Category, Categories });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async EditProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            let { Name, Parent } = Request.body;

            await Category.findByIdAndUpdate(Request.params.ID, { $set: { Name, Parent: Parent !== 'None' ? Parent : null } });

            return Response.redirect('/Admin/Categories');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Destroy(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Category = await Category.findById(Request.params.ID).populate('Children').exec();

            if (!_Category)
                this.SetError('Category Not Found', 404);

            // Delete Children
            _Category.Children.forEach(Child => Child.remove());

            // Delete Category
            _Category.remove();

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new CategoryController();
