import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import flash from "express-flash";
import 'dotenv/config';
import pgPromise from 'pg-promise';

import WaiterService from "./services/waiter-service.js";
import WaiterRoutes from "./routes/waiter-routes.js"
import APIRoutes from "./api/api-routes.js"

const app = express();
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString)

const PORT = process.env.PORT || 3000;

app.engine("handlebars", engine({
    layoutsDir: "./views/layouts"
}));

app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))

app.use(flash());

const waiterService = WaiterService(db);
const waiterRoutes = WaiterRoutes(waiterService);
const apiRoutes = APIRoutes(waiterService);

app.get("/", waiterRoutes.showHome)

app.post("/login", waiterRoutes.loginUser)

app.get("/waiter/:username", waiterRoutes.showWaiterPage)

app.post("/waiter/:username", waiterRoutes.submitWaiterPage)

app.get("/days", waiterRoutes.adminPage)

app.get("/api/waiters", apiRoutes.getWaitersList)

app.get("/api/data/waiters", apiRoutes.getWaitersByDay)

app.get("/api/data/days", apiRoutes.getDaysByWaiter)

app.post("/reset", waiterRoutes.resetData)

app.post("/logout", waiterRoutes.logoutUser)

app.get("/register", waiterRoutes.signUpPage)

app.post("/register", waiterRoutes.signUpUser)

app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));