class SecPackDataEngine {

    constructor() {

        this.products = [];
        this.suppliers = [];
        this.supplierProducts = [];
        this.documents = [];
        this.quotes = [];
        this.inventory = [];
        this.contacts = [];
        this.priceHistory = [];
        this.tasks = [];
        this.purchaseOrders = [];
        this.samples = [];
        this.categories = [];
        this.applications = [];

    }

    async load(file) {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        return await response.json();

    }

    async initialize() {

        [
            this.products,
            this.suppliers,
            this.supplierProducts,
            this.documents,
            this.quotes,
            this.inventory,
            this.contacts,
            this.priceHistory,
            this.tasks,
            this.purchaseOrders,
            this.samples,
            this.categories,
            this.applications

        ] = await Promise.all([

            this.load("data/products.json"),
            this.load("data/suppliers.json"),
            this.load("data/supplier-products.json"),
            this.load("data/documents.json"),
            this.load("data/quotes.json"),
            this.load("data/inventory.json"),
            this.load("data/contacts.json"),
            this.load("data/price-history.json"),
            this.load("data/tasks.json"),
            this.load("data/purchase-orders.json"),
            this.load("data/samples.json"),
            this.load("data/categories.json"),
            this.load("data/applications.json")

        ]);

        console.log("SecPack Data Engine Ready");

    }

    getProduct(id) {
        return this.products.find(product => product.id === id);
    }

    getSupplier(id) {
        return this.suppliers.find(supplier => supplier.id === id);
    }

    getSupplierProducts(productId) {
        return this.supplierProducts.filter(item => item.productId === productId);
    }

    getQuotes(productId) {
        return this.quotes.filter(item => item.productId === productId);
    }

    getDocuments(productId) {
        return this.documents.filter(item => item.productId === productId);
    }

}

window.SecPack = new SecPackDataEngine();

document.addEventListener("DOMContentLoaded", async () => {

    await window.SecPack.initialize();

    console.log("SecPack Core Loaded");

});
