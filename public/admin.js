const submitSuccessMessage = document.querySelector("#submit-success-msg");

if (submitSuccessMessage.innerText !== "") {
    setTimeout(() => {
        submitSuccessMessage.classList.add("removeFadeOut")
        setTimeout(() => {
            submitSuccessMessage.innerText = ""
        }, 1000)
    }, 3000)
}

const viewShiftsBtn = document.querySelector("#view-shifts-btn")
const shiftsChart = document.querySelector("#shifts-chart")

viewShiftsBtn.addEventListener("click", () => {
    shiftsChart.slideToggle();
    shiftsChart.style.display = "block";

    if (viewShiftsBtn.innerText !== "Close") {
        viewShiftsBtn.innerText = "Close";
    } else {
        viewShiftsBtn.innerText = "View Shifts";
    }
})


const viewWaitersDataBtn = document.querySelector("#view-waiters-data-btn");
const viewDaysDataBtn = document.querySelector("#view-days-data-btn");
const daysDataBtnsContainer = document.querySelector(".days-data-btns")
const waiterDataBtns = document.querySelectorAll(".waiters-data-btns span");
const waitersTable = document.querySelector(".waiters-table-center table");
const waitersTableContainer = document.querySelector(".waiters-table-center");
const daysTableContainer = document.querySelector(".days-table-center");

const waiterData = document.querySelector(".waiters-data");
const daysData = document.querySelector(".days-data")

waiterData.style.display = "none";
daysData.style.display = "none";

async function getWaiterListData() {
    try {
        const response = await fetch("/api/waiters")
        const data = await response.json()

        return data;
    }

    catch (error) {
        console.log(error.message)
    }
}

async function showWaitersListBtns() {
    const waiterListData = await getWaiterListData();

    for (let i = 0; i < waiterListData.length; i++) {
        const span = document.createElement("span");
        span.innerText = waiterListData[i].username;

        if (i === 0) {
            span.classList.add("active-default-btn")
        }

        daysDataBtnsContainer.append(span);

    }
    const daysDataBtns = document.querySelectorAll(".days-data-btns span");
    daysDataBtns.forEach((btn => {
        btn.addEventListener("click", (e) => {
            daysDataBtns.forEach(daysBtn => {
                daysBtn.classList.remove("active-default-btn")
                daysBtn.classList.remove("active-btn")
            })
            btn.classList.add("active-btn")
            showDaysByWaiterHandleClick(e.target);
        })
    }))
}

showWaitersListBtns()

viewWaitersDataBtn.addEventListener("click", () => {
    waiterData.slideToggle();
    waiterData.style.display = "block";

    if (viewWaitersDataBtn.innerText !== "Close") {
        viewWaitersDataBtn.innerText = "Close";
    } else {
        viewWaitersDataBtn.innerText = "View Waiters Available By Day";
    }
})

viewDaysDataBtn.addEventListener("click", () => {
    daysData.slideToggle();
    daysData.style.display = "block";

    if (viewDaysDataBtn.innerText !== "Close") {
        viewDaysDataBtn.innerText = "Close";
    } else {
        viewDaysDataBtn.innerText = "View Days Available By Waiter";
    }
})

waiterDataBtns.forEach((btn => {
    btn.addEventListener("click", () => {
        waiterDataBtns.forEach(waiterBtn => {
            waiterBtn.classList.remove("active-btn")
            waiterBtn.classList.remove("active-default-btn")
        })
        btn.classList.add("active-btn")
    })
}))

async function getWaitersByDayData(day) {
    try {
        const response = await fetch(`/api/data/waiters?day=${day}`)
        const data = await response.json();
        return data;
    }

    catch (error) {
        console.log(error.message)
    }
}

async function showWaitersByDayData(day) {
    const waitersByDayData = await getWaitersByDayData(day);
    const table = document.createElement("table");

    for (const item of waitersByDayData) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.username}</td>`;
        table.append(tr);
    }
    waitersTableContainer.append(table);
}

async function showWaitersDataForFirstDay() {
    const waitersByDayData = await getWaitersByDayData("Monday");

    if (waitersByDayData.length > 0) {
        waitersTableContainer.innerHTML = "";
        showWaitersByDayData("Monday");
    } else if (waitersByDayData.length === 0) {
        const div = document.createElement("div");
        div.innerText = "There are no available waiters for the selected day";
        div.classList.add("data-error-msg");
        waitersTableContainer.innerHTML = "";
        waitersTableContainer.append(div);
    }
}

showWaitersDataForFirstDay()

async function showWaitersByDayHandleClick() {

    for (const item of waiterDataBtns) {
        item.addEventListener("click", async (e) => {
            const dayBtn = e.target.innerText;
            const waitersByDayData = await getWaitersByDayData(dayBtn);

            if (waitersByDayData.length > 0) {
                waitersTableContainer.innerHTML = "";
                showWaitersByDayData(dayBtn)
            } else if (waitersByDayData.length === 0) {
                const div = document.createElement("div");
                div.innerText = "There are no available waiters for the selected day";
                div.classList.add("data-error-msg");
                waitersTableContainer.innerHTML = "";
                waitersTableContainer.append(div);
            }
        })
    }
}


showWaitersByDayHandleClick()

async function getDaysByWaiterData(waiter) {
    try {
        const response = await fetch(`/api/data/days?waiter=${waiter}`)
        const data = await response.json();
        return data;
    }

    catch (error) {
        console.log(error.message)
    }
}

async function showDaysByWaiterData(waiter) {
    const daysByWaiterData = await getDaysByWaiterData(waiter);
    const table = document.createElement("table");

    for (const item of daysByWaiterData) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.day}</td>`;
        table.append(tr);
    }
    daysTableContainer.append(table);
}

async function getDaysDataForFirstWaiter() {
    const daysDataFirstUsername = await getWaiterListData();

    const firstWaiter = daysDataFirstUsername[0].username;
    const daysByWaiterData = await getDaysByWaiterData(firstWaiter);

    if (daysByWaiterData.length > 0) {
        daysTableContainer.innerHTML = "";
        showDaysByWaiterData(firstWaiter);
    } else if (daysByWaiterData.length === 0) {
        const div = document.createElement("div");
        div.innerText = "There are no days where the selected waiter is available";
        div.classList.add("data-error-msg");
        daysTableContainer.innerHTML = "";
        daysTableContainer.append(div);
    }
}

getDaysDataForFirstWaiter()

async function showDaysByWaiterHandleClick(clickedTarget) {

    const waiterBtn = clickedTarget.innerText;
    const daysByWaiterData = await getDaysByWaiterData(waiterBtn);

    if (daysByWaiterData.length > 0) {
        daysTableContainer.innerHTML = "";
        showDaysByWaiterData(waiterBtn);
    } else if (daysByWaiterData.length === 0) {
        const div = document.createElement("div");
        div.innerText = "There are no days where the selected waiter is available";
        div.classList.add("data-error-msg");
        daysTableContainer.innerHTML = "";
        daysTableContainer.append(div);
    }
}

