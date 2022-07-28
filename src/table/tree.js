export class Node {

    constructor(data) {
        this.data = data;
        this.parent = null;
        this.children = [];
    }

    add(node) {
        node.parent = this;
        this.children.push(node);
    }
}

export class Tree {

    constructor(data) {
        this._root = new Node(data);
    }

    get() {
        return this._root;
    }

    find(data, children = this._root.children) {
        if (children.length === 0) {
            return;
        }
        let childs = [];
        for (const child of children) {
            if (child.data === data) {
                return child;
            } else {
                childs = childs.concat(child.children);
            }
        }
        return this.find(data, childs);
    }
}