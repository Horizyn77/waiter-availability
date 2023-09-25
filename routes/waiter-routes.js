import { ChartJSNodeCanvas } from "chartjs-node-canvas";
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 600, height: 300 });
import bcrypt from "bcrypt";

export default function WaiterRoutes(waiterService) {
    function showHome(req, res) {
        res.render("index")
    }

    async function loginUser(req, res) {

        const { username, password } = req.body;

        if (!username && !password) {
            req.flash("user", "Please enter a username and a password")
            res.render("index", { messages: req.flash() })
        } else if (!username) {
            req.flash("user", "Please enter a username")
            res.render("index", { messages: req.flash() })
        } else if (!password) {
            req.flash("password", "Please enter a password")
            res.render("index", { messages: req.flash() })
        } else {

            const userCheckResult = await waiterService.userCheck(username);
            const passwordHash = await waiterService.passwordHashCheck(username);

            let passwordHashCheckResult;

            if (userCheckResult) {
                passwordHashCheckResult = await bcrypt.compare(password, passwordHash)
            }
            const adminCheckResult = await waiterService.isAdmin(username);

            if (!userCheckResult) {
                req.flash("user", "User does not exist")
                res.render("index", { messages: req.flash() })
            } else if (userCheckResult && !passwordHashCheckResult) {
                req.flash("password", "Password is incorrect")
                res.render("index", { messages: req.flash() })
            } else if (userCheckResult && passwordHashCheckResult && !adminCheckResult) {
                res.redirect(`/waiter/${username}`)
            } else if (userCheckResult && passwordHashCheckResult && adminCheckResult) {
                res.redirect("/days")
            }
        }
    }

    async function showWaiterPage(req, res) {
        const username = req.params.username;

        const userId = await waiterService.findUserId(username);

        const shiftDays = await waiterService.checkExistingShiftDays(userId)

        const checkedDays = {
            mondayCheck: false,
            tuesdayCheck: false,
            wednesdayCheck: false,
            thursdayCheck: false,
            fridayCheck: false
        }

        if (shiftDays.includes("Monday")) {
            checkedDays.mondayCheck = true;
        }
        if (shiftDays.includes("Tuesday")) {
            checkedDays.tuesdayCheck = true;
        }
        if (shiftDays.includes("Wednesday")) {
            checkedDays.wednesdayCheck = true;
        }
        if (shiftDays.includes("Thursday")) {
            checkedDays.thursdayCheck = true;
        }
        if (shiftDays.includes("Friday")) {
            checkedDays.fridayCheck = true;
        }

        res.render("waiter", { username, shiftDays, checkedDays })
    }

    async function submitWaiterPage(req, res) {

        const checkboxSelections = req.body;

        const daysSelected = Object.keys(checkboxSelections)

        const username = req.params.username;

        const userId = await waiterService.findUserId(username);

        const existingShifts = await waiterService.checkExistingShiftDays(userId)

        for (const day of daysSelected) {
            if (!existingShifts.includes(day)) {
                const dayId = await waiterService.findDayId(day)
                await waiterService.addShiftDays(userId, dayId)
            }
        }

        for (const day of existingShifts) {
            if (!daysSelected.includes(day)) {
                const dayId = await waiterService.findDayId(day)
                await waiterService.removeShiftDays(userId, dayId)
            }
        }

        const shiftDays = await waiterService.checkExistingShiftDays(userId)

        const checkedDays = {
            mondayCheck: false,
            tuesdayCheck: false,
            wednesdayCheck: false,
            thursdayCheck: false,
            fridayCheck: false
        }

        if (shiftDays.includes("Monday")) {
            checkedDays.mondayCheck = true;
        }
        if (shiftDays.includes("Tuesday")) {
            checkedDays.tuesdayCheck = true;
        }
        if (shiftDays.includes("Wednesday")) {
            checkedDays.wednesdayCheck = true;
        }
        if (shiftDays.includes("Thursday")) {
            checkedDays.thursdayCheck = true;
        }
        if (shiftDays.includes("Friday")) {
            checkedDays.fridayCheck = true;
        }

        req.flash("success", "<img src='/images/success-mark-icon.png'>Your weekly shifts has been successfully submitted")

        res.render("waiter", { username, shiftDays, checkedDays, messages: req.flash() })

    }

    async function adminPage(req, res) {

        const waiterWeeklyData = [
            await waiterService.getWaitersAvailablePerDay("Monday"),
            await waiterService.getWaitersAvailablePerDay("Tuesday"),
            await waiterService.getWaitersAvailablePerDay("Wednesday"),
            await waiterService.getWaitersAvailablePerDay("Thursday"),
            await waiterService.getWaitersAvailablePerDay("Friday")
        ]

        const barColors = waiterWeeklyData.map(item => {
            if (item == 3) {
                return "#069C56";
            } else if (item < 3) {
                return "#CC5050"
            } else if (item > 3) {
                return "#FFB443"
            }
        })

        const configuration = {
            type: "bar",
            data: {
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                datasets: [{
                    label: "Waiters Available",
                    backgroundColor: barColors,
                    data: waiterWeeklyData,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        max: 7
                    }
                }
            }
        }


        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);

        res.render("days", { dataUrl })
    }

    async function resetData(req, res) {
        await waiterService.deleteWeeklyData();

        req.flash("success", "<img src='/images/success-mark-icon.png'>Weekly shifts data has been successfully reset")

        const waiterWeeklyData = [
            await waiterService.getWaitersAvailablePerDay("Monday"),
            await waiterService.getWaitersAvailablePerDay("Tuesday"),
            await waiterService.getWaitersAvailablePerDay("Wednesday"),
            await waiterService.getWaitersAvailablePerDay("Thursday"),
            await waiterService.getWaitersAvailablePerDay("Friday")
        ]

        const barColors = waiterWeeklyData.map(item => {
            if (item == 3) {
                return "#069C56";
            } else if (item < 3) {
                return "#CC5050"
            } else if (item > 3) {
                return "#FFB443"
            }
        })

        const configuration = {
            type: "bar",
            data: {
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                datasets: [{
                    label: "Waiters Available",
                    backgroundColor: barColors,
                    data: waiterWeeklyData,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        max: 7
                    }
                }
            }
        }


        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);


        res.render("days", { dataUrl, messages: req.flash() })
    }

    async function logoutUser(req, res) {
        res.redirect("/")
    }

    async function signUpUser(req, res) {
        const { username, password, adminCheck } = req.body;

        let isAdmin;

        if (adminCheck === "on") {
            isAdmin = true;
        } else if (adminCheck === undefined) {
            isAdmin = false;
        }

        if (!username && !password) {
            req.flash("user", "Please enter a username and a password")
            res.render("register", { messages: req.flash() })
        } else if (!username) {
            req.flash("user", "Please enter a username")
            res.render("register", { messages: req.flash() })
        } else if (!password) {
            req.flash("password", "Please enter a password")
            res.render("register", { messages: req.flash() })
        } else {

            const userCheckResult = await waiterService.userCheck(username);

            if (userCheckResult) {
                req.flash("user", "User already exists")
                res.render("register", { messages: req.flash() })
            } else {

                const hashedPassword = await bcrypt.hash(password, 10)

                await waiterService.createUserAccount(username, hashedPassword, isAdmin);

                if (isAdmin) {
                    res.redirect("/days")
                } else if (!isAdmin) {
                    res.redirect(`/waiter/${username}`);
                }
            }
        }
    }

    function signUpPage(req, res) {
        res.render("register")
    }

    return {
        showHome,
        loginUser,
        showWaiterPage,
        submitWaiterPage,
        adminPage,
        resetData,
        logoutUser,
        signUpUser,
        signUpPage
    }
}