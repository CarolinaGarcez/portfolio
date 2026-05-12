export function startStatusRotation(list, element) {
  let index = 0;

  setInterval(() => {
    element.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % list.length;
      element.textContent = list[index];
      element.style.opacity = 1;
    }, 400);

  }, 3000);
}