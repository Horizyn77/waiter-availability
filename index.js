import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import flash from "express-flash";
import 'dotenv/config';
import pgPromise from 'pg-promise';

import WaiterService  from "./services/waiter-service.js";
import WaiterRoutes from "./routes/waiter-routes.js"

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

app.get("/", waiterRoutes.showHome)

app.post("/login", waiterRoutes.loginUser)

app.get("/waiter/:username", waiterRoutes.waiterPage)

app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));