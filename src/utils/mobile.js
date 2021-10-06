let userAgent = navigator.userAgent || navigator.vendor || window.opera;
let os;

// Windows Phone must come first because its UA also contains "Android"
if (/windows phone/i.test(userAgent)) {
    os = `winphone`;
}

if (/android/i.test(userAgent)) {
    os = `android`;
}

// iOS detection from: http://stackoverflow.com/a/9039885/177710
if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    os = `ios`;
}

document.addEventListener(`readystatechange`, () => {
    if (os === `ios`) {
        `focus blur`.split(` `).forEach(type =>
            document.addEventListener(type, (e) => {
                onKeyboard(e.type === `focus`);
            })
        );
    } else {
        let initialHeight = window.innerHeight;

        `resize orientationchange`.split(` `).forEach(type =>
            window.addEventListener(type, (e) => {
                onKeyboard(window.innerHeight < initialHeight); //TODO on resize desktop browser
            })
        );
    }
});

let footerElement = document.body.children[4];

function onKeyboard(isOpen) {
    if (isOpen) {
        footerElement.classList.remove(`fixed`);
    } else {
        footerElement.classList.add(`fixed`);
    }
}