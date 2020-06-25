import o from 'ospec';
import { getApiKey, ONE_DAY_MS } from '../api';
import { Config } from '../config';
import { ulid, decodeTime, encodeTime } from 'ulid';

declare const global: {
    localStorage: { getItem: (a: string) => string | null; setItem: (k: string, v: string) => void };
};

o.spec('ApiKey', () => {
    const localStorage = { getItem: (): string | null => null, setItem: (): void => undefined };
    o.beforeEach(() => {
        localStorage.getItem = (): string | null => null;
        localStorage.setItem = (): void => undefined;
        global.localStorage = localStorage as any;
    });
    o.afterEach(() => {
        delete global.localStorage;
    });
    o('should generate a ulid with prefix', () => {
        const apiKey = getApiKey();
        o(apiKey.startsWith('c')).equals(true);
        const ulidKey = apiKey.slice(1).toUpperCase();
        o(decodeTime(ulidKey) > 0).equals(true);
    });

    o('should return the same api key', () => {
        const keyA = Config.ApiKey;
        o(keyA).equals(Config.ApiKey);
    });

    o('should valid api keys from localStorage', () => {
        localStorage.getItem = o.spy((): string => 'foo');
        o(getApiKey()).notEquals('foo');

        localStorage.getItem = o.spy(() => '01ebpv4fgbxqnff6kdc184bx0j');
        o(getApiKey()).notEquals('01ebpv4fgbxqnff6kdc184bx0j');

        localStorage.getItem = o.spy(() => 'c01ebpv4fgbxqnff6kdc184bx0j');
        o(getApiKey()).equals('c01ebpv4fgbxqnff6kdc184bx0j');
    });

    o('should generate new keys after they expire', () => {
        const setSpy = o.spy();
        localStorage.setItem = setSpy;
        // Generate a key that is about 91 days old
        const oldDate = Date.now() - ONE_DAY_MS * 91;
        const fakeUlid = 'c' + encodeTime(oldDate, 10) + ulid().slice(10);
        localStorage.getItem = o.spy(() => fakeUlid.toLowerCase());

        // the fake ulid should be able to be decoded too
        const t = decodeTime(fakeUlid.slice(1).toUpperCase());
        o(t - oldDate < 1000).equals(true);

        const newApiKey = getApiKey();
        o(setSpy.args).deepEquals(['api-key', newApiKey]);
        o(newApiKey).notEquals(fakeUlid.toLocaleLowerCase());
        // new key should be made recently (within 1second)
        o(Date.now() - decodeTime(newApiKey.slice(1).toUpperCase()) < 1000).equals(true);
    });
});
