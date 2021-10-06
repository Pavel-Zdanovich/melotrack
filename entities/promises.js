console.log(`start`);

let promise1 = new Promise(resolve => {
    setTimeout(() => resolve(`serial`), 3000);
});

let callback = null;

promise1 = promise1.then(value => {
    console.log(`${value} 1`);

    callback();

    return value;
});

callback = () => setTimeout(() => {
    promise1.then(value => {
        console.log(`${value} 2`);
    });
}, 3000);

/*let promise2 = new Promise(resolve => resolve(`parallel`));

promise2.then(value => {
    setTimeout(() => {
        console.log(value);
    }, 3000);
});

promise2.then(value => {
    setTimeout(() => {
        console.log(value);
    }, 3000);
});*/
