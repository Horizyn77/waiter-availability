import assert from "assert";
import WaiterService from "../services/waiter-service.js";
import pgPromise from 'pg-promise';
import 'dotenv/config';

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString)

const waiterService = WaiterService(db);

describe("Testing Waiter Availability functionality", function() {

    this.timeout(20000)
    
    beforeEach(async function () {
        //Clean all tables
        await db.none("DELETE FROM shifts")
    })

    it("should be able to create an account", async () => {

        await waiterService.createUserAccount("John", "john123", false)

        const result = await waiterService.getListOfWaiters()

        assert.equal("John", result[result.length -1].username)
    })

    it("should add shift for user 'Justin'", async () => {

        const userId = await waiterService.findUserId("Justin")

        //existing shift returns an empty array meaning no shift has been set
        const existingShift = await waiterService.checkExistingShiftDays(userId);

        assert.deepEqual([], existingShift)

        const dayId = await waiterService.findDayId("Thursday")

        //adding thursday as shift to Justin
        await waiterService.addShiftDays(userId, dayId)

        const existingShift2 = await waiterService.checkExistingShiftDays(userId)

        assert.deepEqual(["Thursday"], existingShift2)
    })

    it("should be able to update or delete days from shift for user 'Emma'", async () => {
        const userId = await waiterService.findUserId("Emma")

        //existing shift returns an empty array meaning no shift has been set
        const existingShift = await waiterService.checkExistingShiftDays(userId);

        assert.deepEqual([], existingShift)

        const dayId = await waiterService.findDayId("Wednesday")

        //adding wednesday as shift to Emma
        await waiterService.addShiftDays(userId, dayId)

        const existingShift2 = await waiterService.checkExistingShiftDays(userId)

        //existing shift added should include wednesday
        assert.deepEqual(["Wednesday"], existingShift2)

        //removing added shift wednesday for user
        await waiterService.removeShiftDays(userId, dayId)

        const existingShift3 = await waiterService.checkExistingShiftDays(userId)

        //existing shift should now equal an empty array since wednesday shift was removed
        assert.deepEqual([], existingShift3)
    })

    it("should check number of waiters available per day", async () => {
        const userId = await waiterService.findUserId("Justin")
        const userId2 = await waiterService.findUserId("Emma")
        const userId3 = await waiterService.findUserId("James")


        const dayId = await waiterService.findDayId("Friday")

        //adding shifts for 3 users for Friday
        await waiterService.addShiftDays(userId, dayId)
        await waiterService.addShiftDays(userId2, dayId)
        await waiterService.addShiftDays(userId3, dayId)

        const getNumWaitersPerDay = await waiterService.getWaitersAvailablePerDay("Friday")


        //should equal 3 waiters working on Friday
        assert.equal(3, getNumWaitersPerDay)
    })

    it("should get data for the list of waiters available for a particular day", async () => {
        const userId = await waiterService.findUserId("Justin")
        const userId2 = await waiterService.findUserId("Emma")
        const userId3 = await waiterService.findUserId("James")

        const dayId = await waiterService.findDayId("Monday")

        //adding shifts for 3 users for Monday
        await waiterService.addShiftDays(userId, dayId)
        await waiterService.addShiftDays(userId2, dayId)
        await waiterService.addShiftDays(userId3, dayId)

        //list of waiters available on Monday
        const data = await waiterService.getWaitersAvailableByDaysData("Monday")

        //testing all the waiters that added shifts for Monday
        const waitersAddedForMonday = [ { username: 'Justin' }, { username: 'Emma' }, { username: 'James' } ]

        assert.deepEqual(waitersAddedForMonday, data)
    })

    it("should get data for the list of days available for a particular waiter", async () => {
        const userId = await waiterService.findUserId("Justin")

        const dayId = await waiterService.findDayId("Monday")
        const dayId2 = await waiterService.findDayId("Wednesday")
        const dayId3 = await waiterService.findDayId("Friday")

        //adding shifts for 3 days for Justin
        await waiterService.addShiftDays(userId, dayId)
        await waiterService.addShiftDays(userId, dayId2)
        await waiterService.addShiftDays(userId, dayId3)

        //list of days available for Justin
        const data = await waiterService.getDaysAvailableByWaiterData("Justin")

        //testing all the days that added as shifts for Justin
        const daysAddedForJustin = [ { day: 'Monday' }, { day: 'Wednesday' }, { day: 'Friday' } ]

        assert.deepEqual(daysAddedForJustin, data)
    })

    it("should be able to delete weekly shift data", async () => {
        const userId = await waiterService.findUserId("Justin")
        const userId2 = await waiterService.findUserId("Emma")
        const userId3 = await waiterService.findUserId("James")

        const dayId = await waiterService.findDayId("Monday")
        const dayId2 = await waiterService.findDayId("Wednesday")
        const dayId3 = await waiterService.findDayId("Friday")

        //adding shifts for 3 users for different days
        await waiterService.addShiftDays(userId, dayId)
        await waiterService.addShiftDays(userId2, dayId2)
        await waiterService.addShiftDays(userId3, dayId3)

        
        const existingShift = await waiterService.checkExistingShiftDays(userId)
        const existingShift2 = await waiterService.checkExistingShiftDays(userId2)
        const existingShift3 = await waiterService.checkExistingShiftDays(userId3)

        //checking that the shifts have been set for users

        assert.deepEqual(["Monday"], existingShift)
        assert.deepEqual(["Wednesday"], existingShift2)
        assert.deepEqual(["Friday"], existingShift3)

        //reseting weekly data
        await waiterService.deleteWeeklyData();

        const existingShiftt = await waiterService.checkExistingShiftDays(userId)
        const existingShift22 = await waiterService.checkExistingShiftDays(userId2)
        const existingShift33 = await waiterService.checkExistingShiftDays(userId3)

        //checking that data has been reset for the week
        assert.deepEqual([], existingShiftt)
        assert.deepEqual([], existingShift22)
        assert.deepEqual([], existingShift33)
    })
})
