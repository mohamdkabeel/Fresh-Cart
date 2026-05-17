// ─────────────────────────────────────────────────────────────
//  OBSERVER PATTERN — CartEventManager
//
//  A lightweight publish/subscribe event bus scoped to cart
//  actions.  Any module can subscribe to cart events without
//  knowing about other subscribers.
//
//  Usage
//  ─────
//  // Subscribe (e.g. in a component's useEffect)
//  const unsub = CartEventManager.on('cartUpdated', ({ numOfCartItems }) => {
//    setCount(numOfCartItems);
//  });
//  return () => unsub();   // ← clean up on unmount
//
//  // Publish (e.g. after a successful add-to-cart API call)
//  CartEventManager.emit('cartUpdated', { numOfCartItems: 5 });
// ─────────────────────────────────────────────────────────────

const CartEventManager = (() => {
    /** @type {Map<string, Set<Function>>} */
    const listeners = new Map();

    return {
        /**
         * Subscribe to an event.
         * @param {string}   event    - Event name, e.g. 'cartUpdated'
         * @param {Function} handler  - Called with the event payload
         * @returns {Function}        - Call this to unsubscribe
         */
        on(event, handler) {
            if (!listeners.has(event)) listeners.set(event, new Set());
            listeners.get(event).add(handler);

            // Return an unsubscribe function for easy cleanup in useEffect
            return () => listeners.get(event)?.delete(handler);
        },

        /**
         * Publish an event to all subscribers.
         * @param {string} event   - Event name
         * @param {*}      payload - Arbitrary data forwarded to every handler
         */
        emit(event, payload) {
            listeners.get(event)?.forEach((handler) => {
                try {
                    handler(payload);
                } catch (err) {
                    console.error(`[CartEventManager] Handler error on "${event}":`, err);
                }
            });
        },

        /**
         * Remove all handlers for every event.
         * Useful in tests or when the whole app unmounts.
         */
        clear() {
            listeners.clear();
        },
    };
})();

export default CartEventManager;