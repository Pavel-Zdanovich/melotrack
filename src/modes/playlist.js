import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {spinner} from "../utils/spinner.js";

export const playlist = (DZ, data) => {
    spinner.start();
    spinner.markProgressBy(100, 75);
    const id = data.playlists[Math.floor(Math.random() * data.playlists.length)];
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    promise.then(() => spinner.stop());
    DZ.api(`/playlist/${id}`, (playlist) => {
        outsideResolve(
            new Tour(
                `Playlist`,
                `Guess the artists and titles from playlist "${playlist.title}".`,
                60000,
                `#FAE5DF`,
                `#303179`,
                [`artist`, `title`],
                playlist.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });
    return promise;
};