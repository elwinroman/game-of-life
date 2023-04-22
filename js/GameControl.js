import { CELL_SIZE, SPEED, COLOR } from './config.js'
import { getMousePos } from './utils.js'
import Grid from './grid.js'
import CelullarAutomaton from './GameOfLife.js'
import Pattern from './src/pattern.js'

export default class GameControl {
   constructor() {
      this.containerCanvas = document.querySelector('.canvas-container')
      this.startBtn = document.querySelector('button.start-btn')
      this.resetBtn = document.querySelector('button.reset-btn')
      this.patternSelect = document.querySelector('.pattern-select')

      this.grid = new Grid(this.containerCanvas)
      this.ca = new CelullarAutomaton(this.grid.center)

      this.isDragging = false        // resuelve el conflicto entre click y mousedown
      this.timer = null              // setInteval save
      this.speed = SPEED
      this.isRunning = false         // juego inicia
      this.hasGridline = false       // tiene gridline?

      this.grid.draw()
   }
   
   // Activa o desactiva una celula
   clickCellEvent() {
      canvas.addEventListener('click', (e) => {
         if (this.isDragging) return

         const mousePos = getMousePos(e);
         const cell = {     // posición de la celda clickeada
            row: Math.floor(mousePos.y / this.grid.cellSize),
            col: Math.floor(mousePos.x / this.grid.cellSize)
         }

         if (this.ca.isOutOfLimits(cell)) {
            alert('la célula está fuera de los límites')
            return
         }

         if (this.ca.isCellAlive(cell)) {
            this.ca.deleteCell(cell)
            this.grid.unpaintCell(cell)
         }
         else {
            this.ca.addCell(cell)
            this.grid.paintCell(cell)
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
         this.grid.paintAllAliveCells(this.ca.gridAliveCells)
         startPos = mousePos
         dx += dx_t, dy += dy_t
      })

      /* 3. El evento registra la liberación al dejar de presionar el mouse,
            o que el mouse este fuera del contenedor canvas */
      canvas.addEventListener('mouseup', () => reset())
      canvas.addEventListener('mouseleave', () => reset())
      
      const reset = () => {
         startPos = null
         
         this.ca.dragDistance.row += (Math.floor(dy / this.grid.cellSize))
         this.ca.dragDistance.col += (Math.floor(dx / this.grid.cellSize))
         this.grid.ctx.setTransform(1, 0, 0, 1, 0, 0)    // resetea la traslación
         this.grid.draw()
         this.grid.paintAllAliveCells(this.ca.gridAliveCells)
         dx = 0, dy = 0
      }
   }

   resizeEvent() {
      window.addEventListener('resize', () => {
         this._reconfigure()
      })
   }

   zoomControl() {
      const zoomRange = document.getElementById('zoom-range')
      zoomRange.value = CELL_SIZE

      zoomRange.addEventListener('change', () => {
         this.grid.cellSize = parseInt(zoomRange.value)
         this._reconfigure()
      })
   }

   nextControl() {
      const nextBtn = document.querySelector('button.next-btn')

      nextBtn.addEventListener('click', () => {
         this._runGame()   
      })
   }

   startControl() {
      this.startBtn.addEventListener('click', () => {
         if (this.ca.aliveCells.length === 0) {
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
      const speedRange = document.getElementById('speed-range')
      speedRange.value = -SPEED

      speedRange.addEventListener('change', () => {
         this.speed = -parseInt(speedRange.value)

         if (this.isRunning) {
            clearInterval(this.timer)
            this.timer = setInterval(this._runGame, this.speed)
         }
      })
   }

   resetControl() {
      this.resetBtn.addEventListener('click', () => {
         this.grid.draw()
         this.ca.reset(this.grid.center)
      })
   }

   patternControl() {
      this.patternSelect.addEventListener('change', () => {
         const pattern_name = this.patternSelect.value
         const pattern = new Pattern(pattern_name)

         pattern.decodeAsCells()
            .then(cells => {
               this.ca.reset(this.grid.center)

               // para centrar el pattern en el grid
               const centerOnRow = this.grid.center.row - Math.floor(pattern.height / 2)
               const centerOnCol = this.grid.center.col - Math.floor(pattern.width / 2)
               const centeredCells = cells.map((cell) => {
                  return { 
                     row: cell.row + centerOnRow + this.ca.syncDistance.row, 
                     col: cell.col + centerOnCol + this.ca.syncDistance.col
                  }
               })
               this.ca.addPatternCells(centeredCells)

               this.grid.draw()
               this.grid.paintAllAliveCells(this.ca.gridAliveCells)
            })
            .catch(() => {
               console.log('El archivo RLE no existe')
            })
      })
   }

   // Oculta o muestra las lineas de la cuadrícula
   gridlineControl() {
      const toggleGridlineIcon = document.querySelector('svg.toggle-gridline')

      toggleGridlineIcon.addEventListener('click', () => {
         this.hasGridline = !this.hasGridline
         
         if (this.hasGridline) {
            this.grid.border = 0.1
            this.grid.gridlineColor = COLOR.background
         } else {
            this.grid.border = 1
            this.grid.gridlineColor = COLOR.gridline
         }

         this.grid.draw()
         this.grid.paintAllAliveCells(this.ca.gridAliveCells)
      })
   }

   _reconfigure() {
      this.grid.recalculate(this.containerCanvas)
      
      // mantiene el centro del grid cada vez que se hace un zoom en el grid o resize en el browser
      const oldGridCenter = {...this.grid.center}
      const newGridCenter = {
         row: Math.ceil(Math.ceil(this.grid.canvas.height / this.grid.cellSize) / 2),
         col: Math.ceil(Math.ceil(this.grid.canvas.width / this.grid.cellSize) / 2)
      }
      this.grid.center = {...newGridCenter}
      this.ca.dragDistance.row += newGridCenter.row - oldGridCenter.row
      this.ca.dragDistance.col += newGridCenter.col - oldGridCenter.col

      this.grid.draw()
      this.grid.paintAllAliveCells(this.ca.gridAliveCells)
   }

   _runGame = () => {
      if (this.ca.aliveCells.length === 0) {
         alert('no hay vida')
         clearInterval(this.timer)
         this.startBtn.classList.remove('is-running')
         this.isRunning = false
         this.startBtn.querySelector('span').textContent = 'Start'
         return
      }
      this.ca.generation++
      this.ca.nextGeneration()
      this.grid.draw()
      this.grid.paintAllAliveCells(this.ca.gridAliveCells)
   }
   
   panelControl() {
      this.zoomControl()
      this.nextControl()
      this.startControl()
      this.speedControl()
      this.resetControl()
      this.patternControl()
      this.gridlineControl()
   }
   
   events() {
      this.clickCellEvent()
      this.dragGrid()
      this.resizeEvent()
   }
}
