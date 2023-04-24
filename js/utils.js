export function getMousePos(e) {
   var rect = canvas.getBoundingClientRect();

   return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
   }
}

// Cuando el juego está 'corriendo'
export function cssRunningGame() {
   listElement.startBtn.classList.add('is-running')
   listElement.startBtn.querySelector('span').textContent = 'Stop'
   
   listElement.nextBtn.disabled = true
   listElement.resetBtn.disabled = true
   listElement.patternSelect.disabled = true
}

// Cuando el juego se ha detenido
export function cssStoppedGame() {
   listElement.startBtn.classList.remove('is-running')
   listElement.startBtn.querySelector('span').textContent = 'Start'

   listElement.nextBtn.disabled = false
   listElement.resetBtn.disabled = false
   listElement.patternSelect.disabled = false
}

export const listElement = {
   // life HTML Elements
   toggleGridlineIcon: document.querySelector('svg.toggle-gridline'),
   containerCanvas: document.querySelector('.canvas-container'),
   patternSelect: document.querySelector('.pattern-select'),
   speedRange: document.getElementById('speed-range'),
   zoomRange: document.getElementById('zoom-range'),
   resetBtn: document.querySelector('button.reset-btn'),
   startBtn: document.querySelector('button.start-btn'),
   nextBtn: document.querySelector('button.next-btn'),
   // header HTML Elements
   logoContainer: document.querySelector('.navbar .logo'),
   aspectContainer: document.querySelector('.navbar .aspect'),
   githubContainer: document.querySelector('.navbar .github'),
   navbar: document.querySelector('.navbar')
}
