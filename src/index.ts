import { PatchArea } from 'PatchArea';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { PatchReducer } from './PatchReducer';

// export interface TestState {
//     name: string;
// }
//
// export interface State {
//     test: TestState
// }
//
// export const InitialState: State =
// {
//     test : {
//         name: ''
//     }
// }
//
// let reducers = PatchReducer(InitialState, combineReducers({}));
//
// export let store = createStore(reducers, applyMiddleware()) as Store<State>;
//
// const testArea = new PatchArea('test', {name: 'ok'});
// testArea.init(store);
