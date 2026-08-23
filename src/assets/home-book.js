(() => {
  "use strict";

  const book = document.querySelector("[data-book]");
  if (!book) return;

  const spreads = [...book.querySelectorAll("[data-spread]")];
  const pages = book.querySelector("[data-book-pages]");
  const previous = book.querySelector("[data-book-previous]");
  const next = book.querySelector("[data-book-next]");
  const open = book.querySelector("[data-book-open]");
  const label = book.querySelector("[data-book-label]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let turning = false;
  let drag = null;
  let pendingDirection = 0;

  book.classList.add("is-enhanced");

  function updateControls() {
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === spreads.length - 1;
    label.textContent = `${spreads[activeIndex].dataset.spreadLabel}, spread ${activeIndex + 1} of ${spreads.length}`;
  }

  function showOnly(index) {
    spreads.forEach((spread, spreadIndex) => {
      const isActive = spreadIndex === index;
      spread.hidden = !isActive;
      spread.classList.toggle("is-active", isActive);
      spread.setAttribute("aria-hidden", String(!isActive));
    });
    activeIndex = index;
    updateControls();
  }

  function cleanTurn(spread) {
    spread.classList.remove(
      "is-exiting-next",
      "is-exiting-previous",
      "is-entering-next",
      "is-entering-previous"
    );
  }

  function turn(direction) {
    if (turning) {
      pendingDirection = direction;
      return;
    }
    const destination = activeIndex + direction;
    if (destination < 0 || destination >= spreads.length) return;

    const outgoing = spreads[activeIndex];
    const incoming = spreads[destination];
    const directionName = direction > 0 ? "next" : "previous";

    if (reducedMotion.matches) {
      showOnly(destination);
      return;
    }

    turning = true;
    pages.classList.remove("is-dragging-next", "is-dragging-previous");
    pages.style.removeProperty("--drag-progress");
    incoming.hidden = false;
    incoming.setAttribute("aria-hidden", "false");
    incoming.classList.add(`is-entering-${directionName}`);
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.classList.add(`is-exiting-${directionName}`);
    book.classList.add("is-turning");

    window.setTimeout(() => {
      cleanTurn(outgoing);
      cleanTurn(incoming);
      outgoing.hidden = true;
      outgoing.classList.remove("is-active");
      incoming.classList.add("is-active");
      activeIndex = destination;
      turning = false;
      book.classList.remove("is-turning");
      updateControls();
      const queuedDirection = pendingDirection;
      pendingDirection = 0;
      if (queuedDirection) turn(queuedDirection);
    }, 720);
  }

  function endDrag(event) {
    if (!drag) return;
    const distance = event.clientX - drag.startX;
    const direction = distance < 0 ? 1 : -1;
    const shouldTurn = Math.abs(distance) > Math.min(92, pages.clientWidth * 0.16);
    drag = null;
    pages.releasePointerCapture?.(event.pointerId);
    pages.classList.remove("is-dragging-next", "is-dragging-previous");
    pages.style.removeProperty("--drag-progress");
    if (shouldTurn) turn(direction);
  }

  previous.addEventListener("click", () => turn(-1));
  next.addEventListener("click", () => turn(1));
  open?.addEventListener("click", () => turn(1));

  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement
      && (target.matches("input, textarea, select") || target.isContentEditable)) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      turn(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      turn(1);
    }
  });

  pages.addEventListener("pointerdown", (event) => {
    if (turning || event.button !== 0 || event.target.closest("a, button")) return;
    drag = { startX: event.clientX, pointerId: event.pointerId };
    pages.setPointerCapture(event.pointerId);
  });

  pages.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const distance = event.clientX - drag.startX;
    const directionName = distance < 0 ? "next" : "previous";
    const unavailable = (directionName === "next" && activeIndex === spreads.length - 1)
      || (directionName === "previous" && activeIndex === 0);
    const progress = unavailable ? 0 : Math.min(1, Math.abs(distance) / (pages.clientWidth * 0.45));
    pages.classList.toggle("is-dragging-next", directionName === "next");
    pages.classList.toggle("is-dragging-previous", directionName === "previous");
    pages.style.setProperty("--drag-progress", progress.toFixed(3));
  });

  pages.addEventListener("pointerup", endDrag);
  pages.addEventListener("pointercancel", () => {
    drag = null;
    pages.classList.remove("is-dragging-next", "is-dragging-previous");
    pages.style.removeProperty("--drag-progress");
  });

  showOnly(0);
})();
