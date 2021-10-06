let {throwError} = await import(`../utils/utils.js`);

export class Track {

    constructor(artist, title, url) {
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