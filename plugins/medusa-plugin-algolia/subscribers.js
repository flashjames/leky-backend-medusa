"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_variant_1 = __importDefault(require("@medusajs/medusa/dist/services/product-variant"));
const product_1 = __importDefault(require("@medusajs/medusa/dist/services/product"));
const medusa_core_utils_1 = require("medusa-core-utils");
const plugins_1 = require("@medusajs/medusa/dist/loaders/plugins");
const searchFields = [
    "id",
    "title",
    "subtitle",
    "status",
    "description",
    "handle",
    "is_giftcard",
    "discountable",
    "thumbnail",
    "collection_id",
    "type_id",
    "origin_country",
    "created_at",
    "updated_at",
    "metadata",
];
const searchRelations = [
    "variants",
    "categories",
    "tags",
    "type",
    "collection",
    "variants.prices",
    "variants.options",
    "options",
];
class ProductSearchSubscriber {
    constructor({ eventBusService, searchService, productService, pricingService }) {
        this.handleProductCreation = async (data) => {
            console.log("handleProductCreation");
            const product = await this.retrieveProduct_(data.id);
            await this.searchService_.addDocuments(product_1.default.IndexName, [product], medusa_core_utils_1.indexTypes.products);
        };
        this.retrieveProduct_ = async (product_id) => {
            const computedProduct = await this.productService_.retrieve(product_id, {
                select: searchFields,
                relations: searchRelations,
            });
            const computedProducts = [computedProduct];
            const productWithPrices = await this.pricingService_.setProductPrices(computedProducts, {
                //cart_id: "cart_01GYA6KYR0NQV8S5JBDQWK9VD0",
                region_id: "reg_01HK2SX0JEB6Q6F7MBFAM4YS8E",
                currency_code: "EUR",
                include_discount_prices: true,
            });
            return productWithPrices[0];
        };
        this.handleProductUpdate = async (data) => {
            console.log("handleProductUpdate");
            const product = await this.retrieveProduct_(data.id);
            await this.searchService_.addDocuments(product_1.default.IndexName, [product], medusa_core_utils_1.indexTypes.products);
        };
        this.handleProductDeletion = async (data) => {
            await this.searchService_.deleteDocument(product_1.default.IndexName, data.id);
        };
        this.handleProductVariantChange = async (data) => {
            const product = await this.retrieveProduct_(data.product_id);
            await this.searchService_.addDocuments(product_1.default.IndexName, [product], medusa_core_utils_1.indexTypes.products);
        };
        this.eventBus_ = eventBusService;
        this.searchService_ = searchService;
        this.productService_ = productService;
        this.pricingService_ = pricingService;
        this.eventBus_.subscribe(product_1.default.Events.CREATED, this.handleProductCreation);
        this.eventBus_.subscribe(product_1.default.Events.UPDATED, this.handleProductUpdate);
        this.eventBus_.subscribe(product_1.default.Events.DELETED, this.handleProductDeletion);
        this.eventBus_.subscribe(product_variant_1.default.Events.CREATED, this.handleProductVariantChange);
        this.eventBus_.subscribe(product_variant_1.default.Events.UPDATED, this.handleProductVariantChange);
        this.eventBus_.subscribe(product_variant_1.default.Events.DELETED, this.handleProductVariantChange);
    }
}
exports.default = ProductSearchSubscriber;
//# sourceMappingURL=subscribers.js.map