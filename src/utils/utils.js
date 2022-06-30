export function promisify() {
    let resolve, reject;
    const promise = new Promise((innerResolve, innerReject) => {
        resolve = innerResolve;
        reject = innerReject;
    });
    return [promise, resolve, reject];
}

function check(index, array) {
    if (array.constructor !== Array) {
        throwError({array});
    }

    if (typeof index !== `number`) {
        throwError({index});
    }
}

export function current(index, array) {
    check(index, array);
    if (index < 0 || index >= array.length) {
        throwError({index});
    }
    return array[index];
}

export function next(index, array) {
    check(index, array);
    if (index < array.length - 1) {
        return array[index + 1];
    } else {
        return array[0];
    }
}

export function previous(index, array) {
    check(index, array);
    if (index > 0) {
        return array[index - 1];
    } else {
        return array[array.length - 1];
    }
}

export function throwError(variable) {
    const name = Object.keys(variable)[0];
    const value = variable[name];
    throw new Error(`Illegal ${name}: ${value}`);
}

export function outputFullTime(hours, mins, secs, millis) {
    let hh = hours;
    if (hours < 10) {
        hh = `0` + hours;
    }
    let mm = mins;
    if (mins < 10) {
        mm = `0` + mins;
    }
    let ss = secs;
    if (secs < 10) {
        ss = `0` + secs;
    }
    let s = Math.trunc(millis);
    if (millis < 10) {
        s = `00` + millis;
    } else {
        if (millis < 100) {
            s = `0` + millis;
        }
    }
    return `${hh}:${mm}:${ss}.${s}`;
}

export function outputHoursAndMins(hours, mins, secs, millis) {
    let hh = hours;
    if (hours < 10) {
        hh = `0` + hours;
    }
    let mm = mins;
    if (mins < 10) {
        mm = `0` + mins;
    }
    return `${hh}:${mm}`;
}

export function outputHoursMinsAndSecs(hours, mins, secs, millis) {
    let hh = hours;
    if (hours < 10) {
        hh = `0` + hours;
    }
    let mm = mins;
    if (mins < 10) {
        mm = `0` + mins;
    }
    let ss = secs;
    if (secs < 10) {
        ss = `0` + secs;
    }
    return `${hh}:${mm}:${ss}`;
}

export function outputMinsAndSecs(hours, mins, secs, millis) {
    let mm = mins;
    if (mins < 10) {
        mm = `0` + mins;
    }
    let ss = secs;
    if (secs < 10) {
        ss = `0` + secs;
    }
    return `${mm}:${ss}`;
}

export function outputMinsSecsAndMillis(hours, mins, secs, millis) {
    let mm = mins;
    if (mins < 10) {
        mm = `0` + mins;
    }
    let ss = secs;
    if (secs < 10) {
        ss = `0` + secs;
    }
    let s = Math.trunc(millis);
    if (millis < 10) {
        s = `00` + millis;
    } else {
        if (millis < 100) {
            s = `0` + millis;
        }
    }
    return `${mm}:${ss}.${s}`;
}