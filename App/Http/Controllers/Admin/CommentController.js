// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Comment = require('App/Models/Comment');

class CommentController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Comment = await Comment.Paginate({ Approved: true }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10, populate: [{ path: 'Account', select: 'Name' }, { path: 'Course' }, { path: 'Episode', populate: [{ path: 'Course', select: 'Slug' }] }] });
            Response.render('Admin/Comments', { Title: 'Comment Page', Comments: _Comment });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async ApprovedIndex(Request, Response, Next)
    {
        try
        {
            const _Comment = await Comment.Paginate({ Approved: false }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10, populate: [{ path: 'Account', select: 'Name' }, { path: 'Course' }, { path: 'Episode', populate: [{ path: 'Course', select: 'Slug' }] }] });
            Response.render('Admin/Comments/Approved', { Title: 'Approved Page', Comments: _Comment });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async ApprovedProcess(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            let _Comment = await Comment.findById(Request.params.ID);

            if (!_Comment)
                this.SetError('Comment Not Found', 404);

            _Comment.Approved = true;

            await _Comment.save();

            return Response.redirect('back');
        }
        catch (error)
        {
            Next(error);
        }
    }

    async Destroy(Request, Response, Next)
    {
        try
        {
            this.ValidateMongoID(Request.params.ID);

            const _Comment = await Comment.findById(Request.params.ID).populate('Children').exec();

            if (!_Comment)
                this.SetError('Comment Not Found', 404);

            // Delete Children
            _Comment.Children.forEach(Child => Child.remove());

            // Delete _Comment
            _Comment.remove();

            return Response.redirect('back');
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new CommentController();
