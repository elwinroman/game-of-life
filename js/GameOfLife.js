import { COLUMN_MATRIX, ROW_MATRIX, CELL_ON, CELL_OFF, CELL_SIZE } from './config.js'

export default class GameOfLife {
   constructor(gridCenter) {
      this._activatedCells = []    // almacena todas las celdillas activadas

      // almacena la distancia recorrida del mouse al arrastrar el grid
      this._dragDistance = { row: 0, col: 0 }
      
      this._row = ROW_MATRIX
      this._col = COLUMN_MATRIX
      this._matrix = Array(this._row).fill().map(() => Array(this._col).fill(CELL_OFF))
      this._newMatrix = structuredClone(this._matrix)       // matriz de la siguiente generación

      // distancia equivalente entre el centro del grid (vista) y la matriz (database)
      this._syncDistance = { 
         row: Math.ceil(this._row / 2) - gridCenter.row,
         col: Math.ceil(this._col / 2) - gridCenter.col
      }
   }

   // Comprueba si la celdilla clickeada está previamente activada
   isCellActive(pos) {
      return this._activatedCells.some((activatedCell) => {
         return (
            activatedCell.row === pos.row - this._dragDistance.row &&
            activatedCell.col === pos.col - this._dragDistance.col 
         )
      })
   }

   // Elimina la posición de una celdilla del array de celdillas activadas
   deleteCellPos(pos) {
      const index = this._activatedCells.findIndex((activatedCell) => {
         return ( 
            activatedCell.row === pos.row - this._dragDistance.row &&
            activatedCell.col === pos.col - this._dragDistance.col
         )
      })
      
      this._activatedCells.splice(index, 1)
   }

   // Sincroniza la posición de las celdillas de la matriz con respecto al lienzo
   syncActivatedCells() {
      return this._activatedCells.map(activatedCell => {
         return { 
            row: activatedCell.row + this._dragDistance.row,
            col: activatedCell.col + this._dragDistance.col
         }
      })
   }

   // Guarda la posicion de una celdilla clickeada en un array
   addActivatedCell(pos) {
      this._activatedCells.push({
         row: pos.row - this._dragDistance.row,
         col: pos.col - this._dragDistance.col
      })
   }

   // Ejecuta el algoritmo y las reglas hasta obtener la siguiente generación
   nextGeneration() {
      if (this._activatedCells.length === 0) return

      // helper function
      const addTemporalActivatedCell = (i, j) => {
         temporalActivatedCells.push({
            row: i - this._syncDistance.row,
            col: j - this._syncDistance.col
         })
      }

      this._updateMatrix()
      let temporalActivatedCells = []
      
      // analiza cada célula de la matriz
      for (let i=1; i<this._row-1; i++) {
         for (let j=1; j<this._col-1; j++) {
            const currentCell = this._matrix[i][j]
            const neighbors = this._calculateNeighborsAlive(i, j)
            
            // reglas
            if (currentCell === CELL_ON && neighbors < 2)
               this._newMatrix[i][j] = CELL_OFF       // muere por despoblación
            else if (currentCell === CELL_ON && neighbors > 3)
               this._newMatrix[i][j] = CELL_OFF       // muere por sobrepoblacion
            else if (currentCell === CELL_OFF && neighbors === 3) {
               this._newMatrix[i][j] = CELL_ON        // nace una nueva célula
               addTemporalActivatedCell(i, j)
            }
            else {
               this._newMatrix[i][j] = currentCell    // no existen cambios
               if (currentCell === CELL_ON) addTemporalActivatedCell(i, j)
            }
         }
      }
      // actualiza con los datos de la nueva generación
      this._activatedCells = [...temporalActivatedCells]
      this._matrix = structuredClone(this._newMatrix)
   }

   // Actualiza la matriz con las celdillas activadas por click (by user)
   _updateMatrix() {
      this._matrix = Array(this._row).fill().map(() => 
         Array(this._col).fill(CELL_OFF)
      )
      
      for (let cell of this._activatedCells) {
         let syncRow = cell.row + this._syncDistance.row
         let syncCol = cell.col + this._syncDistance.col
         this._matrix[syncRow][syncCol] = CELL_ON
      }
   }
   _calculateNeighborsAlive(i, j) {
      let neighbors = 0
      if (this._matrix[i-1][j-1] === CELL_ON) neighbors++     // up-left
      if (this._matrix[i-1][j]   === CELL_ON) neighbors++     // up
      if (this._matrix[i-1][j+1] === CELL_ON) neighbors++     // up-right
      if (this._matrix[i][j-1]   === CELL_ON) neighbors++     // left
      if (this._matrix[i][j+1]   === CELL_ON) neighbors++     // right
      if (this._matrix[i+1][j-1] === CELL_ON) neighbors++     // bottom-left
      if (this._matrix[i+1][j]   === CELL_ON) neighbors++     // bottom
      if (this._matrix[i+1][j+1] === CELL_ON) neighbors++     // bottom-right
      return neighbors
   }

   // Setters & getters
   set rowDragDistance(row) { this._dragDistance.row = row }
   set colDragDistance(col) { this._dragDistance.col = col }
   get colDragDistance()    { return this._dragDistance.col }
   get rowDragDistance()    { return this._dragDistance.row }
   get activatedCells()     { return this._activatedCells }
}
