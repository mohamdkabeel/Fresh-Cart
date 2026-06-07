import { describe, it, expect, vi, beforeEach } from 'vitest';
import CartEventManager from './cartEventManager';

describe('CartEventManager', () => {
  beforeEach(() => {
    CartEventManager.clear();
  });

  describe('on() and emit()', () => {
    it('calls a subscribed handler when the matching event is emitted', () => {
      const handler = vi.fn();
      CartEventManager.on('cartUpdated', handler);
      CartEventManager.emit('cartUpdated', { numOfCartItems: 3 });

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith({ numOfCartItems: 3 });
    });

    it('supports multiple handlers for the same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      CartEventManager.on('cartUpdated', handler1);
      CartEventManager.on('cartUpdated', handler2);
      CartEventManager.emit('cartUpdated', { numOfCartItems: 5 });

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
    });

    it('does not call handlers subscribed to a different event', () => {
      const handler = vi.fn();
      CartEventManager.on('cartError', handler);
      CartEventManager.emit('cartUpdated', { numOfCartItems: 1 });

      expect(handler).not.toHaveBeenCalled();
    });

    it('does not throw when emitting an event with no subscribers', () => {
      expect(() => CartEventManager.emit('noSuchEvent', {})).not.toThrow();
    });

    it('passes payload correctly to handlers', () => {
      const handler = vi.fn();
      CartEventManager.on('cartError', handler);
      const error = new Error('network failure');
      CartEventManager.emit('cartError', { error });

      expect(handler).toHaveBeenCalledWith({ error });
    });
  });

  describe('unsubscribe', () => {
    it('returns an unsubscribe function that removes the handler', () => {
      const handler = vi.fn();
      const unsub = CartEventManager.on('cartUpdated', handler);

      unsub();
      CartEventManager.emit('cartUpdated', { numOfCartItems: 10 });

      expect(handler).not.toHaveBeenCalled();
    });

    it('only removes the specific handler, leaving others intact', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const unsub1 = CartEventManager.on('cartUpdated', handler1);
      CartEventManager.on('cartUpdated', handler2);

      unsub1();
      CartEventManager.emit('cartUpdated', { numOfCartItems: 2 });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledOnce();
    });
  });

  describe('clear()', () => {
    it('removes all handlers for all events', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      CartEventManager.on('cartUpdated', handler1);
      CartEventManager.on('cartError', handler2);

      CartEventManager.clear();
      CartEventManager.emit('cartUpdated', {});
      CartEventManager.emit('cartError', {});

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('error handling in handlers', () => {
    it('does not stop other handlers when one throws', () => {
      const errorHandler = vi.fn(() => { throw new Error('oops'); });
      const goodHandler = vi.fn();

      CartEventManager.on('cartUpdated', errorHandler);
      CartEventManager.on('cartUpdated', goodHandler);

      // Should not throw
      expect(() => CartEventManager.emit('cartUpdated', {})).not.toThrow();
      expect(goodHandler).toHaveBeenCalledOnce();
    });
  });
});
