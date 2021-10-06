import {throwError} from "../utils/utils.js";
import {Track} from "./track.js";

export class Tour {

    constructor(title, description, time, background, border, keys, tracks) {
        if (title != null && typeof title === `string`) {
            this.title = title;
        } else {
            throwError({title});
        }

        if (description != null && typeof description === `string`) {
            this.description = description;
        } else {
            throwError({description});
        }

        if (time != null && typeof time === `number`) {
            this.time = time;
        } else {
            throwError({time});
        }

        if (background != null && typeof background === `string`) {
            this.background = background;
        } else {
            throwError({background});
        }

        if (border != null && typeof border === `string`) {
            this.border = border;
        } else {
            throwError({border});
        }

        if (keys != null && keys instanceof Array) {
            this.keys = keys;
        } else {
            throwError({keys});
        }

        if (tracks != null && tracks instanceof Array) {
            this.tracks = tracks;
        } else {
            throwError({tracks});
        }
    }

    static parse(json) {
        if (json == null) {
            throwError({json});
        }

        return new Tour(json.title, json.description, json.time, json.keys, json.tracks.map(track => Track.parse(track)));
    }
}