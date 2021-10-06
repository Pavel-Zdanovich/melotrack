let {throwError} = await import(`../utils/utils.js`);

export class Track {

    constructor(id, artist, title, url) {
        if (id != null && typeof id === `number`) {
            this.id = id;
        } else {
            throwError({id});
        }

        if (artist != null && typeof artist === `string`) {
            this.artist = artist;
        } else {
            throwError({artist});
        }

        if (title != null && typeof title === `string`) {
            this.title = title;
        } else {
            throwError({title});
        }

        if (url != null && typeof url === `string`) {
            this.url = url;
        } else {
            throwError({url});
        }
    }
}