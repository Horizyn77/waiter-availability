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
            const passwordCorrectResult = await waiterService.passwordCheck(username, password)

            if (!userCheckResult) {
                req.flash("user", "User does not exist")
                res.render("index", { messages: req.flash() })
            } else if (userCheckResult && !passwordCorrectResult) {
                req.flash("password", "Password is incorrect")
                res.render("index", { messages: req.flash() })
            } else if (userCheckResult && passwordCorrectResult) {
                res.redirect(`/waiter/${username}`)
            }

        }

    }

    async function waiterPage(req, res) {
        res.render("waiter")
    }

    return {
        showHome,
        loginUser,
        waiterPage
    }
}