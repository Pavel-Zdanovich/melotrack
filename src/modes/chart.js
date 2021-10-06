import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

export const chart = (DZ, data, markProgressBy) => {
    markProgressBy(15);
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    DZ.api(`/chart`, (chart) => {
        markProgressBy(85);
        outsideResolve(new Tour(`Chart`, `Guess the artists and titles from chart.`, 60000, `purple`, `yellow`, [`artist`, `title`], chart.tracks.data.map(json => Track.parse(json))));
    });
    return promise;
};