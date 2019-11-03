import { Reducer } from "redux";
import { Patch } from './Patch';

export function PatchReducer<S>(initialState: any, reducers: Reducer<S>): Reducer<S> {
    return (state: any, action: any): any => {
        // initialization
        if (state === undefined) return reducers.call(undefined, undefined, initialState);

        // sync
        try {
            const fit = action.type.indexOf('@STATE_SYNC/') === 0;
            if (fit) {
                switch (action.type) {
                    case '@STATE_SYNC/PATCH_REDUCE': {
                        try {
                            return new Patch(action.payload).apply(state);
                        } catch (e) {
                            console.error('Patch failed', state, action.payload);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('action failed:', action, e);
        }

        return reducers.call(undefined, undefined, state);
    }

}
