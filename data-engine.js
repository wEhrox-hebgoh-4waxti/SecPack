class SecPackDataEngine {

    constructor() {

        /*
         * ==========================================
         * SECPACK DATA ARCHITECTURE
         * ==========================================
         *
         * Central data layer for the SecPack platform.
         *
         * Public website:
         * - Products
         * - Applications
         * - Categories
         * - Public technical information
         *
         * Internal intelligence:
         * - Suppliers
         * - Supplier products
         * - Prices
         * - Quotes
         * - Purchase orders
         * - Samples
         * - Inventory
         * - Tasks
         *
         * IMPORTANT:
         * This frontend architecture is prepared for
         * future separation of public and private data.
         * Sensitive procurement data must NOT be exposed
         * on the public website in the final production
         * architecture.
         */

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

        this.initialized = false;
        this.initializing = null;

        this.basePath = this.detectBasePath();

    }


    /*
     * ------------------------------------------
     * PATH MANAGEMENT
     * ------------------------------------------
     *
     * The same engine is used by:
     *
     * /index.html
     *
     * /pages/products.html
     * /pages/store.html
     * /pages/dashboard.html
     *
     * Therefore data paths cannot simply be:
     *
     * data/products.json
     *
     * because pages/ would incorrectly search:
     *
     * pages/data/products.json
     */

    detectBasePath() {

        const path =
            window.location.pathname.toLowerCase();

        if (path.includes("/pages/")) {
            return "../";
        }

        return "./";

    }


    getDataPath(file) {

        return `${this.basePath}data/${file}`;

    }


    /*
     * ------------------------------------------
     * JSON LOADER
     * ------------------------------------------
     */

    async load(file) {

        const path = this.getDataPath(file);

        const response = await fetch(path, {
            cache: "no-store"
        });

        if (!response.ok) {

            throw new Error(
                `SecPack Data Engine: failed to load ${path}`
            );

        }

        return await response.json();

    }


    /*
     * ------------------------------------------
     * INITIALIZATION
     * ------------------------------------------
     *
     * Prevents multiple pages/components from
     * loading the complete database repeatedly.
     */

    async initialize() {

        if (this.initialized) {
            return this;
        }

        if (this.initializing) {
            return await this.initializing;
        }

        this.initializing =
            this.loadAllData();

        try {

            await this.initializing;

            this.initialized = true;

            console.log(
                "SecPack Data Engine Ready"
            );

            return this;

        } catch (error) {

            console.error(
                "SecPack Data Engine initialization failed:",
                error
            );

            throw error;

        } finally {

            this.initializing = null;

        }

    }


    async loadAllData() {

        const [

            products,
            suppliers,
            supplierProducts,
            documents,
            quotes,
            inventory,
            contacts,
            priceHistory,
            tasks,
            purchaseOrders,
            samples,
            categories,
            applications

        ] = await Promise.all([

            this.load("products.json"),
            this.load("suppliers.json"),
            this.load("supplier-products.json"),
            this.load("documents.json"),
            this.load("quotes.json"),
            this.load("inventory.json"),
            this.load("contacts.json"),
            this.load("price-history.json"),
            this.load("tasks.json"),
            this.load("purchase-orders.json"),
            this.load("samples.json"),
            this.load("categories.json"),
            this.load("applications.json")

        ]);


        this.products =
            Array.isArray(products)
                ? products
                : [];


        this.suppliers =
            Array.isArray(suppliers)
                ? suppliers
                : [];


        this.supplierProducts =
            Array.isArray(supplierProducts)
                ? supplierProducts
                : [];


        this.documents =
            Array.isArray(documents)
                ? documents
                : [];


        this.quotes =
            Array.isArray(quotes)
                ? quotes
                : [];


        this.inventory =
            Array.isArray(inventory)
                ? inventory
                : [];


        this.contacts =
            Array.isArray(contacts)
                ? contacts
                : [];


        this.priceHistory =
            Array.isArray(priceHistory)
                ? priceHistory
                : [];


        this.tasks =
            Array.isArray(tasks)
                ? tasks
                : [];


        this.purchaseOrders =
            Array.isArray(purchaseOrders)
                ? purchaseOrders
                : [];


        this.samples =
            Array.isArray(samples)
                ? samples
                : [];


        this.categories =
            Array.isArray(categories)
                ? categories
                : [];


        this.applications =
            Array.isArray(applications)
                ? applications
                : [];

    }


    /*
     * ------------------------------------------
     * PRODUCT INTELLIGENCE
     * ------------------------------------------
     */

    getProduct(id) {

        return this.products.find(
            product =>
                String(product.id) === String(id)
        );

    }


    getProductsByCategory(category) {

        return this.products.filter(
            product =>
                String(product.category || "")
                    .toLowerCase() ===
                String(category || "")
                    .toLowerCase()
        );

    }


    getProductsByApplication(application) {

        return this.products.filter(
            product =>
                String(product.application || "")
                    .toLowerCase()
                    .includes(
                        String(application || "")
                            .toLowerCase()
                    )
        );

    }


    /*
     * ------------------------------------------
     * SUPPLIER INTELLIGENCE
     * ------------------------------------------
     */

    getSupplier(id) {

        return this.suppliers.find(
            supplier =>
                String(supplier.id) === String(id)
        );

    }


    getSuppliersByCountry(country) {

        return this.suppliers.filter(
            supplier =>
                String(supplier.country || "")
                    .toLowerCase() ===
                String(country || "")
                    .toLowerCase()
        );

    }


    getSuppliersByProduct(productId) {

        const relations =
            this.getSupplierProducts(productId);

        return relations
            .map(item =>
                this.getSupplier(item.supplierId)
            )
            .filter(Boolean);

    }


    /*
     * ------------------------------------------
     * SUPPLIER / PRODUCT RELATIONSHIP
     * ------------------------------------------
     */

    getSupplierProducts(productId) {

        return this.supplierProducts.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }


    getProductsForSupplier(supplierId) {

        return this.supplierProducts.filter(
            item =>
                String(item.supplierId) ===
                String(supplierId)
        );

    }


    /*
     * ------------------------------------------
     * COMMERCIAL INTELLIGENCE
     * ------------------------------------------
     */

    getQuotes(productId) {

        return this.quotes.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }


    getPriceHistory(productId) {

        return this.priceHistory.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }


    getInventory(productId) {

        return this.inventory.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }


    getPurchaseOrders(productId) {

        return this.purchaseOrders.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }    /*
     * ------------------------------------------
     * DOCUMENT INTELLIGENCE
     * ------------------------------------------
     */

    getDocuments(productId) {

        return this.documents.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }


    getDocumentsByType(type) {

        return this.documents.filter(
            item =>
                String(item.type || "")
                    .toLowerCase() ===
                String(type || "")
                    .toLowerCase()
        );

    }


    /*
     * ------------------------------------------
     * SAMPLE MANAGEMENT
     * ------------------------------------------
     */

    getSamples(productId) {

        return this.samples.filter(
            item =>
                String(item.productId) ===
                String(productId)
        );

    }


    getSamplesBySupplier(supplierId) {

        return this.samples.filter(
            item =>
                String(item.supplierId) ===
                String(supplierId)
        );

    }


    /*
     * ------------------------------------------
     * TASK MANAGEMENT
     * ------------------------------------------
     */

    getTasks(status) {

        if (!status) {
            return this.tasks;
        }

        return this.tasks.filter(
            item =>
                String(item.status || "")
                    .toLowerCase() ===
                String(status || "")
                    .toLowerCase()
        );

    }


    /*
     * ------------------------------------------
     * CONTACT MANAGEMENT
     * ------------------------------------------
     */

    getContacts(status) {

        if (!status) {
            return this.contacts;
        }

        return this.contacts.filter(
            item =>
                String(item.status || "")
                    .toLowerCase() ===
                String(status || "")
                    .toLowerCase()
        );

    }


    /*
     * ------------------------------------------
     * CATEGORY / APPLICATION INTELLIGENCE
     * ------------------------------------------
     */

    getCategory(id) {

        return this.categories.find(
            category =>
                String(category.id) ===
                String(id)
        );

    }


    getApplication(id) {

        return this.applications.find(
            application =>
                String(application.id) ===
                String(id)
        );

    }


    /*
     * ------------------------------------------
     * PROCUREMENT SUMMARY
     * ------------------------------------------
     *
     * Provides a single overview for future
     * dashboard components.
     */

    getProcurementSummary() {

        return {

            products:
                this.products.length,

            suppliers:
                this.suppliers.length,

            activeSuppliers:
                this.suppliers.filter(
                    supplier =>
                        String(supplier.status || "")
                            .toLowerCase() ===
                        "active"
                ).length,

            negotiatingSuppliers:
                this.suppliers.filter(
                    supplier =>
                        String(supplier.status || "")
                            .toLowerCase() ===
                        "negotiating"
                ).length,

            pendingSamples:
                this.samples.filter(
                    sample =>
                        String(sample.status || "")
                            .toLowerCase() ===
                        "pending"
                ).length,

            inventoryItems:
                this.inventory.length,

            openTasks:
                this.tasks.filter(
                    task =>
                        String(task.status || "")
                            .toLowerCase() !==
                        "completed"
                ).length,

            purchaseOrders:
                this.purchaseOrders.length

        };

    }


    /*
     * ------------------------------------------
     * PUBLIC PRODUCT DATA
     * ------------------------------------------
     *
     * The public website must not expose:
     *
     * - supplier identities
     * - purchase prices
     * - target prices
     * - sourcing routes
     * - confidential procurement notes
     *
     * This method creates a safe product view.
     */

    getPublicProducts() {

        return this.products.map(product => {

            return {

                id: product.id,

                name: product.name,

                category: product.category,

                application: product.application,

                description:
                    product.description ||
                    product.technical?.description ||
                    "",

                status:
                    product.status ||
                    "Active"

            };

        });

    }


    /*
     * ------------------------------------------
     * PUBLIC SUPPLIER-SAFE VIEW
     * ------------------------------------------
     *
     * Used only where a future public-facing
     * supplier-related feature is required.
     *
     * No confidential commercial information.
     */

    getPublicSupplierView(supplier) {

        if (!supplier) {
            return null;
        }

        return {

            id: supplier.id,

            country:
                supplier.country || "",

            city:
                supplier.city || "",

            product:
                supplier.product || "",

            category:
                supplier.category || "",

            status:
                supplier.status || ""

        };

    }


    /*
     * ------------------------------------------
     * ENGINE STATUS
     * ------------------------------------------
     */

    getStatus() {

        return {

            initialized:
                this.initialized,

            products:
                this.products.length,

            suppliers:
                this.suppliers.length,

            documents:
                this.documents.length,

            inventory:
                this.inventory.length,

            samples:
                this.samples.length,

            tasks:
                this.tasks.length,

            purchaseOrders:
                this.purchaseOrders.length

        };

    }

}


/*
 * ==========================================
 * GLOBAL SECPACK ENGINE
 * ==========================================
 */

window.SecPack =
    new SecPackDataEngine();


/*
 * ==========================================
 * SAFE AUTO INITIALIZATION
 * ==========================================
 *
 * Pages that explicitly call:
 *
 * await window.SecPack.initialize();
 *
 * will use the same initialized instance.
 *
 * Errors are logged without silently
 * replacing the engine.
 */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            await window.SecPack.initialize();

            console.log(
                "SecPack Core Loaded",
                window.SecPack.getStatus()
            );

        } catch (error) {

            console.error(
                "SecPack Core Error:",
                error
            );

        }

    }
);
