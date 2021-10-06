import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

export const artist = (DZ, data, markProgressBy) => {
    markProgressBy(15);
    const id = data.artists[Math.floor(Math.random() * data.artists.length)];  //TODO get a unique set
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    DZ.api(`/artist/${id}`, (artist) => {
        DZ.api(`/artist/${id}/top?limit=50`, (tracklist) => {
            markProgressBy(85);
            outsideResolve(new Tour(`Artist`, `Guess the titles by "${artist.name}".`, 60000, `blue`, `orange`, [`title`], tracklist.data.map(json => Track.parse(json))));
        });
    });
    return promise;
};