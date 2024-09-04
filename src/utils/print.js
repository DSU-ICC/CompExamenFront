export const printElement = (selector) => {
    const element = document.querySelector(selector)
    element.classList.add("print")

    window.print()

    window.addEventListener("afterprint", () => {
        element.classList.remove("print")
    })
}