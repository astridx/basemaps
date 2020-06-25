import { Basemaps } from './map';
import { Epsg } from '@basemaps/geo';
import { WindowUrl, MapOptionType } from './url';

export class BasemapsUi {
    projectionNztm: HTMLElement;
    projectionWm: HTMLElement;

    apiXyz: HTMLInputElement;
    apiWmts: HTMLInputElement;

    basemaps: Basemaps;

    menuClose: HTMLElement;
    menuOpen: HTMLElement;
    sideNav: HTMLElement;

    constructor(basemaps: Basemaps) {
        this.basemaps = basemaps;
        this.bindMenuButton();
        this.bindProjectionButtons();
        this.bindApiLinks();
        this.bindMenuButton();

        this.setCurrentProjection(this.basemaps.config.projection);
    }
    bindMenuButton(): void {
        const menuOpen = document.getElementById('menu-open');
        const menuClose = document.getElementById('menu-close');
        const sideNav = document.getElementById('side-nav');

        if (menuOpen == null || menuClose == null || sideNav == null) {
            throw new Error('Unable to find menu button');
        }
        this.menuOpen = menuOpen;

        menuOpen.onclick = this.menuOnClick;
        menuClose.onclick = this.menuOnClick;

        this.menuClose = menuClose;
        this.sideNav = sideNav;
    }

    menuOnClick = (): void => {
        if (this.sideNav.classList.contains('side-nav--opened')) {
            this.sideNav.classList.remove('side-nav--opened');
        } else {
            this.sideNav.classList.add('side-nav--opened');
        }
    };

    bindApiLinks(): void {
        const apiXyz = document.getElementById('api-xyz');
        const apiWmts = document.getElementById('api-wmts');
        if (apiXyz == null || apiWmts == null) {
            throw new Error('Unable to find api inputs');
        }
        this.apiXyz = apiXyz as HTMLInputElement;
        this.apiWmts = apiWmts as HTMLInputElement;
    }

    bindProjectionButtons(): void {
        const projectionNztm = document.getElementById('projection-nztm');
        const projectionWm = document.getElementById('projection-wm');
        if (projectionNztm == null || projectionWm == null) {
            throw new Error('Unable to find projection buttons');
        }
        this.projectionNztm = projectionNztm;
        this.projectionNztm.onclick = this.projectionOnClick;

        this.projectionWm = projectionWm;
        this.projectionWm.onclick = this.projectionOnClick;
    }

    projectionOnClick = (e: MouseEvent): void => {
        const target = e.target as HTMLInputElement;
        if (target.classList == null) return;
        if (target.classList.contains('lui-button-active')) return;
        if (target == this.projectionNztm) {
            this.setCurrentProjection(Epsg.Nztm2000);
        } else {
            this.setCurrentProjection(Epsg.Google);
        }
    };

    setCurrentProjection(projection: Epsg): void {
        if (projection == Epsg.Nztm2000) {
            this.projectionNztm.classList.add('lui-button-active');
            this.projectionWm.classList.remove('lui-button-active');
        } else {
            this.projectionWm.classList.add('lui-button-active');
            this.projectionNztm.classList.remove('lui-button-active');
        }
        const cfg = { ...this.basemaps.config, projection };
        this.apiXyz.value = WindowUrl.toTileUrl(cfg, MapOptionType.Tile);
        this.apiWmts.value = WindowUrl.toTileUrl(cfg, MapOptionType.Wmts);
    }
}
