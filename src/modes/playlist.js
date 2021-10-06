import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

export const playlist = (DZ, data, markProgressBy) => {
    markProgressBy(15);
    const id = data.playlists[Math.floor(Math.random() * data.playlists.length)];  //TODO get a unique set
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    DZ.api(`/playlist/${id}`, (playlist) => {
        markProgressBy(85);
        outsideResolve(new Tour(`Playlist`, `Guess the artists and titles from playlist "${playlist.title}".`, 60000, `red`, `green`, [`artist`, `title`], playlist.tracks.data.map(json => Track.parse(json))));
    });
    return promise;
};