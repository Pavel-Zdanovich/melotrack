import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {spinner} from "../utils/spinner.js";

export const chart = (DZ, data) => {
    spinner.start();
    spinner.markProgressBy(100, 75);
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    promise.then(() => spinner.stop());
    DZ.api(`/chart`, (chart) => {
        outsideResolve(
            new Tour(
                `Chart`,
                `Guess the artists and titles from chart.`,
                60000,
                `purple`,
                `yellow`,
                [`artist`, `title`],
                chart.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });
    return promise;
};