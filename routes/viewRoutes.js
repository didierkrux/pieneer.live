const passport = require('passport');

class ViewRouter {
    constructor() { }

    router(express) {
        // module.exports = (express) => {
        const router = require("express").Router();
        // const router = express.Router();

        function isLoggedIn(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect('/');
        }

        //passport-local

        router.post('/login', passport.authenticate('local-login', {
            successRedirect: '/dashboard/',
            failureRedirect: '/error'
        }));


        router.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard/',
            failureRedirect: '/error'
        }));

        router.get('/test', (req, res) => {
            if (req.param("force") == "mobile" || req.device.type != "desktop") {
                res.redirect('html_mock-up/testGroundMobile/');
            } else {
                res.redirect('html_mock-up/testGround/');
            };
        });

        //passport-facebook
        router.get('/auth/facebook',
            passport.authenticate('facebook'));

        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', { failureRedirect: '/login' }),
            (req, res) => {
                res.redirect('/dashboard/');
            });

        //passport-google
        router.get('/auth/google',
            passport.authenticate('google', {
                scope: ['profile']
            }));

        router.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/login' }),
            (req, res) => {
                res.redirect('/dashboard/');
            });

        // passport-linkedin
        router.get('/auth/linkedin',
            passport.authenticate('linkedin', {
                scope: ['r_basicprofile', 'r_emailaddress']
            }));

        router.get('/auth/linkedin/callback',
            passport.authenticate('linkedin', { failureRedirect: '/login' }),
            (req, res) => {
                res.redirect('/dashboard/');
            });

        //logout
        router.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });

        router.get('/uid', (req, res) => {
            console.log(req.user.id);
            res.send('' + req.user.id);
        });

        // router.get("/dashboard/", (req, res) => {  // TODO: user logged in
        //     console.log(req.user.id);
        //     res.sendFile('../views/dashboard.html');
        // });

        return router;
    }

}

module.exports = ViewRouter;