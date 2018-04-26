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

    it('Replace test', () => {
        let src: any = {
            a : {
                b: {
                    c: ''
                }
            }
        };
        let res: any = new Patch([{op: 'replace', path: '/a//b/c', value: 'test'}]).apply(src);
        expect(res.a.b.c).to.equal('test');
    });

});