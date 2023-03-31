import { COLUMN_MATRIX, ROW_MATRIX, CELL_ON, CELL_OFF, CELL_SIZE } from './config.js'

export default class GameOfLife {
   constructor(widthCanvas, heightCanvas) {
      this._activatedCells = []    // almacena todas las celdillas activadas

      //almacena la distancia recorrida del mouse al arrastrar el grid
      this._dragDistance = { column: 0, row: 0 }
      
      this._cols = COLUMN_MATRIX
      this._rows = ROW_MATRIX
      this._matrix = Array(this._rows).fill().map(() => Array(this._cols).fill(CELL_OFF))
      this._newMatrix = structuredClone(this._matrix)       // matriz de la siguiente generación

      // centro del grid
      const gridCenter = {
         row: Math.ceil(Math.ceil(widthCanvas / CELL_SIZE) / 2),
         col: Math.ceil(Math.ceil(heightCanvas / CELL_SIZE) / 2)
      }

      // distancia equivalente entre el centro del grid (vista) y la matriz (database)
      this._syncDistance = { 
         row: Math.ceil(this._rows / 2) - gridCenter.row,
         col: Math.ceil(this._cols / 2) - gridCenter.col
      }
   }

   // Comprueba si la celdilla clickeada está previamente activada
   isCellActive(pos) {
      return this._activatedCells.some((activatedCell) => {
         return (
            activatedCell.column === pos.column - this._dragDistance.column && 
            activatedCell.row === pos.row - this._dragDistance.row
         )
      })
   }

   // Elimina la posición de una celdilla del array de celdillas activadas
   deleteCellPos(pos) {
      const index = this._activatedCells.findIndex((activatedCell) => {
         return ( 
           activatedCell.column === pos.column - this._dragDistance.column &&
           activatedCell.row === pos.row - this._dragDistance.row
         )
      })
      
      this._activatedCells.splice(index, 1)
   }

   // Sincroniza la posición de las celdillas de la matriz con respecto al lienzo
   syncActivatedCells() {
      return this._activatedCells.map(activatedCell => {
         return { 
            column: activatedCell.column + this._dragDistance.column,
            row: activatedCell.row + this._dragDistance.row 
         }
      })
   }

   // Guarda la posicion de una celdilla clickeada en un array
   addActivatedCell(pos) {
      this._activatedCells.push({
         column: pos.column - this._dragDistance.column, 
         row: pos.row - this._dragDistance.row
      })
   }

   // Ejecuta el algoritmo y las reglas hasta obtener la siguiente generación
   nextGeneration() {
      if (this._activatedCells.length === 0) return

      // helper function
      const addTemporalActivatedCell = (i, j) => {
         temporalActivatedCells.push({
            row: i - this._syncDistance.row,
            column: j - this._syncDistance.col
         })
      }
      
      this._updateMatrix()
      let temporalActivatedCells = []
      
      // analiza cada célula de la matriz
      for (let i=1; i<this._rows-1; i++) {
         for (let j=1; j<this._cols-1; j++) {
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
      for (let cell of this._activatedCells) {
         let syncRow = cell.row + this._syncDistance.row
         let syncCol = cell.column + this._syncDistance.col
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
   set columnDragDistance(column) { this._dragDistance.column = column }
   set rowDragDistance(row)       { this._dragDistance.row = row }
   get columnDragDistance()       { return this._dragDistance.column }
   get rowDragDistance()          { return this._dragDistance.row }
   get activatedCells()           { return this._activatedCells }
}
