export const localsMiddleware = (req, res, next) => {
    console.log(req.sessions);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "WETUBEMEHR";
    res.locals.loggedInUser = req.session.user;
    console.log(res.locals);
    next();
};