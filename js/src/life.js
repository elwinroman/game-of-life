import { COLUMN_MATRIX, ROW_MATRIX, ALIVE, DEAD} from '../config.js'

export default class CelullarAutomaton {
   constructor(gridCenter) {
      this.aliveCells = []    // almacena todas las células vivas

      // almacena la distancia recorrida del mouse al arrastrar el grid
      this.dragDistance = { row: 0, col: 0 }
      
      this.row = COLUMN_MATRIX
      this.col = ROW_MATRIX
      this.board = new Uint8Array(this.row * this.col)

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

      return this.board[row * this.col + col]  === ALIVE ? true : false
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
      this.board[row * this.col + col] = DEAD
      this.aliveCells.splice(index, 1)
   }

   // Guarda la posicion de una célula clickeada por el usuario
   addCell(cell) {
      const { row, col } = this._syncToBoard(cell)

      this.board[row * this.col + col] = ALIVE
      this.aliveCells.push({ row, col })
   }

   // Agrega las células vivas generados al escoger un Pattern
   addPatternCells(cells) {
      this.aliveCells = [...cells]
      for (let {row, col} of cells)
         this.board[row * this.col + col] = ALIVE
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
      this.board.fill(0)
   }

   // Ejecuta el algoritmo y las reglas hasta obtener la siguiente generación
   nextGeneration() {
      if (this.aliveCells.length === 0) return

      let nextAliveCells = []
      let nextBoard = [...this.board]
      
      // en vez de recorrer toda la matriz, solo analiza por puntos focalizados 
      // ...tomando como referencia las células vivas
      for (let it = 0; it < this.aliveCells.length; it++) {
         const i = this.aliveCells[it].row, j = this.aliveCells[it].col
         
         const neighbors = this._calculateNeighborsAlive(i, j)

         // la célula muere por despoblación o sobrepoblación
         if (neighbors < 2 || neighbors > 3)
            nextBoard[i * this.col + j] = DEAD
         else {   // no hay cambios
            nextBoard[i * this.col + j] = ALIVE
            nextAliveCells.push({row: i, col: j})
         }

         const deadCellsAround = []
         // analiza solo las células muertas vecinas, la segunda comparación del condicional evitar revivir a una célula viva que ha muerto
         if (
               this.board[(i-1) * this.col + j-1] === DEAD && 
               nextBoard[(i-1) * this.col + j-1] === DEAD
            )  deadCellsAround.push({row: i-1, col: j-1})
         if (
               this.board[(i-1) * this.col + j] === DEAD && 
               nextBoard[(i-1) * this.col + j] === DEAD
            )  deadCellsAround.push({row: i-1, col: j})
         if (
               this.board[(i-1) * this.col + j+1] === DEAD && 
               nextBoard[(i-1) * this.col + j+1] === DEAD
            )  deadCellsAround.push({row: i-1, col: j+1})
         if (
               this.board[i * this.col + j-1] === DEAD && 
               nextBoard[i][j-1] === DEAD
            )  deadCellsAround.push({row: i, col: j-1})
         if (
               this.board[i * this.col + j+1] === DEAD && 
               nextBoard[i * this.col + j+1] === DEAD
            )  deadCellsAround.push({row: i, col: j+1})
         if (
               this.board[(i+1) * this.col + j-1] === DEAD && 
               nextBoard[(i+1) * this.col + j-1] === DEAD
            )  deadCellsAround.push({row: i+1, col: j-1})
         if (
               this.board[(i+1) * this.col + j] === DEAD && 
               nextBoard[(i+1) * this.col + j] === DEAD
            )  deadCellsAround.push({row: i+1, col: j})
         if (
               this.board[(i+1) * this.col + j+1] === DEAD && 
               nextBoard[(i+1) * this.col + j+1] === DEAD
            )  deadCellsAround.push({row: i+1, col: j+1})

         for (let it2 = 0; it2 < deadCellsAround.length; it2++) {
            const i2 = deadCellsAround[it2].row, j2 = deadCellsAround[it2].col
            const neighbors2 = this._calculateNeighborsAlive(i2, j2)

            // nace una nueva célula
            if (neighbors2 === 3) {
               nextBoard[i2 * this.col + j2] = ALIVE
               nextAliveCells.push({row: i2, col: j2})
            }
         }
      }

      // actualiza los datos de la nueva generación
      this.aliveCells = [...nextAliveCells]
      this.board = [...nextBoard]
   }

   _calculateNeighborsAlive(i, j) {
      let neighbors = 0

      if (this.board[(i-1) * this.col + j-1] === ALIVE) neighbors++  // up-left
      if (this.board[(i-1) * this.col + j]   === ALIVE) neighbors++  // up
      if (this.board[(i-1) * this.col + j+1] === ALIVE) neighbors++  // up-right
      if (this.board[i * this.col + j-1]     === ALIVE) neighbors++  // left
      if (this.board[i * this.col + j+1]     === ALIVE) neighbors++  // right
      if (this.board[(i+1) * this.col + j-1] === ALIVE) neighbors++  // bottom-left
      if (this.board[(i+1) * this.col + j]   === ALIVE) neighbors++  // bottom
      if (this.board[(i+1) * this.col + j+1] === ALIVE) neighbors++  // bottom-right
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

   printBoard() {
      let cad = ''
      console.log('==============')
      for (let i = 1; i < this.row - 1; i++) {
         for (let j = 1; j < this.col - 1; j++) {
            let numb = this.board[i * this.col + j]
            cad = cad.concat(numb + ' ')
         }
         console.log(cad)
         cad = ''
      }
   }
}
