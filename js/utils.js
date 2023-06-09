import { playSvg, pauseSvg } from "./layout/svg.js"

export function getMousePos(e) {
   var rect = canvas.getBoundingClientRect();

   return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
   }
}

// query selector
export const $ = selector => document.querySelector(selector)

// query selectorAll
export const $$ = selector => document.querySelectorAll(selector)

// Cuando el juego está 'corriendo'
export function cssRunningGame() {
   pauseSvg()
   const el = listElement
   el.startBtn.classList.add('is-running')
   el.startBtn.nextElementSibling.textContent = 'Pausa'
   
   el.nextBtn.disabled = true
   el.resetBtn.disabled = true
   el.patternSelect.disabled = true
}

// Cuando el juego se ha detenido
export function cssStoppedGame() {
   playSvg()
   const el = listElement
   el.startBtn.classList.remove('is-running')
   el.startBtn.nextElementSibling.textContent = 'Play'

   el.nextBtn.disabled = false
   el.resetBtn.disabled = false
   el.patternSelect.disabled = false
}

export const listElement = {
   // life HTML Elements
   toggleGridlineBtn: $('button.toggle-gridline'),
   containerCanvas: $('.canvas-container'),
   patternSelect: $('.pattern-select'),
   speedRange: $('#speed-range'),
   zoomRange: $('#zoom-range'),
   resetBtn: $('button.reset-btn'),
   startBtn: $('button.start-btn'),
   nextBtn: $('button.next-btn'),
   // header HTML Elements
   logoContainer: $('.navbar .logo'),
   aspectContainer: $('.navbar .aspect'),
   githubContainer: $('.navbar .github'),
   navbar: $('.navbar')
}
