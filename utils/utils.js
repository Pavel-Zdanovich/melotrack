export function throwError(variable) {
    let name = Object.keys(variable)[0];
    let value = variable[name];
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