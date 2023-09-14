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

    async function passwordCheck(username, password) {
        const passwordQuery = `SELECT password FROM waiters WHERE username = $1`;

        const checkPasswordCorrect = await db.oneOrNone(passwordQuery, [username])

        if (checkPasswordCorrect === null) {
            return false;
        } else if (checkPasswordCorrect.password !== password) {
            return false;
        } else if (checkPasswordCorrect.password === password) {
            return true;
        }
    }


    async function isAdmin(username) {
        const adminQuery = `SELECT is_admin FROM waiters WHERE username = $1`;

        const checkIsAdmin = await db.manyOrNone(adminQuery, [username])

        return checkIsAdmin.is_admin === true;
    }

    return {
        userCheck,
        passwordCheck,
        isAdmin
    }
}