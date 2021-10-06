import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {spinner} from "../utils/spinner.js";

export const album = (DZ, data) => {
    spinner.start();
    spinner.markProgressBy(100, 75);
    const id = data.albums[Math.floor(Math.random() * data.albums.length)];
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    promise.then(() => spinner.stop());
    DZ.api(`/album/${id}`, (album) => {
        outsideResolve(
            new Tour(
                `Album`,
                `Guess the titles from album "${album.title}".`,
                60000,
                `black`,
                `white`,
                [`title`],
                album.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });
    return promise;
};