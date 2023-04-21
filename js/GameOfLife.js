import { COLUMN_MATRIX, ROW_MATRIX, ALIVE, DEAD} from './config.js'

export default class CelullarAutomaton {
   constructor(gridCenter) {
      this.aliveCells = []    // almacena todas las células vivas

      // almacena la distancia recorrida del mouse al arrastrar el grid
      this.dragDistance = { row: 0, col: 0 }
      
      this.row = ROW_MATRIX
      this.col = COLUMN_MATRIX
      this.board = Array(this.row).fill().map(() => Array(this.col).fill(DEAD))

      // distancia equivalente entre el centro del grid (vista) y la matriz (database)
      this.syncDistance = { 
         row: Math.ceil(this.row / 2) - gridCenter.row,
         col: Math.ceil(this.col / 2) - gridCenter.col
      }

      this.generation = 0
   }

   // Comprueba si la célula clickeada por el usuario está viva
   isCellAlive(cell) {
      return this.aliveCells.some((aliveCell) => {
         return (
            aliveCell.row === cell.row - this.dragDistance.row &&
            aliveCell.col === cell.col - this.dragDistance.col 
         )
      })
   }

   // Elimina una célula viva del array (muere)
   deleteCell(cell) {
      const index = this.aliveCells.findIndex((aliveCell) => {
         return ( 
            aliveCell.row === cell.row - this.dragDistance.row &&
            aliveCell.col === cell.col - this.dragDistance.col
         )
      })
      
      this.aliveCells.splice(index, 1)
   }

   // Sincroniza la posición de las celúlas vivas de la matriz con respecto al lienzo
   syncAliveCells() {
      return this.aliveCells.map(cell => {
         return { 
            row: cell.row + this.dragDistance.row,
            col: cell.col + this.dragDistance.col
         }
      })
   }

   // Guarda la posicion de una célula clickeada por el usuario en el array de células vivas
   addCell(cell) {
      this.aliveCells.push({
         row: cell.row - this.dragDistance.row,
         col: cell.col - this.dragDistance.col
      })
   }

   // Comprueba si la célula está fuera de los límites
   isOutOfLimits(cell) {
      const matrixCell = {
         row: cell.row + this.syncDistance.row - this.dragDistance.row,
         col: cell.col + this.syncDistance.col - this.dragDistance.col
      }
      if (
         matrixCell.row > 0 && matrixCell.col > 0 && 
         matrixCell.row < this.row - 1 && matrixCell.col < this.col - 1
      ) return false
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
      // matriz ya se resetea en la funcion this._updateMatrix
   }

   // Ejecuta el algoritmo y las reglas hasta obtener la siguiente generación
   nextGeneration() {
      if (this.aliveCells.length === 0) return

      this._updateBoardWithAliveCells()
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
               nextAliveCells.push({
                  row: i - this.syncDistance.row, col: j - this.syncDistance.col
               })
            }
            else {
               nextBoard[i][j] = currentCell    // no existen cambios
               if (currentCell === ALIVE)
                  nextAliveCells.push({
                     row: i - this.syncDistance.row, col: j - this.syncDistance.col
                  })
            }
         }
      }
      // actualiza con los datos de la nueva generación
      this.aliveCells = [...nextAliveCells]
      this.board = structuredClone(nextBoard)
   }

   // Actualiza la matriz con las células vivas
   _updateBoardWithAliveCells() {
      this.board = Array(this.row).fill().map(() => 
         Array(this.col).fill(DEAD)
      )
      
      const normalizeAliveCells = this.aliveCells.map((cell) => {
         return { 
            row: cell.row + this.syncDistance.row,
            col: cell.col + this.syncDistance.col
         }
      })
      // asigna todas las células vivas a la matriz
      for (let cell of normalizeAliveCells)
         this.board[cell.row][cell.col] = ALIVE
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
}
