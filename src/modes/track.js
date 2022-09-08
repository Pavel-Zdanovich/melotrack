import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {image, promisify, random} from "../utils/utils.js";

const letters = `0123456789ABCDEF`;

const randomColor = () => {
    let color = `#`;
    for (let i = 0; i < 6; i++) {
        color += random(letters);
    }
    return color;
};

export const track = async (ids) => {
    const [promise, resolve, reject] = promisify();

    const tracks = [];
    for (const id of ids) {
        tracks.push(
            new Promise(
                (resolve, reject) => {
                    DZ.api(`/track/${id}`, (track) => {
                            if (track !== null && track.hasOwnProperty(`error`)) {
                                reject(track);
                                return;
                            }

                            let src;
                            if (Math.round(Math.random())) {
                                src = track.album.cover_big;
                            } else {
                                src = track.artist.picture_big;
                            }

                            resolve({src, track: Track.parse(track)});
                        }
                    );
                }
            )
        );
    }

    Promise.all(tracks).then((tracks) => {
        const descriptionElement = document.createElement(`div`);
        const containerElement = document.createElement(`div`);
        for (const img of tracks) {
            const imageElement = image(img.src);
            containerElement.appendChild(imageElement);
        }
        descriptionElement.appendChild(containerElement);
        descriptionElement.innerHTML = descriptionElement.innerHTML + `Guess random artists and titles.`;

        resolve(
            new Tour(
                `Track`,
                descriptionElement.innerHTML,
                60000,
                randomColor(),
                randomColor(),
                [`artist`, `title`],
                tracks.map(track => track.track)
            )
        );
    }, error => reject(error));

    return promise;
};