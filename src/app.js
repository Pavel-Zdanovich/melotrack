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
            load(() => {
                current = index;
                return mode();
            });
        });
        return () => {
            current = index;
            return mode()
                .then((tour) => {
                    router.set(`${mode.name}`);
                    return tour;
                });
        };
    }

    if (mode.name === `track`) {
        router.addEventListener(`track`, (e) => {
            const ids = e.detail.parameters[`id`];
            load(() => {
                current = index;
                return mode(ids);
            });
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
        return () => {
            current = index;
            return mode(ids)
                .then((tour) => {
                    const urlSearchParams = new URLSearchParams();
                    for (let id of ids) {
                        urlSearchParams.append(`id`, id);
                    }
                    router.set(`track?${urlSearchParams}`);
                    return tour;
                });
        };
    }

    router.addEventListener(`${mode.name}/*`, (e) => {
        const [modeName, id] = e.detail.paths;
        load(() => {
            current = index;
            return mode(id);
        });
    });
    const getId = () => {
        const modeData = data[mode.name];
        return modeData[Math.floor(Math.random() * modeData.length)];
    }
    const id = getId();
    return () => {
        current = index;
        return mode(id)
            .then((tour) => {
                router.set(`${mode.name}/${id}`);
                return tour;
            });
    };
}

const modes = [
    wrap(0, album),
    wrap(1, artist),
    wrap(2, chart),
    //genre,
    wrap(3, playlist),
    wrap(4, radio),
    wrap(5, track)
]

let current = -1;

const indexElement = document.body.children[0].children[0];

const load = (mode) => {
    spinner.start();
    spinner.markProgressBy(100, 80);
    return mode()
        .then((tour) => {
            spinner.stop();
            indexElement.innerHTML = `${tour.name} [${current + 1}/${modes.length}]`;
            document.dispatchEvent(new CustomEvent(`tour`, {detail: tour}));
            document.documentElement.style.setProperty(`--background-color`, tour.background);
            document.documentElement.style.setProperty(`--border-color`, tour.border);
            document.documentElement.style.setProperty(`--transparent-color`, tour.transparent);
        }, (error) => {
            spinner.stop();
            console.log(error); //TODO tour not found
        }).catch(error => {
            spinner.stop();
            console.log(error);
        });
};

indexElement.addEventListener(`click`, () => {
    load(modes[current]);
});

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    const mode = previous(current, modes);
    current--;
    load(mode);
});
rightElement.addEventListener(`click`, () => {
    const mode = next(current, modes);
    current++;
    load(mode);
});

console.log(`app loaded`);