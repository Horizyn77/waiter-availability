export default function APIRoutes(waiterService) {
    async function getWaitersList(req, res) {
        const waiterListData = await waiterService.getListOfWaiters();
        
        res.json(waiterListData);
    }

    async function getWaitersByDay(req, res) {
        const day = req.query.day;

        const waitersByDayData = await waiterService.getWaitersAvailableByDaysData(day)

        res.json(waitersByDayData)
    }

    async function getDaysByWaiter(req, res) {
        const waiter = req.query.waiter;

        const daysByWaiterData = await waiterService.getDaysAvailableByWaiterData(waiter)

        res.json(daysByWaiterData)
    }

    return {
        getWaitersList,
        getWaitersByDay,
        getDaysByWaiter
    }
}