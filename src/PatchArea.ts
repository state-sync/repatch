import { Store } from "redux";

import { OpSelect } from './Patch';

export class PatchArea<S> {
    private store: Store<S>;
    private rootPath: string;

    constructor(rootPath: string, store: Store<S>) {
        this.rootPath = rootPath;
        this.store = store;
    }

    /**
     * Selects and return value by path
     * @param {string} path - JSON path
     * @returns {any} value
     */
    public select(path: string) {
        return new OpSelect({op: 'select', path: this.path(path)}).apply(this.store.getState());
    }

    /**
     * Replace value by path, missed elements built by path part. If path part is number, missed array constructed,
     * otherwise object is created.
     * Example 1
     * <pre>
     *     source: {}
     *     replace('/todo/1/label', 'test')
     *     result: {
     *      todo: [
     *          {
     *              label: 'test'
     *          }
     *      ]
     *     }
     * </pre>
     * @param {string} path
     * @param value
     */
    public replace(path: string, value: any) {
        if (!this.store) throw 'PatchArea is not initialized';
        this.store.dispatch({
            type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                op: 'replace', path: this.path(path), value: value
            }]
        });
    }

    /**
     * Merge value by path, missed elements built by path part. If path part is number, missed array constructed,
     * otherwise object is created.
     * Example 1
     * <pre>
     *     source: { obj: {id: '1', name: ''}
     *     merge('/obj', {name: 'test'})
     *     result: {
     *       obj: {
     *         id: '1',
     *         name: 'test'
     *       }
     *     }
     * </pre>
     * @param {string} path
     * @param value
     */
    public merge(path: string, value: any) {
        if (!this.store) throw 'PatchArea is not initialized';
        this.store.dispatch({
            type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                op: 'merge', path: this.path(path), value: value
            }]
        });
    }

    /**
     * Removes element by path
     * @param {string} path - JSON path
     */
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

    /**
     * Removes element by path
     * @param {string} path - JSON path
     */
    public append(path: string, item: any): void {
        if (!this.store) throw 'PatchArea is not initialized';
        try {
            this.store.dispatch({
                type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                    op: 'append', path: this.path(path), value: item
                }]
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Removes element from array by index
     * @param {string} path - JSON path
     */
    public removeArrayItem(path: string, item: number): void {
        return this.remove(path + '/' + item);
    }

    /**
     * Removes element from array by index
     * @param {string} path - JSON path
     */
    public moveArrayItem(path: string, src: number, dest: number): void {
        if (!this.store) throw 'PatchArea is not initialized';
        try {
            this.store.dispatch({
                type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                    op: 'moveArrayItem', path: this.path(path), value: {src: src, dest: dest}
                }]
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Return area for child element
     * @param {string} path - path to child element
     * @returns {PatchArea<S>}
     */
    public child(path: string): PatchArea<S> {
        return new PatchArea<S>(this.path(path), this.store);
    }

    public accept(path: string): (a: any) => void {
        return (e: any) => this.replace(path, e.target.value);
    }

    public acceptFloat(path: string): (a: any) => void {
        return (e: any) => this.replace(path, e.target.value ? Number.parseFloat(e.target.value) : null);
    }

    public acceptInt(path: string): (a: any) => void {
        return (e: any) => this.replace(path, e.target.value ? Number.parseInt(e.target.value) : null);
    }

    private path(path: string) {
        if (path.startsWith('/')) path = path.substring(1);
        return this.rootPath + '/' + path;
    }
}