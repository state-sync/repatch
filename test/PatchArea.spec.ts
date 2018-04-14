import { expect } from 'chai';
import 'mocha';
import { Patch } from '../src/Patch';

describe('Patch', () => {

    it('Merge should keep properties', () => {
        let src: any = {
            id: 1
        };
        let res: any = new Patch([{op: 'merge', path: '/', value: {name: 'test'}}]).apply(src);
        expect(res.id).to.equal(1);
        expect(res.name).to.equal('test');
    });

});