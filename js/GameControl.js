import { CELL_SIZE } from './config.js'
import { getMousePos } from './utils.js'
import Grid from './grid.js'
import GameOfLife from './GameOfLife.js'

export default class GameControl {
   constructor() {
      this.containerCanvas = document.getElementById('container-canvas')
      this.zoom = document.getElementById('zoom-range')
      this.zoom.value = CELL_SIZE

      this.grid = new Grid(this.containerCanvas)
      this.gameOfLife = new GameOfLife()

      this.isDragging = false        // resuelve el conflicto entre click y mousedown
   }

   // Activa o desactiva una celdilla  
   clickCellEvent() {
      canvas.addEventListener('click', (e) => {
         if(this.isDragging) return

         const mousePos = getMousePos(e);
         const cellPos = {     // posición de la celda clickeada
            column: Math.floor(mousePos.x / this.grid.cellSize),
            row: Math.floor(mousePos.y / this.grid.cellSize)
         }

         if(this.gameOfLife.isCellActive(cellPos)) {
            this.gameOfLife.deleteCellPos(cellPos)
            this.grid.unpaintCell(cellPos)
         }
         else {
            this.gameOfLife.addActivatedCell(cellPos)
            this.grid.paintCell(cellPos)
         }
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
         
         this.gameOfLife.columnDragDistance += (Math.floor(dx / this.grid.cellSize))
         this.gameOfLife.rowDragDistance += (Math.floor(dy / this.grid.cellSize))
         this.grid.ctx.setTransform(1, 0, 0, 1, 0, 0)    // resetea la traslación
         this.grid.draw()
         this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
         dx = 0, dy = 0
         setTimeout(() => { this.isDragging = false }, 200)
      }
   }

   resizeEvent() {
      window.addEventListener('resize', () => {
         this._rebuilt()
      })
   }

   zoomControl() {
      this.zoom.addEventListener('change', () => {
         this.grid.cellSize = parseInt(this.zoom.value)
         this._rebuilt()
      })
   }

   _rebuilt() {
      this.grid.width = this.containerCanvas.clientWidth - 1
      this.grid.height = this.containerCanvas.clientHeight - 1
      this.grid.left = -Math.ceil(this.grid.width / this.grid.cellSize) * this.grid.cellSize + 0.5
      this.grid.top = -Math.ceil(this.grid.height / this.grid.cellSize) * this.grid.cellSize + 0.5
      this.grid.right = this.grid.width * 2
      this.grid.bottom = this.grid.height * 2
      this.grid.draw()
      this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
   }

   run() {
      // dibuja la cuadricula
      this.grid.draw()
      this.clickCellEvent()
      this.dragGrid()
      this.resizeEvent()
      this.zoomControl()
   }
}
