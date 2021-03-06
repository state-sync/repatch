import { Store } from "redux";

import { OpSelect } from './Patch';

export class PatchArea<S, Root> {
    readonly store: Store<S>;
    readonly rootPath: string;

    constructor(rootPath: string, store: Store<S>) {
        this.rootPath = rootPath;
        this.store = store;
    }

    /**
     * Returns path to this area from root of redux state
     * @returns {string}
     */
    public areaPath(): string {
        return this.rootPath;
    }

    /**
     * Returns root model of area
     */
    public model(): Root {
        return this.select('') as Root;
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
     *     replace('/items/1/label', 'test')
     *     result: {
     *      items: [
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
     * Insert element into array
     * @param {string} path - JSON path
     * @param {number} index - insert index
     * @param {any} value - value to insert
     */
    public insert(path: string, index: number, value: any): void {
        if (!this.store) throw 'PatchArea is not initialized';
        if (index < 0) throw 'index < 0';
        try {
            this.store.dispatch({
                type: '@STATE_SYNC/PATCH_REDUCE', payload: [{
                    op: 'insert', path: this.path(path), index: index, value: value
                }]
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Append element to array by path
     * @param {string} path - JSON path
     * @param {any} item - Item to add
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
     * @param {number} index - Item index
     */
    public removeArrayItem(path: string, index: number): void {
        return this.remove(path + '/' + index);
    }

    /**
     * Move element in array by index
     * @param {string} path - JSON path
     * @param {number} src - source index
     * @param {number} dest - destination index
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
     * @returns {PatchArea}
     */
    public child<ChildRoot>(path: string): PatchArea<S, ChildRoot> {
        return new PatchArea<S, ChildRoot>(this.path(path), this.store);
    }

    /**
     * Return function which accept Event and set value to e.target.value.
     * Used by forms <code>onChange={area.accept('/path')}</code>
     * @param path - path to set
     * @return
     */
    public accept(path: string): (a: any) => void {
        return (e: any) => this.replace(path, e.target.value);
    }

    /**
     * Return function which accept Event and set value to Number.parseFloat(e.target.value).
     * Used by forms <code>onChange={area.accept('/path')}</code>
     * @param path - path to set
     * @return
     */
    public acceptFloat(path: string): (a: any) => void {
        return (e: any) => this.replace(path, e.target.value ? Number.parseFloat(e.target.value) : null);
    }

    /**
     * Return function which accept Event and set value to Number.parseInt(e.target.value).
     * Used by forms <code>onChange={area.accept('/path')}</code>
     * @param path - path to set
     * @return
     */
    public acceptInt(path: string): (a: any) => void {
        return (e: any) => this.replace(path, e.target.value ? Number.parseInt(e.target.value) : null);
    }

    /**
     * Toggle boolean value
     * @param path
     */
    public toggle(path: string) {
        this.replace(path, !this.select(path));
    }

    private path(path: string) {
        if (path.startsWith('/')) path = path.substring(1);
        return this.rootPath + '/' + path;
    }
}
