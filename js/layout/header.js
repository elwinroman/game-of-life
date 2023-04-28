import { listElement as el } from '../utils.js'
import { lightModeSvg, darkModeSvg } from './svg.js'

export default function headerApp() {
   stickyNavbar()
   openGithubPage()
   toggleAspectMode()
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

const toggleAspectMode = (() => {
   lightModeSvg()

   el.aspectContainer.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode')

      document.body.classList.contains('dark-mode') ? 
         darkModeSvg() : lightModeSvg()

      el.aspectContainer.classList.toggle('rotate')
   })
})
