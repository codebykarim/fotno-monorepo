"use client";

import { useSyncExternalStore } from "react";

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
type GetState<T> = () => T;
type Subscribe = (listener: () => void) => () => void;

type StateCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

type StoreApi<T> = {
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: Subscribe;
};

type Selector<T, U> = (state: T) => U;

export function create<T>(createState: StateCreator<T>) {
  let state: T;
  const listeners = new Set<() => void>();

  const getState: GetState<T> = () => state;

  const setState: SetState<T> = (partial) => {
    const nextState =
      typeof partial === "function"
        ? { ...state, ...(partial as (state: T) => Partial<T>)(state) }
        : { ...state, ...partial };

    state = nextState;
    listeners.forEach((listener) => listener());
  };

  const subscribe: Subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = createState(setState, getState);

  const api: StoreApi<T> = { getState, setState, subscribe };

  function useStore<U>(selector: Selector<T, U> = ((s: T) => s as unknown as U)) {
    return useSyncExternalStore(api.subscribe, () => selector(api.getState()), () => selector(api.getState()));
  }

  (useStore as typeof useStore & StoreApi<T>).getState = api.getState;
  (useStore as typeof useStore & StoreApi<T>).setState = api.setState;
  (useStore as typeof useStore & StoreApi<T>).subscribe = api.subscribe;

  return useStore as typeof useStore & StoreApi<T>;
}
