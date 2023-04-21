import { CELL_SIZE, SPEED } from './config.js'
import { getMousePos } from './utils.js'
import Grid from './grid.js'
import GameOfLife from './GameOfLife.js'
import Pattern from './src/pattern.js'

export default class GameControl {
   constructor() {
      this.containerCanvas = document.querySelector('.canvas-container')
      this.zoomRange = document.getElementById('zoom-range')
      this.speedRange = document.getElementById('speed-range')
      this.nextBtn = document.querySelector('button.next-btn')
      this.startBtn = document.querySelector('button.start-btn')
      this.resetBtn = document.querySelector('button.reset-btn')
      this.gridlineSvg = document.querySelector('svg.toggle-gridlines')
      this.patternSelect = document.querySelector('.pattern-select')

      this.grid = new Grid(this.containerCanvas)
      this.gameOfLife = new GameOfLife(this.grid.center)
      
      this.zoomRange.value = CELL_SIZE
      this.speedRange.value = -SPEED

      this.isDragging = false        // resuelve el conflicto entre click y mousedown
      this.timer = null              // setInteval save
      this.speed = SPEED
      this.isRunning = false         // juego inicia

      this.grid.draw()
   }
   
   // Activa o desactiva una celdilla  
   clickCellEvent() {
      canvas.addEventListener('click', (e) => {
         if (this.isDragging) return

         const mousePos = getMousePos(e);
         const cellPos = {     // posición de la celda clickeada
            row: Math.floor(mousePos.y / this.grid.cellSize),
            col: Math.floor(mousePos.x / this.grid.cellSize)
         }

         if (this.gameOfLife.isOutOfLimits(cellPos)) {
            alert('la célula está fuera de los límites')
            return
         }

         if (this.gameOfLife.isCellActive(cellPos)) {
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
         this.isDragging = false
      })

      /* 2. El evento registra el movimiento del mouse 
            solo cuando se cumple el paso 1 */
      canvas.addEventListener('mousemove', (e) => {
         if (!startPos) return

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
         
         this.gameOfLife.rowDragDistance += (Math.floor(dy / this.grid.cellSize))
         this.gameOfLife.colDragDistance += (Math.floor(dx / this.grid.cellSize))
         this.grid.ctx.setTransform(1, 0, 0, 1, 0, 0)    // resetea la traslación
         this.grid.draw()
         this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
         dx = 0, dy = 0
      }
   }

   resizeEvent() {
      window.addEventListener('resize', () => {
         this._rebuiltGrid()
      })
   }

   zoomControl() {
      this.zoomRange.addEventListener('change', () => {
         this.grid.cellSize = parseInt(this.zoomRange.value)
         this._rebuiltGrid()
      })
   }

   nextControl() {
      this.nextBtn.addEventListener('click', () => {
         this._runGame()   
      })
   }

   startControl() {
      this.startBtn.addEventListener('click', () => {
         if (this.gameOfLife.activatedCells.length === 0) {
            alert('no hay vida')
            return
         }

         this.startBtn.classList.toggle('is-running')
         this.isRunning = !this.isRunning
         let textButton = this.startBtn.querySelector('span')

         if (this.isRunning) {
            textButton.textContent = 'Stop'
            this.timer = setInterval(this._runGame.bind(this), this.speed)
            this.resetBtn.disabled = true
         }
         else {
            clearInterval(this.timer)
            textButton.textContent = 'Start'
            this.resetBtn.disabled = false
         }
      })
   }

   speedControl() {
      this.speedRange.addEventListener('change', () => {
         this.speed = -parseInt(this.speedRange.value)
         if (this.isRunning) {
            clearInterval(this.timer)
            this.timer = setInterval(this._runGame, this.speed)
         }
      })
   }

   resetControl() {
      this.resetBtn.addEventListener('click', () => {
         this.grid.draw()
         this.gameOfLife.reset(this.grid.center)
      })
   }

   patternControl() {
      this.patternSelect.addEventListener('change', () => {
         const pattern_name = this.patternSelect.value
         const pattern = new Pattern(pattern_name)

         pattern.decodeAsCells()
            .then(cells => {
               this.gameOfLife.reset(this.grid.center)

               // para centrar el pattern en el grid
               const centerOnRow = this.grid.center.row - Math.floor(pattern.y / 2)
               const centerOnCol = this.grid.center.col - Math.floor(pattern.x / 2)
               const centeredCells = cells.map((cell) => {
                  return { 
                     row: cell.row + centerOnRow, 
                     col: cell.col + centerOnCol 
                  }
               })
               this.gameOfLife._activatedCells = centeredCells

               this.grid.draw()
               this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
            })
            .catch(() => {
               console.log('El archivo RLE no existe')
            })
      })
   }

   _rebuiltGrid() {
      this.grid.width = this.containerCanvas.clientWidth - 1
      this.grid.height = this.containerCanvas.clientHeight - 1
      this.grid.left = -Math.ceil(this.grid.width / this.grid.cellSize) * this.grid.cellSize + 0.5
      this.grid.top = -Math.ceil(this.grid.height / this.grid.cellSize) * this.grid.cellSize + 0.5
      this.grid.right = this.grid.width * 2
      this.grid.bottom = this.grid.height * 2

      // mantiene el centro del grid cada vez que se hace un zoom en el grid o resize en el browser
      const oldGridCenter = {...this.grid.center}
      const newGridCenter = {
         row: Math.ceil(Math.ceil(this.grid.height / this.grid.cellSize) / 2),
         col: Math.ceil(Math.ceil(this.grid.width / this.grid.cellSize) / 2)
      }
      this.grid.rowCenter = newGridCenter.row
      this.grid.colCenter = newGridCenter.col
      this.gameOfLife.rowDragDistance += newGridCenter.row - oldGridCenter.row
      this.gameOfLife.colDragDistance += newGridCenter.col - oldGridCenter.col

      this.grid.draw()
      this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
   }

   _runGame = () => {
      if (this.gameOfLife.activatedCells.length === 0) {
         alert('no hay vida')
         clearInterval(this.timer)
         this.startBtn.classList.remove('is-running')
         this.isRunning = false
         this.startBtn.querySelector('span').textContent = 'Start'
         return
      }
      this.gameOfLife.generation++
      this.gameOfLife.nextGeneration()
      this.grid.draw()
      this.grid.paintAllActivatedCells(this.gameOfLife.syncActivatedCells())
   }
   
   panelControl() {
      this.zoomControl()
      this.nextControl()
      this.startControl()
      this.speedControl()
      this.resetControl()
      this.patternControl()
   }
   
   events() {
      this.clickCellEvent()
      this.dragGrid()
      this.resizeEvent()
   }
}
