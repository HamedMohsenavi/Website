// Node Modules
const request = require('request-promise');

// Controllers
const Controller = require('App/Http/Controllers/Controller');

// Model
const Payment = require('App/Models/Payment');

class AccountController extends Controller
{
    Index(Request, Response, Next)
    {
        try
        {
            Response.render('Home/Account', { Title: 'Account Page' });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async History(Request, Response, Next)
    {
        try
        {
            const _Payment = await Payment.Paginate({ Account: Request.user._id }, { page: Request.query.Page || 1, sort: { createdAt: -1 }, limit: 10, populate: 'Course' });

            Response.render('Home/Account/History', { Title: 'History Page', Payments: _Payment });
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async VipIndex(Request, Response)
    {
        Response.render('Home/Account/Vip', { Title: 'V.I.P Page' });
    }

    async Payment(Request, Response, Next)
    {
        try
        {
            let Plan = Request.body.Plan;
            let Price = 0;

            switch (Plan)
            {
                case '3':
                    Price = 30000;
                    break;

                case '12':
                    Price = 120000;
                    break;

                default:
                    Price = 15000;
                    break;
            }

            // Zarinpal
            let Parameters =
            {
                MerchantID: process.env.ZARINPAL_MERCHANT_ID,
                Amount: Price,
                CallbackURL: `${process.env.ZARINPAL_REDIRECT_URI}/Account/Vip/Payment/Check`,
                Description: 'Buy V.I.P',
                Email: Request.user.Email
            };

            // Request promise
            let Options =
            {
                method: 'POST',
                uri: 'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
                headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
                body: Parameters,
                json: true
            };

            request(Options).then(async Data =>
            {
                await new Payment({ Account: Request.user._id, Vip: true, Authority: Data.Authority, Price: Price }).save();
                Response.redirect(`https://www.zarinpal.com/pg/StartPay/${Data.Authority}`);
            }).catch(Error => Next(Error));
        }
        catch (Error)
        {
            Next(Error);
        }
    }

    async Check(Request, Response, Next)
    {
        try
        {
            if (Request.query.Status && Request.query.Status !== 'OK')
                return Response.json('Payment False');

            const _Payment = await Payment.findOne({ Authority: Request.query.Authority });

            if (!_Payment.Vip)
                return Response.json('Payment False');

            // Zarinpal
            let Parameters =
            {
                MerchantID: process.env.ZARINPAL_MERCHANT_ID,
                Amount: _Payment.Price,
                Authority: Request.query.Authority
            };

            // Request promise
            let Options =
            {
                method: 'POST',
                uri: 'https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json',
                headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
                body: Parameters,
                json: true
            };

            request(Options).then(async Data =>
            {
                if (Data.Status === 100)
                {
                    _Payment.set({ Payment: true });

                    let Time = 0;
                    let Type = '';

                    switch (Payment.Price)
                    {
                        case 15000:
                            Time = 1;
                            Type = 'Month';
                            break;

                        case 30000:
                            Time = 3;
                            Type = '3 Month';
                            break;

                        case 120000:
                            Time = 12;
                            Type = '12 Month';
                            break;
                    }

                    if (Time === 0)
                    {
                        Response.json('Payment False');
                        return Response.redirect('/Account/Vip');
                    }

                    let VipTime = Request.user.IsVip() ? new Date(Request.user.VipTime) : new Date();

                    VipTime.setMonth(VipTime.getMonth() + Time);

                    await Request.user.set({ VipTime, VipType: Type }).save();
                    await _Payment.save();

                    Response.redirect('/Account/Vip');
                }
                else
                    Response.json('Payment False');
            }).catch(Error => Next(Error));
        }
        catch (Error)
        {
            Next(Error);
        }
    }
}

module.exports = new AccountController();
