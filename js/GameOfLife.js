export default class GameOfLife {
   constructor() {
      this.activatedCells = []    // almacena todas las celdillas activadas
   }

   // Comprueba si la celdilla clickeada está previamente activada
   isCellActive(pos) {
      return this.activatedCells.some((activatedCell) => {
         return (
            activatedCell.column === pos.column && 
            activatedCell.row === pos.row
         )
      })
   }

   // Elimina la posición de una celdilla del array de celdillas activadas
   deleteCellPosition(pos) {
      console.log("eliminando")
      const index = this.activatedCells.findIndex((activatedCell) => {
         return ( 
           activatedCell.column === pos.column &&
           activatedCell.row === pos.row
         )
      })
      
      this.activatedCells.splice(index, 1)
   }

   info() {
      console.log(this.activatedCells)
   }
}
