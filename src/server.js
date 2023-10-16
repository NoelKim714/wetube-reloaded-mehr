import express from "express";
import morgan from "morgan";
import session from "express-session";
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
        secret: "Hello!",
        resave: true,
        saveUninitialized: true,
    })
);
//locals after session middleware
app.use(localsMiddleware);
/*coding before router*/
app.use("/users", rootRouter);
app.use("/videos", videoRouter);
app.use("/", globalRouter);



export default app;