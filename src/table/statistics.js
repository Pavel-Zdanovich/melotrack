import {router} from "../utils/router.js";
import {Tour} from "../entities/tour.js";
import {table} from "./configuration.js";

router.addEventListener(`statistics`, () => {
    const map = new Map([
        [`Album`, 0],
        [`Artist`, 0],
        [`Chart`, 0],
        [`Playlist`, 0],
        [`Radio`, 0],
        [`Track`, 0]
    ]);
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        const mode = key.split(`.`)[0];
        //console.log(mode);
        const total = map.get(mode);
        if (total) {
            //console.log(total);
            const result = parseInt(window.localStorage.getItem(key));
            //console.log(result);
            map.set(mode, total + result);
        }
    }
    const keys = Array.from(map.keys());

    table.output(
        new Tour(
            `Statistics`,
            ``,
            0,
            `#00FFFF`,
            `#5B5B5B`,
            [`mode`, `score`],
            Array.from(map.entries())
                .filter(entry => keys.includes(entry[0]))
                .map(entry => {
                    return {
                        mode: entry[0],
                        score: entry[1]
                    };
                })
        )
    );
});