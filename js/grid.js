import { CELL_SIZE } from './config.js'

export function draw(ctx, n_lines) {
   ctx.beginPath()
   let x = 0.5, y = 0.5

   // lineas verticales (columnas)
   for (let i=0; i<n_lines.column; i++) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ctx.canvas.height)
      x = x + CELL_SIZE
   }
   
   // lineas horizontales (filas)
   for (let i=0; i<n_lines.row; i++) {
      ctx.moveTo(0, y)
      ctx.lineTo(ctx.canvas.width, y)
      y = y + CELL_SIZE
   }
   ctx.stroke();
}

export function paintCell(ctx, pos, color) {
   ctx.fillStyle = color
   ctx.fillRect(
      pos.column * CELL_SIZE + 1, pos.row * CELL_SIZE + 1, 
      CELL_SIZE - 1, CELL_SIZE - 1
   )  
}
