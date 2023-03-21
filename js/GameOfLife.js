export default class GameOfLife {
   constructor() {
      this.activatedCells = []    // almacena todas las celdillas activadas
      
      //almacena la distancia recorrida del mouse al arrastrar el grid
      this.distanceDrag = { column: 0, row: 0 }
   }

   // Comprueba si la celdilla clickeada está previamente activada
   isCellActive(pos) {
      return this.activatedCells.some((activatedCell) => {
         return (
            activatedCell.column === pos.column - this.distanceDrag.column && 
            activatedCell.row === pos.row - this.distanceDrag.row
         )
      })
   }

   // Elimina la posición de una celdilla del array de celdillas activadas
   deleteCellPosition(pos) {
      const index = this.activatedCells.findIndex((activatedCell) => {
         return ( 
           activatedCell.column === pos.column - this.distanceDrag.column &&
           activatedCell.row === pos.row - this.distanceDrag.row
         )
      })
      
      this.activatedCells.splice(index, 1)
   }

   // Sincroniza la posición de las celdillas de la matriz con respecto al lienzo
   syncActivatedCells() {
      return this.activatedCells.map(cell => {
         return { 
            column: cell.column + this.distanceDrag.column,
            row: cell.row + this.distanceDrag.row 
         }
      })
   }

   // Guarda la posicion de una celdilla clickeada en un array
   addActivatedCell(pos) {
      const pos_column = pos.column - this.distanceDrag.column
      const pos_row = pos.row - this.distanceDrag.row
      this.activatedCells.push({column: pos_column, row: pos_row})
   }

   info() {
      console.log(this.activatedCells)
   }
}
