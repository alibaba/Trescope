export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export const voidOperate = () => undefined;

export function makeRandomString(length) {
    let result = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++)
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    return result;
}


export function copyTextToClipboard(text, whenSuccess, whenFail) {
    function _fallbackCopyTextToClipboard(text, whenSuccess, whenFail) {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) whenSuccess(); else whenFail();
        } catch (err) {
            whenFail(err);
        }

        document.body.removeChild(textArea);
    }

    if (!navigator.clipboard) {
        _fallbackCopyTextToClipboard(text, whenSuccess, whenFail);
        return;
    }
    navigator.clipboard.writeText(text).then(whenSuccess, whenFail);
}

export function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
