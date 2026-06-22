// Shared money + cart helpers. Previously copy-pasted into cart/total.jsx,
// checkout/total.jsx and outfit/checkout.jsx.

// Locale-independent grouping (e.g. 50000 -> "50,000đ"). Keep the regex rather
// than toLocaleString so output never shifts with the runtime locale.
export const formatCurrency = (value, symbol = "đ") => {
    const intValue = Math.floor(value || 0);
    return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + symbol;
};

// Walk every outfit in the cart, counting picked items and summing totals.
export const analyzeInventory = (cart) => {
    let itemCount = 0;
    let totalSum = 0;

    const countItems = (section) => {
        if (section && typeof section === "object") {
            if ("item" in section && section.item !== null) {
                itemCount += 1;
            }
            Object.values(section).forEach((value) => {
                if (typeof value === "object") countItems(value);
            });
        }
    };

    cart.forEach((outfit) => {
        Object.values(outfit).forEach((section) => countItems(section));
        if (typeof outfit.total === "number") totalSum += outfit.total;
    });

    return { itemCount, totalSum };
};
