import Game from './src/control.js'
import headerApp from './layout/header.js'
import svgApp from './layout/svg.js'

const game = new Game()
game.events()
game.panelControl()

headerApp()
svgApp()
