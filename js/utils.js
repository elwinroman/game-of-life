export function getMousePos(e) {
   var rect = canvas.getBoundingClientRect();

   return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
   }
}
