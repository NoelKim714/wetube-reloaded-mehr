import { token } from "morgan";
import User from "../models/User"
import bcrypt from "bcrypt"

export const getJoin = (req, res) =>  res.render("join", {pageTitle: "Create Account"});
export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    if(password !== password2) {
        return res.status(400).render("join", {
            pageTitle:"Join",
            errorMessage: "Password confirmation does not match."
        });
    }
    const exists = await User.exists({$or:[{username:req.body.username},{email:req.body.username}]});
    if(exists) {
        return res.status(400).render("join", {pageTitle: "join", 
            pageTitle:"Join",
            errorMessage: "This username/email is already taken.",
        });
    }
    try {await User.create({
        name,
        username,
        email,
        password,
        password2,
        location,
    });
    return res.redirect("/login");
    } catch (error) {
        console.log(error)
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => 
    res.render("login", {pageTitle: "Login"});
export const postLogin = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username:username});
    //check if account exists
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: "Login", 
            errorMessage: "An account with this username does not exists.",
        });
    }
    //check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "Wrong Password!",
        });
    }
    //real Login
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize'
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
    
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    const tokenRequest = await (await fetch(finalUrl, {
        method:"POST",
            headers:{
                Accept: "application/json"
            },
        })
    ).json(); 
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();
        const email = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!email){
            return res.redirect("/login");
        }
    } else {
        return res.redirect("/login");
    }
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res. send("Log out");
export const see = (req, res) => res.send("See User");
