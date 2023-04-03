import { CELL_SIZE, CELL_COLOR_ACTIVE, CELL_COLOR_DEACTIVE } from './config.js'

export default class Grid {
   constructor(containerCanvas) {
      this._canvas = document.getElementById('canvas')
      
      this.ctx = this._canvas.getContext('2d')
      this._canvas.width  = containerCanvas.clientWidth - 1
      this._canvas.height = containerCanvas.clientHeight - 1
      this._cellSize = CELL_SIZE

      this._left = -Math.ceil(this._canvas.width / this._cellSize) * this._cellSize + 0.5
      this._top = -Math.ceil(this._canvas.height / this._cellSize) * this._cellSize + 0.5
      this._right = this.ctx.canvas.width * 2
      this._bottom = this.ctx.canvas.width * 2

      this._center = {
         row: Math.ceil(Math.ceil(this._canvas.height / this._cellSize) / 2),
         col: Math.ceil(Math.ceil(this._canvas.width / this._cellSize) / 2)
      }
   }

   draw() {
      this.ctx.beginPath()
      this.ctx.clearRect(this._left, this._top, this._right - this._left, this._bottom - this._top)
      
      // lineas verticales (columnas)
      for (let x=this._left; x<this._right; x+=this._cellSize) {
         this.ctx.moveTo(x, this._top)
         this.ctx.lineTo(x, this._bottom)
      }
      
      // lineas horizontales (filas)
      for (let y=this._top; y<this._bottom; y+=this._cellSize) {
         this.ctx.moveTo(this._left, y)
         this.ctx.lineTo(this._right, y)
      }
      // this.ctx.strokeStyle = '#434656'
      this.ctx.strokeStyle = '#9FADBD'
      this.ctx.lineWidth = 0.5
      this.ctx.stroke()
   }

   paintCell(pos) {
      this.ctx.fillStyle = CELL_COLOR_ACTIVE
      this._fillSquare(pos)
   }

   _fillSquare(pos) {
      this.ctx.fillRect(
         pos.col * this._cellSize + 1, pos.row * this._cellSize + 1, 
         this._cellSize - 1, this._cellSize - 1
      )
   }

   unpaintCell(pos) {
      this.ctx.fillStyle = CELL_COLOR_DEACTIVE
      this._fillSquare(pos)
   }

   paintAllActivatedCells(activatedCells) {
      this.ctx.fillStyle = CELL_COLOR_ACTIVE
      for (let cell of activatedCells)
         this._fillSquare(cell)
   }

   // Setters & getters
   set width(width)   { this._canvas.width = width }
   set height(height) { this._canvas.height = height }
   set left(left)     { this._left = left }
   set top(top)       { this._top = top }
   set right(right)   { this._right = right }
   set bottom(bottom) { this._bottom = bottom }
   set cellSize(size) { this._cellSize = size }
   set rowCenter(row) { this._center.row = row }
   set colCenter(col) { this._center.col = col }
   get width()        { return this._canvas.width }
   get height()       { return this._canvas.height }
   get cellSize()     { return this._cellSize }
   get center()       { return this._center }
}
