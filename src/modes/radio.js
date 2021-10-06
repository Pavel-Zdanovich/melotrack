import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

export const radio = (DZ, data, markProgressBy) => {
    markProgressBy(15);
    const id = data.radios[Math.floor(Math.random() * data.radios.length)];  //TODO get a unique set
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    DZ.api(`/radio/${id}`, (radio) => {
        markProgressBy(35);
        DZ.api(`/radio/${id}/tracks`, (tracks) => {
            markProgressBy(50);
            outsideResolve(new Tour(`Radio`, `Guess the artists and titles from radio "${radio.title}".`, 60000, `orange`, `blue`, [`artist`, `title`], tracks.data.map(json => Track.parse(json))));
        });
    });
    return promise;
};