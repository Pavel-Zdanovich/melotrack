import {throwError} from "../utils/utils.js";

export class Track {

    constructor(id, artist, title, url) {
        if (id != null && typeof id === `string`) {
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

        this._buffer = null;
        this._start = 0;
        this._end = 0;
        this._direction = true;
        this._duration = 0;
    }

    static parse(json) {
        if (json == null) {
            throwError({json});
        }

        return new Track(json.id.toString(), json.artist.name, json.title, json.preview);
    }

    getBuffer() {
        return this._buffer;
    }

    setBuffer(buffer) {
        if (buffer instanceof AudioBuffer) {
            this._buffer = buffer;
            this._start = 0;
            this._end = Math.trunc(buffer.duration * 1000);
            this._direction = true;
            this._duration = this._end;
        } else {
            throwError({buffer});
        }
    }

    getDirection() {
        return this._direction;
    }

    getStart() {
        return this._start;
    }

    getEnd() {
        return this._end;
    }

    getDuration() {
        return this._duration;
    }

    toString() {
        return `${this.artist} - ${this.title}`;
    }
}