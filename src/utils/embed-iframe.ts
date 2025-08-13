export function createIframe(container: string | HTMLElement, src: string) {
  const containerEl =
    typeof container === "string"
      ? document.querySelector(container)
      : container instanceof HTMLElement
      ? container
      : null;

  if (!containerEl) throw new Error("Container not found");

  // Clear previous iframe to avoid duplicates
  containerEl.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.width = "100%";
  iframe.style.border = "none";
  iframe.style.display = "block";
  iframe.setAttribute("scrolling", "no");

  window.addEventListener("message", (event) => {
    if (event.data?.type === "IFRAME_HEIGHT") {
      iframe.style.height = event.data.height + "px";
    }
  });

  containerEl.appendChild(iframe);
}
