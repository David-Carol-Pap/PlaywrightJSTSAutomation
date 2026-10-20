class CartPage {
    constructor(page) {
        this.page = page;
        this.cartFirstItem = page.locator("div li").first();
        this.productInCart = (productName) => this.page.locator("h3").filter({ hasText: productName });
        this.checkoutButton = page.locator("text=Checkout");
        this.countryInput = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.userEmail = page.locator(".user__name [type='text']").first();
        this.submitButton = page.locator(".action__submit");
        this.orderConfirmation = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async waitForCart() {
        await this.cartFirstItem.waitFor();
    }

    async isProductVisible(productName) {
       return this.productInCart(productName).isVisible();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async selectCountryIndia() {
        await this.countryInput.pressSequentially("ind", { delay: 100 });
        await this.dropdown.waitFor();

        const optionsCount = await this.dropdown.locator("button").count();

        for (let i = 0; i < optionsCount; i++) {
            const text = await this.dropdown.locator("button").nth(i).textContent();

            if (text === " India") {
                await this.dropdown.locator("button").nth(i).click();
                return;
            }
        }

        throw new Error("India nu a fost găsită în lista de țări.");
    }

    async getUserEmail() {
        return (await this.userEmail.textContent())?.trim();
    }

    async submitOrder() {
        await this.submitButton.click();
    }

    async getOrderConfirmation() {
        await this.orderConfirmation.waitFor();
        return this.orderConfirmation.textContent();
    }

    async getOrderId() {
        return this.orderId.textContent();
    }
}

module.exports = { CartPage };