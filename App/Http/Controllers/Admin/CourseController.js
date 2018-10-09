// Node Native
const fs = require('fs');
const path = require('path');

// Node Modules
const sharp = require('sharp');

// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Models
const Course = require('App/Models/Course');

class CourseController extends Controller
{
    async Index(Request, Response, Next)
    {
        try
        {
            const _Course = await Course.Paginate({ }, { page: Request.query.Page || 1, sort: { createdAt: 1 }, limit: 10 });
            Response.render('Admin/Courses', { Title: 'Course Page', Courses: _Course });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    CreateIndex(Request, Response)
    {
        Response.render('Admin/Courses/Create', { Title: 'Create Course Page' });
    }

    async CreateProcess(Request, Response, Next)
    {
        try
        {
            let Result = await this.ValidateData(Request);

            if (!Result)
            {
                if (Request.file)
                    fs.unlinkSync(Request.file.path);

                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            let Image = this.ImageResize(Request.file);
            let { Title, Slug, Type, Description, Price, Tags } = Request.body;

            await new Course({ Account: Request.user._id, Title, Slug: this.Slug(Slug), Type, Image, Thumbnail: Image[480], Description, Price, Tags }).save();

            return Response.redirect('/Admin/Courses');
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

            const _Course = await Course.findById(Request.params.ID);

            if (!_Course)
                this.SetError('Course Not Found', 404);

            Response.render('Admin/Courses/Edit', { Title: 'Edit Course Page', Course: _Course });
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
                if (Request.file)
                    fs.unlinkSync(Request.file.path);

                Request.flash('GetFormData', Request.body);
                return Response.redirect('back');
            }

            let Update = { };

            Update.Thumbnail = Request.body.Thumbnail;

            if (Request.file)
            {
                Update.Image = this.ImageResize(Request.file);
                Update.Thumbnail = Update.Image[480];
            }

            console.log(Request.body);
            delete Request.body.Image;
            await Course.findByIdAndUpdate(Request.params.ID, { $set: { ...Request.body, ...Update } });

            return Response.redirect('/Admin/Courses');
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

            const _Course = await Course.findById(Request.params.ID);

            if (!_Course)
                this.SetError('Course Not Found', 404);

            // Delete Images
            Object.values(_Course.Image).forEach(Image =>
            {
                if (fs.existsSync(`./Public/${Image}`))
                    fs.unlinkSync(`./Public/${Image}`);
            });

            // Delete Course
            _Course.remove();

            return Response.redirect('/Admin/Courses');
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    ImageResize(Image)
    {
        const ImageInfo = path.parse(Image.path);

        let Address = { };

        Address['Original'] = (`${Image.destination}/${Image.filename}`).substring(8);

        [1080, 720, 480].map(Size =>
        {
            let ImageName = `${ImageInfo.name}-${Size}${ImageInfo.ext}`;
            let ImagePath = `${Image.destination}/${ImageName}`;

            Address[Size] = (ImagePath).substring(8);
            sharp(Image.path).resize(Size, null).toFile(ImagePath);
        });

        return Address;
    }
}

module.exports = new CourseController();
