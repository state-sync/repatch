# @state-sync/repatch

WARNING: It is in development and I would not suggest to use it until version 1.0.

##Installation

Library is available as and NPM package. You can install it as usual.
```shell script
npm install @state-sync/repatch --save
```

##Documentation
TSDocs: [documentation](./tsdoc/index.html)

##Sample

```typescript
// define state interface
export interface DashboardState {
    progress?: boolean;
    name: string;
}
// define initial state
export function initialDashboardState(): DashboardState {
    return {
        name: ''
    };
}
```

```typescript
// State
export interface State {
    dashboard: DashboardState;
}

export const initialState: State = {
    dashboard: initialDashboardState()
};

let reducers = PatchReducer(initialState, combineReducers({
}));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export let store = createStore(reducers, composeEnhancers(applyMiddleware()));
```

```typescript
// crete patch area
const area = new PatchArea(AppRuntimeStateName, store);

// manipulate area
area.toggle('/progress');
area.replace('/name', 'My Name');

```
