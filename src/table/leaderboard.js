import {router} from "../utils/router.js";
import {Tour} from "../entities/tour.js";
import {table} from "./configuration.js";
import {get, pull} from "../utils/database.js";

router.addEventListener(`leaderboard`, () => {
    Promise.all([
        get(),
        pull()
    ]).then(([data, file]) => {
        console.log(data, file);
        //TODO if user result > one of leaders result, then push new leader
        //push(btoa(data1), data2.data.sha);

        table.output(
            new Tour(
                `Leaderboard`,
                ``,
                0,
                `#FFFF00`,
                `#000000`,
                [`name`, `score`],
                Object.entries(data.leader).map(([name, score]) => {
                    return {
                        name,
                        score
                    };
                })
            )
        );
    }).catch(error => console.error(error));
});