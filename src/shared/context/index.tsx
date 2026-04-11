'use client';

import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { initialState, reducer } from './reducers';
import { IState } from './reducers/reducer';

interface IStateProvider {
  state: IState;
  // eslint-disable-next-line
  dispatch: Dispatch<any>;
}

const store = createContext<IStateProvider>({ state: initialState, dispatch: () => null });
const { Provider } = store;

const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { StateProvider, store };
