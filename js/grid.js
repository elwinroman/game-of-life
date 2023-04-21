import { CELL_SIZE, COLOR } from './config.js'

export default class Grid {
   constructor(containerCanvas) {
      this.canvas = document.getElementById('canvas')
      
      this.ctx = this.canvas.getContext('2d')
      this.canvas.width  = containerCanvas.clientWidth - 1
      this.canvas.height = containerCanvas.clientHeight - 1
      this.cellSize = CELL_SIZE

      this.left = -Math.ceil(this.canvas.width / this.cellSize) * this.cellSize + 0.5
      this.top = -Math.ceil(this.canvas.height / this.cellSize) * this.cellSize + 0.5
      this.right = this.ctx.canvas.width * 2
      this.bottom = this.ctx.canvas.width * 2

      this.center = {
         row: Math.ceil(Math.ceil(this.canvas.height / this.cellSize) / 2),
         col: Math.ceil(Math.ceil(this.canvas.width / this.cellSize) / 2)
      }

      this.border = 1
      this.gridlineColor = COLOR.gridline
   }

   // Dibuja la cuadricula en el canvas (cada vez que es invocado, resetea el lienzo)
   draw() {
      this.ctx.beginPath()
      this.ctx.clearRect(this.left, this.top, this.right - this.left, this.bottom - this.top)
      
      // lineas verticales (columnas)
      for (let x=this.left; x<this.right; x+=this.cellSize) {
         this.ctx.moveTo(x, this.top)
         this.ctx.lineTo(x, this.bottom)
      }
      
      // lineas horizontales (filas)
      for (let y=this.top; y<this.bottom; y+=this.cellSize) {
         this.ctx.moveTo(this.left, y)
         this.ctx.lineTo(this.right, y)
      }
      this.ctx.strokeStyle = this.gridlineColor
      this.ctx.lineWidth = 0.5
      this.ctx.stroke()
   }

   paintCell(pos) {
      this.ctx.fillStyle = COLOR.alive_cell
      this._fillSquare(pos)
   }

   _fillSquare(pos) {
      this.ctx.fillRect(
         pos.col * this.cellSize + this.border, pos.row * this.cellSize + this.border,
         this.cellSize - this.border, this.cellSize - this.border
      )
   }

   unpaintCell(pos) {
      this.ctx.fillStyle = COLOR.background
      this._fillSquare(pos)
   }

   paintAllAliveCells(aliveCells) {
      this.ctx.fillStyle = COLOR.alive_cell
      for (let cell of aliveCells)
         this._fillSquare(cell)
   }

   recalculate(containerCanvas) {
      this.canvas.width = containerCanvas.clientWidth - 1
      this.canvas.height = containerCanvas.clientHeight - 1
      this.left = -Math.ceil(this.canvas.width / this.cellSize) * this.cellSize + 0.5
      this.top = -Math.ceil(this.canvas.height / this.cellSize) * this.cellSize + 0.5
      this.right = this.canvas.width * 2
      this.bottom = this.canvas.height * 2
   }
}
