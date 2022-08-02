import {throwError} from "../utils/utils.js";
import {Node, Tree} from "./tree.js";

export class Validator {

    /**
     * Compares expected and actual strings using a custom algorithm
     * based on an approximate string comparison and a variant tree
     */
    constructor(expected, actual) {
        if (typeof expected === `string` && expected.length !== 0) {
            this.expected = expected.trim().toLowerCase();
        } else {
            throwError({expected});
        }

        if (typeof actual === `string`) {
            this.actual = actual.trim().toLowerCase();
        } else {
            throwError({actual});
        }

        this.tree = new Tree(actual);
    }

    similarity() {
        if (this.actual === this.expected) {
            return 1;
        }

        const expectedChars = this.expected.split(``);
        const actualChars = this.actual.split(``);
        if (
            this.actual.length === 0 ||
            actualChars.filter(char => expectedChars.includes(char)).length < this.expected.length / 3
        ) {
            return 0;
        }

        this.#recursion(this.tree.get(),0, this.actual, 0);
        //console.log(this.tree);
        const node = this.tree.find(this.expected);
        //console.log(node);
        let count = 0;
        (function recursion(child) {
            if (child) {
                count++;
                recursion(child.parent);
            }
        })(node.parent);
        //console.log(count);
        return (this.expected.length - count) / this.expected.length;
    }

    #recursion(parent, expectedIndex, actual, actualIndex) {
        if (actual !== this.expected) {
            //console.log(`[${expectedIndex}] actual = '${actual}', actualIndex = ${actualIndex}`);
            let expectedChar = this.expected[expectedIndex];
            let actualChar = actual[actualIndex];
            if (actualChar) {
                //console.log(`'${actualChar}' ${actualChar === expectedChar ? `=` : `!=`} '${expectedChar}'`);
                if (actualChar === expectedChar) {
                    this.#recursion(parent, expectedIndex + 1, actual, actualIndex + 1);
                    return;
                }

                if (actualIndex < this.actual.length) {
                    const deleted = actual.slice(0, actualIndex) + actual.slice(actualIndex + 1);
                    //console.log(`del '${actual}' - '${actualChar}' = '${deleted}'`);
                    const child = new Node(deleted);
                    parent.add(child);
                    this.#recursion(child, expectedIndex, deleted, actualIndex);
                }
            }

            if (actualIndex < this.expected.length) {
                const added = actual.slice(0, actualIndex) + expectedChar + actual.slice(actualIndex);
                //console.log(`add '${actual.slice(0, actualIndex)}' + '${expectedChar}' + '${actual.slice(actualIndex)}'`);
                const child = new Node(added);
                parent.add(child);
                this.#recursion(child, expectedIndex + 1, added, actualIndex + 1);
            }
        } else {
            //console.log(`'${actual}' = '${this.expected}'`);
        }
    }
}