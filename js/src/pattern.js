export default class Pattern {
   constructor(name) {
      this._url = 'js/src/examples/'
      this._name = name
      this._rle = null
      this._x = null
      this._y = null
      this._cells = []
   }

   /** 
    * Obtiene un archivo que contiene los patrones en formato RLE
    * mas info, visite: https://conwaylife.com/wiki/Run_Length_Encoded
    * todos los patterns en https://conwaylife.com/patterns/all.zip
    */
   async decodeAsCells() {
      const file = this._url + this._name + '.rle'
      const rle_regex = /(^[\dob$]+\r?\n?)+!$/gm
      const x_regex = /x\s?=\s?[\d]+/g
      const y_regex = /y\s?=\s?[\d]+/g

      const response = await fetch(file)
      const data = await response.text()
      
      this._rle = data.match(rle_regex)[0].replace(/\r?\n|\r/g, '')
      this._x = data.match(x_regex)[0].replace(/x\s?=\s?/g, '')
      this._y = data.match(y_regex)[0].replace(/y\s?=\s?/g, '')

      this._cells = this._decode()
      return this._cells
   }

   // decodifica el string rle en un array de celdillas
   _decode() {
      const cells = []
      const patterns = this._rle.split('$')
      let y = 0
      
      for (let i=0; i<patterns.length; i++) {
         const stringRLE = patterns[i]
         let count = { cad: '', num: 1 }
         let x = 0

         for (let j=0; j<stringRLE.length; j++) {
            if (/\d/.test(stringRLE[j])) {
               count.cad += stringRLE[j]
               count.num = parseInt(count.cad)

               if (j === stringRLE.length - 1) 
                  y += (count.num - 1)
            }
            else {
               let tag = stringRLE[j]
               
               if (this._isAlive(tag))
                  this._addCells(count.num, i+y, x, cells)
               
               x += count.num
               count.cad = ''
               count.num = 1
            }
         }
      }
      return cells
   }

   /**
    * Agrega las coordenadas del pattern
    * @param {Integer} count  contador de tags RLE 
    * @param {Integer} i      posición en las filas
    * @param {Integer} x      posición en las columnas
    * @param {Array}   cells  array donde se almacena los patterns parseados    
    */
   _addCells(count, y, x, cells) {
      for (let it=0; it<count; it++)
         cells.push({ row: y, col: it + x })
   }

   // Comprueba si el tag es ('o':alive cell), ignora ('b':dead cell) y ('!':final RLE)
   _isAlive(tag) {
      return (tag === 'o') ? true : false
   }

   get x() { return parseInt(this._x); }
   get y() { return parseInt(this._y); }
}
