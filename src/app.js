import {spinner} from "./utils/spinner.js";

spinner.markProgressBy(25);

import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
import "https://e-cdn-files.dzcdn.net/js/min/dz.js";
import {next, previous, promisify} from "./utils/utils.js";

spinner.markProgressBy(25);

const [init, initResolve] = promisify();
DZ.init({
    appId: '509082',
    channelUrl: 'http://melotrack/channel.html',
    player: {
        onload: (response) => {
            console.log('DZ.player is ready', response);
            initResolve();
        }
    }
});

spinner.markProgressBy(25);

const [ready, readyResolve] = promisify();
DZ.ready((sdk_options) => {
    console.log('DZ SDK is ready', sdk_options);
    readyResolve();
});

spinner.markProgressBy(25);

const loading = fetch("data.json").then(response => response.json());

Promise.all(
    [
        //init,
        //ready,
        loading
    ]
).then(() => spinner.stop());

import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {playlist} from "./modes/playlist.js";
import {radio} from "./modes/radio.js";
import {track} from "./modes/track.js";
import {router} from "./utils/router.js";

const data = await loading;

const wrap = (index, mode) => {
    if (mode.name === `chart`) {
        router.addEventListener(`chart`, () => {
            const wrapped = () => {
                current = index;
                return mode();
            };
            Object.defineProperty(wrapped, `name`, {value: mode.name, writable: false});
            load(wrapped);
        });
        const wrapped = () => {
            current = index;
            return mode()
                .then(tour => {
                    router.set(`${mode.name}`);
                    return tour;
                });
        };
        Object.defineProperty(wrapped, `name`, {value: mode.name, writable: false});
        return wrapped;
    }

    if (mode.name === `track`) {
        router.addEventListener(`track`, (e) => {
            const ids = e.detail.parameters[`id`];
            const wrapped = () => {
                current = index;
                return mode(ids);
            };
            Object.defineProperty(wrapped, `name`, {value: mode.name, writable: false});
            load(wrapped);
        });
        const getIds = () => {
            const ids = [];
            for (let i = 0; i < 10; i++) {
                let id = data.track[Math.floor(Math.random() * data.track.length)];
                while (ids.includes(id)) {
                    id = data.track[Math.floor(Math.random() * data.track.length)];
                }
                ids.push(id);
            }
            return ids;
        }
        const ids = getIds();
        const wrapped = () => {
            current = index;
            return mode(ids)
                .then(tour => {
                    const urlSearchParams = new URLSearchParams();
                    for (let id of ids) {
                        urlSearchParams.append(`id`, id);
                    }
                    router.set(`track?${urlSearchParams}`);
                    return tour;
                });
        };
        Object.defineProperty(wrapped, `name`, {value: mode.name, writable: false});
        return wrapped;
    }

    router.addEventListener(`${mode.name}/*`, (e) => {
        const [modeName, id] = e.detail.paths;
        const wrapped = () => {
            current = index;
            return mode(id);
        };
        Object.defineProperty(wrapped, `name`, {value: mode.name, writable: false});
        load(wrapped);
    });
    const getId = () => {
        const modeData = data[mode.name];
        return modeData[Math.floor(Math.random() * modeData.length)];
    }
    const id = getId();
    const wrapped = () => {
        current = index;
        return mode(id)
            .then(tour => {
                router.set(`${mode.name}/${id}`);
                return tour;
            });
    };
    Object.defineProperty(wrapped, `name`, {value: mode.name, writable: false});
    return wrapped;
};

const modes = [
    wrap(0, album),
    wrap(1, artist),
    wrap(2, chart),
    //genre,
    wrap(3, playlist),
    wrap(4, radio),
    wrap(5, track)
];

let current = -1;

import {table} from "./table/configuration.js";

const load = (mode) => {
    if (current !== -1 && !table.isChecked()) {
        const previous = modes[current];
        if (!confirm(`Are you sure you want to load the '${mode.name}' without finishing the '${previous.name}'?`)) {
            return;
        } else {
            table.check();
        }
    }

    spinner.start();
    spinner.markProgressBy(100, 80);
    return mode()
        //tour.name = `${tour.name} [${current + 1}/${modes.length}]`;
        .then(tour => table.load(tour))
        .catch(error => console.error(error))
        .finally(() => spinner.stop());
};

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    load(previous(current, modes));
});
rightElement.addEventListener(`click`, () => {
    load(next(current, modes));
});

console.log(`app loaded`);