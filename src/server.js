
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import rootRouter from "./routers/rootRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}))
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        //cookie:{
        //    maxAge: 20000,
        //},
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);
//locals after session middleware
app.use(localsMiddleware);
/*coding before router*/
app.use("/users", rootRouter);
app.use("/videos", videoRouter);
app.use("/", globalRouter);



export default app;