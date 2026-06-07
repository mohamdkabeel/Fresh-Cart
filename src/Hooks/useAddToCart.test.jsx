import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAddToCart } from './useAddToCart';
import { CartContext } from '../component/Context/CartContext';
import CartEventManager from '../Observer/cartEventManager';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from 'react-hot-toast';

describe('useAddToCart', () => {
  beforeEach(() => {
    CartEventManager.clear();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  function createWrapper({ addToCart, setNumOfCartItems }) {
    const contextValue = { addToCart, setNumOfCartItems };
    // eslint-disable-next-line react/prop-types
    return function Wrapper({ children }) {
      return (
        <CartContext.Provider value={contextValue}>
          {children}
        </CartContext.Provider>
      );
    };
  }

  it('shows error toast when user is not logged in', async () => {
    const addToCart = vi.fn();
    const setNumOfCartItems = vi.fn();
    const wrapper = createWrapper({ addToCart, setNumOfCartItems });
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await act(async () => {
      await result.current.addProductToCart('product123');
    });

    expect(toast.error).toHaveBeenCalledWith('You need to log in first!');
    expect(addToCart).not.toHaveBeenCalled();
  });

  it('calls addToCart and emits cartUpdated on success', async () => {
    localStorage.setItem('usertoken', 'fake-token');
    const addToCart = vi.fn().mockResolvedValue({
      data: { status: 'success', numOfCartItems: 3, data: {} },
    });
    const setNumOfCartItems = vi.fn();
    const wrapper = createWrapper({ addToCart, setNumOfCartItems });
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    const emitSpy = vi.spyOn(CartEventManager, 'emit');

    await act(async () => {
      await result.current.addProductToCart('product123');
    });

    expect(addToCart).toHaveBeenCalledWith('product123');
    expect(setNumOfCartItems).toHaveBeenCalledWith(3);
    expect(emitSpy).toHaveBeenCalledWith('cartUpdated', { numOfCartItems: 3 });
    expect(toast.success).toHaveBeenCalledWith('Product added to cart!');
  });

  it('emits cartError and shows error toast on non-success response', async () => {
    localStorage.setItem('usertoken', 'fake-token');
    const addToCart = vi.fn().mockResolvedValue({
      data: { status: 'fail' },
    });
    const setNumOfCartItems = vi.fn();
    const wrapper = createWrapper({ addToCart, setNumOfCartItems });
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    const emitSpy = vi.spyOn(CartEventManager, 'emit');

    await act(async () => {
      await result.current.addProductToCart('product123');
    });

    expect(emitSpy).toHaveBeenCalledWith('cartError', { error: 'Unexpected response' });
    expect(toast.error).toHaveBeenCalledWith('Error adding product to cart');
  });

  it('emits cartError on thrown exception', async () => {
    localStorage.setItem('usertoken', 'fake-token');
    const error = new Error('Network error');
    const addToCart = vi.fn().mockRejectedValue(error);
    const setNumOfCartItems = vi.fn();
    const wrapper = createWrapper({ addToCart, setNumOfCartItems });
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    const emitSpy = vi.spyOn(CartEventManager, 'emit');

    await act(async () => {
      await result.current.addProductToCart('product123');
    });

    expect(emitSpy).toHaveBeenCalledWith('cartError', { error });
  });
});
