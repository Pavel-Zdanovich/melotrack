import {router} from "../utils/router.js";
import {Tour} from "../entities/tour.js";
import {table} from "./configuration.js";

router.addEventListener(`leaderboard`, () => {
    table.output(
        new Tour(
            `Leaderboard`,
            ``,
            0,
            `#FFFF00`,
            `#000000`,
            [`username`, `score`],
            [
                {
                    username: `Zdan`,
                    score: `∞`
                }
            ]
        )
    );
});