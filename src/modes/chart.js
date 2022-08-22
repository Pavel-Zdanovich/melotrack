import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {image, promisify} from "../utils/utils.js";

export const chart = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/chart`, (chart) => {
        if (chart !== null && chart.hasOwnProperty(`error`)) {
            reject(chart);
            return;
        }

        const descriptionElement = document.createElement(`div`);
        const containerElement = document.createElement(`div`);
        for (const track of chart.tracks.data) {
            let src;
            if (Math.round(Math.random())) {
                src = track.album.cover_big;
            } else {
                src = track.artist.picture_big;
            }
            const imageElement = image(src);
            containerElement.appendChild(imageElement);
        }
        descriptionElement.appendChild(containerElement);
        descriptionElement.innerHTML = descriptionElement.innerHTML + `Guess the artists and titles from chart.`;

        resolve(
            new Tour(
                `Chart`,
                descriptionElement.innerHTML,
                60000,
                `#F6EBF4`,
                `#ED0B70`,
                [`artist`, `title`],
                chart.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });

    return promise;
};