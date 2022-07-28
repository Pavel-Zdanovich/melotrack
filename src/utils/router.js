import {throwError} from "./utils.js";

class Router extends EventTarget {

    constructor() {
        super();
        this.origin = `pavel-zdanovich.github.io` === window.location.host ? `https://pavel-zdanovich.github.io/melotrack` : window.location.origin;
    }

    set(url) { //TODO set mapping as contract: exists - map, not - 404, reach - set url
        if (typeof url === `string` && /[\w`~!@#\$;%&\?\*\(\)_\-\+=\{}\\\|'",<\.>\/]+/.test(url)) {
            window.history.pushState(``, ``, `${this.origin}/#/${url}`);
        } else {
            throwError({url});
        }
    }
}

const router = new Router();

window.addEventListener(`load`, () => {
    let path = window.location.hash.substring(2);//window.location.pathname.substring(1);
    const paths = path.split(`/`);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const parameters = Object.fromEntries(
        Array.from(urlSearchParams.entries()).map(entry => [entry[0], urlSearchParams.getAll(entry[0])])
    );
    path = ``;
    for (let i = 0; i < paths.length; i++) {
        path = path.concat(paths[i]);
        let pathParams;
        if (i < paths.length - 1) {
            path = path.concat(`/`);
            pathParams = path.concat(`*`);
        } else {
            pathParams = path;
        }
        router.dispatchEvent(new CustomEvent(pathParams, {detail: {paths, parameters}}));
    }
});

export {router};

console.log(`router loaded`);