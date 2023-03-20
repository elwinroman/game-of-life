import { CELL_SIZE } from './config.js'
import { getMousePos } from './utils.js'
import Grid from './grid.js'
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

   // Arrastra el grid con el mouse (grid infinito)
   dragGrid() {
      let startPos = null

      // 1. El evento registra la posicion inicial del click presionado 
      canvas.addEventListener('mousedown', (e) => {
         startPos = getMousePos(e)
      })

      /* 2. El evento registra el movimiento del mouse 
            solo cuando se cumple el paso 1 */
      canvas.addEventListener('mousemove', (e) => {
         if(!startPos) return

         const mousePos = getMousePos(e)
         const dx = mousePos.x - startPos.x       // distancia en x
         const dy = mousePos.y - startPos.y       // distancia en y

         this.grid.ctx.translate(dx, dy)
         this.grid.draw()
         startPos = mousePos
      })

      /* 3. El evento registra la liberación al dejar de presionar el mouse,
            o que el mouse este fuera del contenedor canvas */
      canvas.addEventListener('mouseup', () => reset())
      canvas.addEventListener('mouseleave', () => reset())
      
      const reset = () => {
         startPos = null
         this.grid.ctx.setTransform(1, 0, 0, 1, 0, 0)    // resetea la traslación
         this.grid.draw()
      }
   }

   run() {
      // dibuja la cuadricula
      this.grid.draw()
      this.clickCellEvent()
      this.dragGrid()
      this.grid.____infoSizes()
   }
}
