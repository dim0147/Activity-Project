import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { IUser } from './user/types'

import reducer from './user/reducers'

const middleWare = applyMiddleware(createLogger());

export type appState = IUser | null;

export const store = createStore(reducer,  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());