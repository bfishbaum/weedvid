export const goToFN = (url) => () => {
    window.location.href = url;
}

export const replaceFN = (url) => () => {
    window.location.replace = url;
}
