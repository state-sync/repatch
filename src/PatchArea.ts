import { Store } from "redux";

import { OpSelect } from './Patch';

export class PatchArea<S> {
    private store: Store<S>;
    private rootPath: string;

    constructor(rootPath: string, store: Store<S>) {
        this.rootPath = rootPath;
        this.store = store;
    }

    public select(path: string) {
        return new OpSelect({op: 'select', path: this.path(path)}).apply(this.store.getState());
    }

    public replace(path: string, value: any) {
        if (!this.store) throw 'PatchArea is not initialized';
        this.store.dispatch({
            type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                op: 'replace', path: this.path(path), value: value
            }]
        });
    }

    public remove(path: string): void {
        if (!this.store) throw 'PatchArea is not initialized';
        try {
            this.store.dispatch({
                type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                    op: 'remove', path: this.path(path)
                }]
            });
        } catch (e) {
            console.error(e);
        }
    }

    public child(path: string): PatchArea<S> {
        return new PatchArea<S>(this.path(path), this.store);
    }

    private path(path: string) {
        if (path.startsWith('/')) path = path.substring(1);
        return this.rootPath + path;
    }
}