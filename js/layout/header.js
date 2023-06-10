import { listElement as el } from '../utils.js'
import { lightModeSvg, darkModeSvg } from './svg.js'
import { COLOR } from '../config.js'

export default function headerApp(game) {
   stickyNavbar()
   openGithubPage()
   toggleAspectMode(game)
}

const stickyNavbar = (() => {
   const height = el.navbar.clientHeight

   window.addEventListener('scroll', () => {
      window.scrollY >= height ? 
         el.navbar.classList.add('sticky') : 
         el.navbar.classList.remove('sticky')
   })
})

const openGithubPage = (() => {
   el.githubContainer.addEventListener('click', () => {
      window.open('https://www.github.com/elwinroman/game-of-life')
   })
})

const toggleAspectMode = ((game) => {
   lightModeSvg()

   el.aspectContainer.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode')

      if (document.body.classList.contains('dark-mode')) {
         darkModeSvg()
         game.isDark = true
         game.grid.gridlineColor = game.hasGridline
            ? COLOR.dark.background
            : COLOR.dark.gridline
         game.grid.aliveColor = COLOR.dark.alive_cell
         game.grid.deadColor = COLOR.dark.dead_cell
         game.grid.draw()
         game.grid.paintAllAliveCells(game.ca.gridAliveCells)
      } else {
         lightModeSvg()
         game.isDark = false
         game.grid.gridlineColor = game.hasGridline
            ? COLOR.light.background
            : COLOR.light.gridline
         game.grid.aliveColor = COLOR.light.alive_cell
         game.grid.deadColor = COLOR.light.dead_cell
         game.grid.draw()
         game.grid.paintAllAliveCells(game.ca.gridAliveCells)
      }
      // document.body.classList.contains('dark-mode') ? 
      //    darkModeSvg() : lightModeSvg()

      el.aspectContainer.classList.toggle('rotate')
   })
})
