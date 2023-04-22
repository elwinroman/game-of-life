import { COLUMN_MATRIX, ROW_MATRIX, ALIVE, DEAD} from './config.js'

export default class CelullarAutomaton {
   constructor(gridCenter) {
      this.aliveCells = []    // almacena todas las células vivas

      // almacena la distancia recorrida del mouse al arrastrar el grid
      this.dragDistance = { row: 0, col: 0 }
      
      this.row = ROW_MATRIX
      this.col = COLUMN_MATRIX
      this.board = Array(this.row).fill().map(() => Array(this.col).fill(DEAD))

      // distancia equivalente entre el centro del grid (vista) y el board (matriz)
      this.syncDistance = { 
         row: Math.ceil(this.row / 2) - gridCenter.row,
         col: Math.ceil(this.col / 2) - gridCenter.col
      }

      this.generation = 0
   }

   // Comprueba si la célula clickeada por el usuario está viva
   isCellAlive(cell) {
      const { row, col } = this._syncToBoard(cell)

      return this.board[row][col] === ALIVE ? true : false
   }

   // Elimina una célula viva(muere)
   deleteCell(cell) {
      const { row, col } = this._syncToBoard(cell)

      const index = this.aliveCells.findIndex((aliveCell) => {
         return ( 
            aliveCell.row === row &&
            aliveCell.col === col
         )
      })
      this.board[row][col] = DEAD
      this.aliveCells.splice(index, 1)
   }

   // Guarda la posicion de una célula clickeada por el usuario
   addCell(cell) {
      const { row, col } = this._syncToBoard(cell)

      this.board[row][col] = ALIVE
      this.aliveCells.push({ row, col })
   }

   // Agrega las células vivas generados al escoger un Pattern
   addPatternCells(cells) {
      this.aliveCells = [...cells]
      for (let {row, col} of cells)
         this.board[row][col] = ALIVE

   }

   // Comprueba si la célula está fuera de los límites
   isOutOfLimits(cell) {
      const { row, col } = this._syncToBoard(cell)
      
      if (row > 0 && col > 0 && row < this.row - 1 && col < this.col - 1)
         return false
      return true
   }

   // Resetea los valores cuando se hace click en el boton reset
   reset(gridCenter) {
      this.generation = 0
      this.aliveCells = []
      this.dragDistance.row = 0
      this.dragDistance.col = 0
      this.syncDistance.row = Math.ceil(this.row / 2) - gridCenter.row
      this.syncDistance.col = Math.ceil(this.col / 2) - gridCenter.col
      this.board = Array(this.row).fill().map(() => 
         Array(this.col).fill(DEAD)
      )
   }

   // Ejecuta el algoritmo y las reglas hasta obtener la siguiente generación
   nextGeneration() {
      if (this.aliveCells.length === 0) return

      let nextAliveCells = []
      let nextBoard = structuredClone(this.board)
      
      // analiza cada célula de la matriz
      for (let i=1; i<this.row-1; i++) {
         for (let j=1; j<this.col-1; j++) {
            const currentCell = this.board[i][j]
            const neighbors = this._calculateNeighborsAlive(i, j)
            
            // reglas
            if (currentCell === ALIVE && neighbors < 2)
               nextBoard[i][j] = DEAD       // muere por despoblación
            else if (currentCell === ALIVE && neighbors > 3)
               nextBoard[i][j] = DEAD       // muere por sobrepoblacion
            else if (currentCell === DEAD && neighbors === 3) {
               nextBoard[i][j] = ALIVE      // nace una nueva célula
               nextAliveCells.push({ row: i, col: j })
            }
            else {
               nextBoard[i][j] = currentCell    // no existen cambios
               if (currentCell === ALIVE)
                  nextAliveCells.push({ row: i, col: j })
            }
         }
      }
      // actualiza los datos de la nueva generación
      this.aliveCells = [...nextAliveCells]
      this.board = structuredClone(nextBoard)
   }

   _calculateNeighborsAlive(i, j) {
      let neighbors = 0
      if (this.board[i-1][j-1] === ALIVE) neighbors++     // up-left
      if (this.board[i-1][j]   === ALIVE) neighbors++     // up
      if (this.board[i-1][j+1] === ALIVE) neighbors++     // up-right
      if (this.board[i][j-1]   === ALIVE) neighbors++     // left
      if (this.board[i][j+1]   === ALIVE) neighbors++     // right
      if (this.board[i+1][j-1] === ALIVE) neighbors++     // bottom-left
      if (this.board[i+1][j]   === ALIVE) neighbors++     // bottom
      if (this.board[i+1][j+1] === ALIVE) neighbors++     // bottom-right
      return neighbors
   }

   // Sincroniza la posición de una célula en el grid respecto al board (matriz)
   _syncToBoard(cell) {
      return {
         row: cell.row + this.syncDistance.row - this.dragDistance.row,
         col: cell.col + this.syncDistance.col - this.dragDistance.col,
      }
   }

   // Sincroniza y devuelve la posición de las celúlas vivas del board respecto al lienzo (grid)
   get gridAliveCells() {
      return this.aliveCells.map(cell => {
         return { 
            row: cell.row - this.syncDistance.row + this.dragDistance.row,
            col: cell.col - this.syncDistance.col + this.dragDistance.col
         }
      })
   }
}
