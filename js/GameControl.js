import { CELL_SIZE } from './config.js'
import { getMousePos } from './utils.js'
import Grid from './grid.js'
import GameOfLife from './GameOfLife.js'

export default class GameControl {
   constructor() {
      const containerCanvas = document.getElementById('container-canvas')

      this.grid = new Grid(containerCanvas)
      this.gameOfLife = new GameOfLife()

      this.isDragging = false        // resuelve el conflicto
   }

   // Activa o desactiva una celdilla  
   clickCellEvent() {
      canvas.addEventListener('click', (e) => {
         if(this.isDragging) return

         const mousePos = getMousePos(e);
         const cellPos = {     // posición de la celda clickeada
            column: Math.floor(mousePos.x / CELL_SIZE),
            row: Math.floor(mousePos.y / CELL_SIZE)
         }
         console.log('cell clicked: (' + cellPos.column + ',' + cellPos.row + ')')
         if(this.gameOfLife.isCellActive(cellPos)) {
            this.gameOfLife.deleteCellPosition(cellPos)
            this.grid.unpaintCell(cellPos)
         }
         else {
            this.gameOfLife.addActivatedCell(cellPos)
            this.grid.paintCell(cellPos)
         }
         this.gameOfLife.info()
      })
   }

   // Arrastra el grid con el mouse (grid infinito)
   dragGrid() {
      let startPos = null
      let dx = 0       // distancia en x recorrida por el mouse
      let dy = 0       // distancia en y recorrida por el mouse

      // 1. El evento registra la posicion inicial del click presionado 
      canvas.addEventListener('mousedown', (e) => {
         startPos = getMousePos(e)
      })

      /* 2. El evento registra el movimiento del mouse 
            solo cuando se cumple el paso 1 */
      canvas.addEventListener('mousemove', (e) => {
         if(!startPos) return

         this.isDragging = true
         const mousePos = getMousePos(e)
         const dx_t = mousePos.x - startPos.x
         const dy_t = mousePos.y - startPos.y

         this.grid.ctx.translate(dx_t, dy_t)
         this.grid.draw()
         this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
         startPos = mousePos
         dx += dx_t, dy += dy_t
      })

      /* 3. El evento registra la liberación al dejar de presionar el mouse,
            o que el mouse este fuera del contenedor canvas */
      canvas.addEventListener('mouseup', () => reset())
      canvas.addEventListener('mouseleave', () => reset())
      
      const reset = () => {
         startPos = null
         this.gameOfLife.distanceDrag.column += Math.floor(dx / CELL_SIZE)
         this.gameOfLife.distanceDrag.row += Math.floor(dy / CELL_SIZE)
         
         this.grid.ctx.setTransform(1, 0, 0, 1, 0, 0)    // resetea la traslación
         this.grid.draw()
         this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
         dx = 0, dy = 0
         setTimeout(() => { this.isDragging = false }, 200)
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
