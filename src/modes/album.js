import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

export const album = (DZ, data, markProgressBy) => {
    markProgressBy(15);
    const id = data.albums[Math.floor(Math.random() * data.albums.length)];  //TODO get a unique set
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    DZ.api(`/album/${id}`, (album) => {
        markProgressBy(85);
        outsideResolve(new Tour(`Album`, `Guess the titles from album "${album.title}".`, 60000, `black`, `white`, [`title`], album.tracks.data.map(json => Track.parse(json))));
    });
    return promise;
};