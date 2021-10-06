export class Validator {

    static similarity(expected, actual) {
        let longer = expected;
        let shorter = actual;
        if (expected.length < actual.length) {
            longer = actual;
            shorter = expected;
        }
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.#editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    static #editDistance(string1, string2) {
        string1 = string1.toLowerCase();
        string2 = string2.toLowerCase();

        const costs = [];
        for (let i = 0; i <= string1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= string2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (string1.charAt(i - 1) !== string2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[string2.length] = lastValue;
            }
        }
        return costs[string2.length];
    }
}