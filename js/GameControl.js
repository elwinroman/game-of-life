import { CELL_SIZE } from './config.js'
import Grid from './grid.js'
import { getMousePos } from './utils.js'
import GameOfLife from './GameOfLife.js'

export default class GameControl {
   constructor() {
      const containerCanvas = document.getElementById('container-canvas')

      this.grid = new Grid(containerCanvas)
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
         console.log('(' + cellPosition.column + ',' + cellPosition.row + ')')
         if(this.gameOfLife.isCellActive(cellPosition)) {
            this.gameOfLife.deleteCellPosition(cellPosition)
            this.grid.unpaintCell(cellPosition)
         }
         else {
            this.gameOfLife.activatedCells.push(cellPosition)
            this.grid.paintCell(cellPosition)
         }

         this.gameOfLife.info()
      });
   }

   run() {
      // dibuja la cuadricula
      this.grid.draw()

      this.clickCellEvent()
   }
}
