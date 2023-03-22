export default class GameOfLife {
   constructor() {
      this._activatedCells = []    // almacena todas las celdillas activadas
      
      //almacena la distancia recorrida del mouse al arrastrar el grid
      this._dragDistance = { column: 0, row: 0 }
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

   // Setters & getters
   set columnDragDistance(column) { this._dragDistance.column = column }
   set rowDragDistance(row)       { this._dragDistance.row = row }
   get columnDragDistance()       { return this._dragDistance.column }
   get rowDragDistance()          { return this._dragDistance.row }
   get activatedCells()           { return this._activatedCells }
}
