/**
 * Close a portaled popover after the current pointer gesture ends so the list
 * is not unmounted mid-click (which can "click through" onto controls beneath).
 * Falls back to a short timeout for keyboard select (Enter) where no pointerup fires.
 */
export function closeAfterPointerUp(close: () => void) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    document.removeEventListener("pointerup", finish, true);
    document.removeEventListener("pointercancel", finish, true);
    window.clearTimeout(timeoutId);
    close();
  };

  document.addEventListener("pointerup", finish, true);
  document.addEventListener("pointercancel", finish, true);
  const timeoutId = window.setTimeout(finish, 100);
}
