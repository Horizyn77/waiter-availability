import assert from "assert";
import WaiterService from "../services/waiter-service.js";
import pgPromise from 'pg-promise';
import 'dotenv/config';

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

const waiterService = WaiterService(db);

describe("Testing Waiter Availability functionality", function() {
    it("should be able to create an account", async () => {

        await waiterService.createUserAccount("John", "john123", false)

        const result = await waiterService.getListOfWaiters()

        assert.equal("John", result[result.length -1].username)
    })

    it("")
})
