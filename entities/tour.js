let {throwError} = await import(`../utils/utils.js`);

export class Tour {

    constructor(title, description, tracks) {
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
}