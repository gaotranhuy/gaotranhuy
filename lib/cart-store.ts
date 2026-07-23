'use client';

import * as React from 'react';
import type { CartItem, Product } from '@/types';

const STORAGE_KEY = 'gth-cart';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
}

type Listener = () => void;

let state: CartState = {
  items: [],
  isOpen: false,
  hydrated: false,
};

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setItems(items: CartItem[]) {
  state = { ...state, items };
  notify();
}

function setOpen(isOpen: boolean) {
  state = { ...state, isOpen };
  notify();
}

function hydrate() {
  if (state.hydrated) return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      state = { ...state, items: JSON.parse(stored), hydrated: true };
    } else {
      state = { ...state, hydrated: true };
    }
  } catch {
    state = { ...state, hydrated: true };
  }
  notify();
}

function persist() {
  if (!state.hydrated) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // ignore
  }
}

export function addItem(product: Product, quantity = 1, options?: { silent?: boolean }) {
  const existing = state.items.find((i) => i.product.id === product.id);
  if (existing) {
    setItems(
      state.items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      )
    );
  } else {
    setItems([...state.items, { product, quantity }]);
  }
  if (!options?.silent) {
    setOpen(true);
  }
  persist();
}

export function removeItem(productId: string) {
  setItems(state.items.filter((i) => i.product.id !== productId));
  persist();
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    setItems(state.items.filter((i) => i.product.id !== productId));
  } else {
    setItems(
      state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }
  persist();
}

export function clearCart() {
  setItems([]);
  persist();
}

export function openCart() {
  setOpen(true);
}

export function closeCart() {
  setOpen(false);
}

export function toggleCart() {
  setOpen(!state.isOpen);
}

export function getCartState(): CartState {
  return state;
}

export function useCartStore() {
  const snapshot = React.useSyncExternalStore(
    subscribe,
    getCartState,
    getCartState
  );

  React.useEffect(() => {
    hydrate();
  }, []);

  const totalItems = snapshot.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = snapshot.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return {
    items: snapshot.items,
    isOpen: snapshot.isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };
}

export type CartStoreValue = ReturnType<typeof useCartStore>;
