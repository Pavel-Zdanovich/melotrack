import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {promisify} from "../utils/utils.js";

export const chart = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/chart`, (chart) => {
        if (chart !== null && chart.hasOwnProperty(`error`)) {
            reject(chart);
            return;
        }
        resolve(
            new Tour(
                `Chart`,
                `Guess the artists and titles from chart.`,
                60000,
                `#F6EBF4`,
                `#ED0B70`,
                [`artist`, `title`],
                chart.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });

    return promise;
};