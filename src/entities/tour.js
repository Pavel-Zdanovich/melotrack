import {throwError} from "../utils/utils.js";

export class Tour {

    constructor(name, description, time, background, border, keys, tracks) {
        if (typeof name === `string`) {
            this.name = name;
        } else {
            throwError({name});
        }

        if (typeof description === `string`) {
            this.description = description;
        } else {
            throwError({description});
        }

        if (typeof time === `number`) {
            this.time = time;
        } else {
            throwError({time});
        }

        if (typeof background === `string`) {
            this.background = background;
        } else {
            throwError({background});
        }

        if (typeof border === `string`) {
            this.border = border;
            this.transparent = `${border}40`;
        } else {
            throwError({border});
        }

        if (keys != null && keys instanceof Array && typeof keys[0] === 'string') {
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
}