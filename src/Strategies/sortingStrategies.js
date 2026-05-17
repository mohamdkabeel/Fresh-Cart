// ─────────────────────────────────────────────────────────────
//  STRATEGY PATTERN — Sorting Strategies
//
//  Each strategy is a plain comparator function (a → b → number).
//  To add a new sort order, just add one more entry to the map.
//  ProductList consumes `SortStrategy.apply(key, products)` and
//  never has to know how sorting is implemented.
// ─────────────────────────────────────────────────────────────

const strategies = {
    /** No-op: keeps the original API order */
    default: () => 0,

    /** Ascending price */
    lp: (a, b) => a.price - b.price,

    /** Descending price */
    hp: (a, b) => b.price - a.price,

    /** Ascending rating */
    lr: (a, b) => a.ratingsAverage - b.ratingsAverage,

    /** Descending rating */
    hr: (a, b) => b.ratingsAverage - a.ratingsAverage,
};

const SortStrategy = {
    /**
     * Sort a product array using the named strategy.
     * Falls back to "default" if the key is unknown.
     *
     * @param {string}   key      - One of the strategy keys above
     * @param {Array}    products - Array of product objects
     * @returns {Array}           - New sorted array (original is untouched)
     */
    apply(key, products) {
        const comparator = strategies[key] ?? strategies.default;
        return [...products].sort(comparator);
    },

    /** All valid strategy keys — useful for populating <select> options */
    keys: Object.keys(strategies),
};

export default SortStrategy;