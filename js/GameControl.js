import { CELL_SIZE, CELL_COLOR_ACTIVE, CELL_COLOR_DEACTIVE } from './config.js'
import { draw, paintCell } from './grid.js'
import { getMousePos } from './utils.js'
import GameOfLife from './GameOfLife.js'

export default class GameControl {
   constructor() {
      const canvas = document.getElementById('canvas')
      const containerCanvas = document.getElementById('container-canvas')

      this.ctx = canvas.getContext('2d')
      this.ctx.canvas.width  = containerCanvas.clientWidth
      this.ctx.canvas.height = containerCanvas.clientHeight

      this.n_lines = {
         column: Math.ceil(canvas.width / CELL_SIZE),
         row: Math.ceil(canvas.height/ CELL_SIZE)
      }

      this.gameOfLife = new GameOfLife()
   }

   // Activa o desactiva una celdilla  
   clickCellEvent() {
      canvas.addEventListener('click', (e) => {
         const mousePos = getMousePos(e);
         const cellPosition = {     // posición de la celda clickeada
            column: Math.floor(mousePos.x / CELL_SIZE),
            row: Math.floor(mousePos.y / CELL_SIZE)
         }
         
         if(this.gameOfLife.isCellActive(cellPosition)) {
            this.gameOfLife.deleteCellPosition(cellPosition)
            paintCell(this.ctx, cellPosition, CELL_COLOR_DEACTIVE)      // despintar celdilla
         }
         else {
            this.gameOfLife.activatedCells.push(cellPosition)
            paintCell(this.ctx, cellPosition, CELL_COLOR_ACTIVE)
         }

         this.gameOfLife.info()
      });
   }

   run() {
      // dibuja la cuadricula
      draw(this.ctx, this.n_lines)

      this.clickCellEvent()
   }
}
