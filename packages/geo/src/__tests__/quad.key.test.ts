import { QuadKey } from '../quad.key';
import * as o from 'ospec';
import { Bounds } from '../bounds';
import { approxBounds } from '@basemaps/test';

o.spec('QuadKey', () => {
    o.spec('intersect', () => {
        o('should intersect big to small', () => {
            o(QuadKey.intersects('', '30003303')).equals(true);

            o(QuadKey.intersects('3', '30')).equals(true);
            o(QuadKey.intersects('3', '301')).equals(true);
            o(QuadKey.intersects('3', '333')).equals(true);
            o(QuadKey.intersects('33', '30')).equals(false);
            o(QuadKey.intersects('33', '301')).equals(false);
            o(QuadKey.intersects('33', '333')).equals(true);
        });

        o('should not intersect other cells', () => {
            o(QuadKey.intersects('0', '30003303')).equals(false);
            o(QuadKey.intersects('1', '30003303')).equals(false);
            o(QuadKey.intersects('2', '30003303')).equals(false);
            o(QuadKey.intersects('31', '30003303')).equals(false);
        });

        o('should intersect small to big', () => {
            o(QuadKey.intersects('331', '3')).equals(true);
            o(QuadKey.intersects('331', '30')).equals(false);
            o(QuadKey.intersects('331', '301')).equals(false);
            o(QuadKey.intersects('331', '333')).equals(false);
        });
    });

    o('should get children', () => {
        o(QuadKey.children('')).deepEquals(['0', '1', '2', '3']);
        o(QuadKey.children('3')).deepEquals(['30', '31', '32', '33']);
        o(QuadKey.children('3001')).deepEquals(['30010', '30011', '30012', '30013']);
    });

    o('should find parent', () => {
        o(QuadKey.parent('')).equals('');
        o(QuadKey.parent('3')).equals('');
        o(QuadKey.parent('31')).equals('3');
        o(QuadKey.parent('3001')).equals('300');
    });

    o('toBbox', () => {
        o(QuadKey.toBbox('')).deepEquals([-180, -85.0511287798066, 180, 85.0511287798066]);
        o(QuadKey.toBbox('31')).deepEquals([90, -66.51326044311186, 180, 0]);
        o(QuadKey.toBbox('31021')).deepEquals([101.25, -31.95216223802496, 112.5, -21.943045533438177]);
    });

    o('toBounds', () => {
        approxBounds(QuadKey.toBounds('3113323113203'), new Bounds(174.067383, -39.300299, 0.043945, 0.034015));
        approxBounds(QuadKey.toBounds('3'), new Bounds(0, -85.051129, 180, 85.051129));
        approxBounds(QuadKey.toBounds(''), new Bounds(-180, -85.051129, 360, 170.102258));
    });

    o('toXYZ', () => {
        o(QuadKey.toXYZ('')).deepEquals([0, 0, 0]);
        o(QuadKey.toXYZ('31')).deepEquals([3, 2, 2]);
        o(QuadKey.toXYZ('31021')).deepEquals([25, 18, 5]);
    });

    o('compareKeys', () => {
        o(QuadKey.compareKeys('3201', '33')).equals(2);
        o(QuadKey.compareKeys('33', '3201')).equals(-2);
        o(QuadKey.compareKeys('33', '33')).equals(0);
        o(QuadKey.compareKeys('31', '33')).equals(-1);
        o(QuadKey.compareKeys('31', '22')).equals(1);
    });

    o('toTile', () => {
        o(QuadKey.toTile('')).deepEquals({ x: 0, y: 0, z: 0 });
        o(QuadKey.toTile('31')).deepEquals({ x: 3, y: 2, z: 2 });
        o(QuadKey.toTile('31021')).deepEquals({ x: 25, y: 18, z: 5 });
    });

    o('fromTile', () => {
        o(QuadKey.fromTile({ x: 0, y: 0, z: 0 })).equals('');
        o(QuadKey.fromTile({ x: 0, y: 0, z: 32 })).equals('00000000000000000000000000000000');
        o(QuadKey.fromTile({ x: 3, y: 2, z: 2 })).equals('31');
        o(QuadKey.fromTile({ x: 25, y: 18, z: 5 })).equals('31021');

        o(QuadKey.fromTile({ x: 2 ** 24 - 1, y: 0, z: 24 })).equals('111111111111111111111111');
        o(QuadKey.fromTile({ x: 0, y: 2 ** 24 - 1, z: 24 })).equals('222222222222222222222222');
        o(QuadKey.fromTile({ x: 2 ** 24 - 1, y: 2 ** 24 - 1, z: 24 })).equals('333333333333333333333333');
    });
});
