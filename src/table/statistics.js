import {router} from "../utils/router.js";
import {Tour} from "../entities/tour.js";
import {table} from "./configuration.js";

router.addEventListener(`statistics`, () => {
    const tours = [
        `Melotrack`,
        `Album`,
        `Artist`,
        `Chart`,
        `Playlist`,
        `Radio`,
        `Track`,
    ];

    table.output(
        new Tour(
            `Statistics`,
            ``,
            0,
            `#00FFFF`,
            `#5B5B5B`,
            [`mode`, `score`],
            tours.map(tour => {
                const score = window.localStorage.getItem(tour);
                return {
                    mode: tour,
                    score: score ? score : 0
                };
            })
        )
    );
});