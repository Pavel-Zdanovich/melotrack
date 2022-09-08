import {throwError} from "../utils/utils.js";

export class Track {

    constructor(id, artist, title, url) {
        if (typeof id === `string`) {
            this.id = id;
        } else {
            throwError({id});
        }

        if (typeof artist === `string`) {
            this.artist = artist;
        } else {
            throwError({artist});
        }

        if (typeof title === `string`) {
            this.title = title;
        } else {
            throwError({title});
        }

        if (typeof url === `string`) {
            this.url = url;
        } else {
            throwError({url});
        }

        this._buffer = null;
        this._duration = 0;
        this._start = 0;
        this._end = 0;
        this._rate = 1;
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
            this._duration = this._buffer.duration * 1000;
            this._start = 0;
            this._end = this._duration;
        } else {
            throwError({buffer});
        }
    }

    getDuration() {
        return this._duration;
    }

    getStart() {
        return this._start;
    }

    setStart(start) {
        if (this._buffer instanceof AudioBuffer && (start >= 0 && start <= this._duration)) {
            this._start = start;
        } else {
            throwError({start});
        }
    }

    getEnd() {
        return this._end;
    }

    setEnd(end) {
        if (this._buffer instanceof AudioBuffer && (end >= 0 && end <= this._duration)) {
            this._end = end;
        } else {
            throwError({end});
        }
    }

    getDirection() {
        return this._end > this._start;
    }

    getRate() {
        return this._rate;
    }

    setRate(rate) {
        if (typeof rate === `number` && (rate > 0 && rate <= 2)) {
            this._rate = rate;
        } else {
            throwError({rate});
        }
    }
}