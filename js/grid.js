import { CELL_SIZE, CELL_COLOR_ACTIVE, CELL_COLOR_DEACTIVE } from './config.js'

export default class Grid {
   constructor(containerCanvas) {
      this.canvas = document.getElementById('canvas')
      
      this.ctx = this.canvas.getContext('2d')
      this.canvas.width  = containerCanvas.clientWidth
      this.canvas.height = containerCanvas.clientHeight

      this.left = -Math.ceil(this.canvas.width / CELL_SIZE) * CELL_SIZE + 0.5
      this.top = -Math.ceil(this.canvas.height / CELL_SIZE) * CELL_SIZE + 0.5
      this.right = this.ctx.canvas.width * 2
      this.bottom = this.ctx.canvas.width * 2

      this.____infoSizes()
   }

   draw() {
      this.ctx.beginPath()

      // lineas verticales (columnas)
      for (let x=this.left; x<this.right; x+=CELL_SIZE) {
         this.ctx.moveTo(x, this.top)
         this.ctx.lineTo(x, this.bottom)
      }
      
      // lineas horizontales (filas)
      for (let y=this.top; y<this.bottom; y+=CELL_SIZE) {
         this.ctx.moveTo(this.left, y)
         this.ctx.lineTo(this.right, y)
      }
      this.ctx.stroke()
   }

   paintCell(pos) {
      this.ctx.fillStyle = CELL_COLOR_ACTIVE
      this._fillSquare(pos)
   }

   _fillSquare(pos) {
      this.ctx.fillRect(
         pos.column * CELL_SIZE + 1, pos.row * CELL_SIZE + 1, 
         CELL_SIZE - 1, CELL_SIZE - 1
      )
   }

   unpaintCell(pos) {
      this.ctx.fillStyle = CELL_COLOR_DEACTIVE
      this._fillSquare(pos)
   }

   ____infoSizes() {
      console.log('El width del canvas es  ' + this.canvas.width)
      console.log('El height del canvas es ' + this.canvas.height)
      console.log('left:   ' + this.left)
      console.log('top:    ' + this.top)
      console.log('right:  ' + this.right)
      console.log('bottom: ' + this.bottom)
   }
}
