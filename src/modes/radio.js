import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {spinner} from "../utils/spinner.js";

export const radio = (DZ, data) => {
    spinner.start();
    spinner.markProgressBy(25);
    const id = data.radios[Math.floor(Math.random() * data.radios.length)];
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    promise.then(() => spinner.stop());
    DZ.api(`/radio/${id}`, (radio) => {
        spinner.markProgressBy(37.5);
        DZ.api(`/radio/${id}/tracks`, (tracks) => {
            spinner.markProgressBy(37.5);
            outsideResolve(
                new Tour(
                    `Radio`,
                    `Guess the artists and titles from radio "${radio.title}".`,
                    60000,
                    `orange`,
                    `blue`,
                    [`artist`, `title`],
                    tracks.data
                        .slice(0, 10) //TODO
                        .map(json => Track.parse(json))
                )
            );
        });
    });
    return promise;
};