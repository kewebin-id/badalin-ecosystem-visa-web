import { ESetValue } from '../actions/actions.type';
import { IState } from './reducer';

export const initialState: IState = {
  sampleState: undefined,
};

export const reducer = (state: IState, action: { type: ESetValue; payload?: unknown }): IState => {
  switch (action.type) {
    case ESetValue.SET_SAMPLE_STATE:
      return { ...state, sampleState: action?.payload };
    default:
      throw new Error();
  }
};
