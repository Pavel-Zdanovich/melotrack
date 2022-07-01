import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {spinner} from "../utils/spinner.js";

export const artist = (DZ, data) => {
    spinner.start();
    spinner.markProgressBy(100, 75);
    const id = data.artists[Math.floor(Math.random() * data.artists.length)];
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    promise.then(() => spinner.stop());
    DZ.api(`/artist/${id}`, (artist) => {
        DZ.api(`/artist/${id}/top?limit=50`, (tracklist) => {
            outsideResolve(
                new Tour(
                    `Artist`,
                    `Guess the titles by "${artist.name}".`,
                    60000,
                    `#E4DDF4`,
                    `#2D2D2D`,
                    [`title`],
                    tracklist.data
                        .slice(0, 10) //TODO
                        .map(json => Track.parse(json))
                )
            );
        });
    });
    return promise;
};