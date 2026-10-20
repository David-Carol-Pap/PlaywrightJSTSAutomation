class OrdersPage {
    constructor(page) {
        this.page = page;
        this.ordersButton = page.locator("button[routerlink*='myorders']");
        this.ordersTable = page.locator("tbody");
        this.rows = page.locator("tbody tr");
        this.orderIdDetails = page.locator(".col-text");
    }

    async openOrders() {
        await this.ordersButton.click();
        await this.ordersTable.waitFor();
    }

    async openOrderDetails(orderId) {
        const rowsCount = await this.rows.count();

        for (let i = 0; i < rowsCount; i++) {
            const row = this.rows.nth(i);
            const rowOrderId = await row.locator("th").textContent();

            if (orderId.includes(rowOrderId)) {
                await row.locator("button").first().click();
                return;
            }
        }

        throw new Error(`Comanda ${orderId} nu a fost găsită în istoric.`);
    }

    async getOrderIdDetails() {
        return this.orderIdDetails.textContent();
    }
}

module.exports = { OrdersPage };