import Game from './src/control.js'
import headerApp from './layout/header.js'
import svgApp from './layout/svg.js'
import { loadPatterns } from './layout/select.js'

const game = new Game()
game.events()
game.panelControl()

headerApp()
svgApp()
loadPatterns()
