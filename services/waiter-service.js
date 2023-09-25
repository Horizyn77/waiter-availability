export default function WaiterService(db) {

    async function userCheck(username) {
        const userQuery = `SELECT username FROM waiters WHERE username = $1`;

        const checkUserExists = await db.oneOrNone(userQuery, [username])

        if (checkUserExists === null) {
            return false;
        } else if (checkUserExists.username === username) {
            return true;
        }
    }

    async function passwordHashCheck(username) {
        const passwordQuery = `SELECT password FROM waiters WHERE username = $1`;

        const checkPasswordHash = await db.oneOrNone(passwordQuery, [username])

        if (!await userCheck(username)) {
            return
        }

        return checkPasswordHash.password;
    }


    async function isAdmin(username) {

        if (!await userCheck(username)) {
            return
        }

        const adminQuery = `SELECT is_admin FROM waiters WHERE username = $1`;

        const checkIsAdmin = await db.one(adminQuery, [username])

        return checkIsAdmin.is_admin === true;
    }

    async function findUserId(username) {
        const findUserQuery = `SELECT id FROM waiters WHERE username = $1 AND is_admin = false`;

        const result = await db.one(findUserQuery, [username])

        return result.id;
    }

    async function findDayId(day) {
        const findDayQuery = `SELECT id FROM days WHERE day = $1;`

        const result = await db.one(findDayQuery, [day])

        return result.id;
    }

    async function checkExistingShiftDays(userId) {
        const checkQuery = `SELECT day FROM days JOIN shifts ON days.id = shifts.days_id WHERE shifts.waiters_id = $1;`

        const result = await db.manyOrNone(checkQuery, [userId])

        const mappedResult = result.map(item => item.day)

        return mappedResult;

    }

    async function addShiftDays(userId, dayId) {
        const addShiftQuery = `INSERT INTO shifts (waiters_id, days_id) VALUES ($1, $2);`

        await db.none(addShiftQuery, [userId, dayId])
    }

    async function removeShiftDays(userId, dayId) {
        const removeShiftQuery = `DELETE FROM shifts WHERE waiters_id = $1 AND days_id = $2;`

        await db.none(removeShiftQuery, [userId, dayId])
    }

    async function getWaitersAvailablePerDay(day) {
        const getWaitersQuery = `SELECT d.day, COUNT(w.id) AS waiter_count
        FROM days d
        LEFT JOIN shifts s ON d.id = s.days_id
        LEFT JOIN waiters w ON s.waiters_id = w.id
        WHERE d.day = $1
        GROUP BY d.day;`

        const result = await db.one(getWaitersQuery, [day])

        return result.waiter_count;
    }

    async function getListOfWaiters() {
        const getListQuery = `SELECT username FROM waiters WHERE is_admin = false;`

        const result = await db.manyOrNone(getListQuery);

        return result;
    }

    async function getWaitersAvailableByDaysData(day) {
        const getWaitersQuery = `SELECT w.username
        FROM waiters w
        JOIN shifts s ON w.id = s.waiters_id
        JOIN days d ON s.days_id = d.id
        WHERE d.day = $1;`

        const result = await db.manyOrNone(getWaitersQuery, [day])

        return result;
    }

    async function getDaysAvailableByWaiterData(waiter) {
        const getDaysQuery = `SELECT days.day
        FROM waiters
        JOIN shifts ON waiters.id = shifts.waiters_id
        JOIN days ON shifts.days_id = days.id
        WHERE waiters.username = $1;`

        const result = await db.manyOrNone(getDaysQuery, [waiter])

        return result;
    }

    async function deleteWeeklyData() {
        const deleteDataQuery = `DELETE FROM shifts;`

        await db.none(deleteDataQuery)
    }

    async function createUserAccount(username, password, isAdmin) {
        const createAccountQuery = `INSERT INTO waiters (username, password, is_admin) VALUES ($1, $2, $3);`

        await db.none(createAccountQuery, [username, password, isAdmin])
    }

    return {
        userCheck,
        passwordHashCheck,
        isAdmin,
        addShiftDays,
        checkExistingShiftDays,
        findUserId,
        findDayId,
        getWaitersAvailablePerDay,
        addShiftDays,
        removeShiftDays,
        getListOfWaiters,
        getWaitersAvailableByDaysData,
        getDaysAvailableByWaiterData,
        deleteWeeklyData,
        createUserAccount
    }
}