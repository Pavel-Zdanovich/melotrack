import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

export const genre = (DZ, data, markProgressBy) => {
    markProgressBy(15);
    const id = 10000000 + Math.floor(Math.random() * 1000000);
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    DZ.api(`/genre/${id}`, (playlist) => {
        markProgressBy(50);
        outsideResolve(new Tour(`Playlist`, `Guess the artists and titles from playlist "${playlist.title}".`, 60000, `yellow`, `green`, [`artist`, `title`], playlist.tracks.data.map(json => Track.parse(json))));
    });
    return promise;
};