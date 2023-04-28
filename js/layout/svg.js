import { listElement as el } from '../utils.js'

export default function svgApp() {
   headerLogoSvg()
   githubSvg()
   nextSvg()
   resetSvg()
   gridlineSvg()
}

const SVG_SIZE = {
   logo: 22,
   aspect: 20,
   github: 20,
   controlButton: 22
}

const headerLogoSvg = (() => {
   const grid = `
      <svg width="${SVG_SIZE.logo}" height="${SVG_SIZE.logo}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path fill="none" fill-opacity=".16" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M8.4 3H4.6A1.6 1.6 0 0 0 3 4.6v3.8A1.6 1.6 0 0 0 4.6 10h3.8A1.6 1.6 0 0 0 10 8.4V4.6A1.6 1.6 0 0 0 8.4 3Z"/><path fill="currentFill" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M19.4 3h-3.8A1.6 1.6 0 0 0 14 4.6v3.8a1.6 1.6 0 0 0 1.6 1.6h3.8A1.6 1.6 0 0 0 21 8.4V4.6A1.6 1.6 0 0 0 19.4 3Zm-11 11H4.6A1.6 1.6 0 0 0 3 15.6v3.8A1.6 1.6 0 0 0 4.6 21h3.8a1.6 1.6 0 0 0 1.6-1.6v-3.8A1.6 1.6 0 0 0 8.4 14Z"/><path fill="none" fill-opacity=".16" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" d="M19.4 14h-3.8a1.6 1.6 0 0 0-1.6 1.6v3.8a1.6 1.6 0 0 0 1.6 1.6h3.8a1.6 1.6 0 0 0 1.6-1.6v-3.8a1.6 1.6 0 0 0-1.6-1.6Z"/></svg>
   `
   el.logoContainer.insertAdjacentHTML('afterbegin', grid)
})

export const lightModeSvg = (() => {
   const brightnessUp = `
      <svg width="${SVG_SIZE.aspect}" height="${SVG_SIZE.aspect}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 5V3M17 7l1.4-1.4M19 12h2M17 17l1.4 1.4M12 19v2M7 17l-1.4 1.4M6 12H4M7 7 5.6 5.6"/></svg>
   `
   el.aspectContainer.innerHTML = ''
   el.aspectContainer.insertAdjacentHTML('afterbegin', brightnessUp)
})

export const darkModeSvg = (() => {
   const moon = `
      <svg width="${SVG_SIZE.aspect}" height="${SVG_SIZE.aspect}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"/></svg>
   `
   el.aspectContainer.innerHTML = ''
   el.aspectContainer.insertAdjacentHTML('afterbegin', moon)
})

const githubSvg = (() => {
   const github = `
      <svg width="${SVG_SIZE.github}" height="${SVG_SIZE.github}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentFill" d="M10 0c5.523 0 10 4.59 10 10.253 0 4.529-2.862 8.371-6.833 9.728-.507.101-.687-.219-.687-.492 0-.338.012-1.442.012-2.814 0-.956-.32-1.58-.679-1.898 2.227-.254 4.567-1.121 4.567-5.059 0-1.12-.388-2.034-1.03-2.752.104-.259.447-1.302-.098-2.714 0 0-.838-.275-2.747 1.051A9.396 9.396 0 0 0 10 4.958a9.375 9.375 0 0 0-2.503.345C5.586 3.977 4.746 4.252 4.746 4.252c-.543 1.412-.2 2.455-.097 2.714-.639.718-1.03 1.632-1.03 2.752 0 3.928 2.335 4.808 4.556 5.067-.286.256-.545.708-.635 1.371-.57.262-2.018.715-2.91-.852 0 0-.529-.985-1.533-1.057 0 0-.975-.013-.068.623 0 0 .655.315 1.11 1.5 0 0 .587 1.83 3.369 1.21.005.857.014 1.665.014 1.909 0 .271-.184.588-.683.493C2.865 18.627 0 14.783 0 10.253 0 4.59 4.478 0 10 0"/></svg>
   `
   el.githubContainer.insertAdjacentHTML('afterbegin', github)
})

const nextSvg = (() => {
   const playerSkipForward = `
      <svg width="${SVG_SIZE.controlButton}" height="${SVG_SIZE.controlButton}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path fill="currentColor" stroke="none" d="M3 5v14a1 1 0 0 0 1.504.864l12-7a1 1 0 0 0 0-1.728l-12-7A1 1 0 0 0 3 5zM20 4a1 1 0 0 1 .993.883L21 5v14a1 1 0 0 1-1.993.117L19 19V5a1 1 0 0 1 1-1z"/></svg>
   `
   el.nextBtn.insertAdjacentHTML('afterbegin', playerSkipForward)
})


export const playSvg = (() => {
   const playerPlayFilled = `
      <svg width="${SVG_SIZE.controlButton}" height="${SVG_SIZE.controlButton}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon icon-tabler icon-tabler-player-play-filled" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path fill="currentColor" stroke="none" d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4z"/></svg>
   `
   el.startBtn.innerHTML = ''
   el.startBtn.insertAdjacentHTML('afterbegin', playerPlayFilled)
})

export const pauseSvg = (() => {
   const playerPauseFilled = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path fill="currentColor" stroke="none" d="M9 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM17 4h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
   `
   el.startBtn.innerHTML = ''
   el.startBtn.insertAdjacentHTML('afterbegin', playerPauseFilled)
})

const resetSvg = (() => {
   const eraser = `
      <svg width="${SVG_SIZE.controlButton}" height="${SVG_SIZE.controlButton}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m30 14-8 8-11-11 8-8 11 11zm-19.707-2.293L2 20l8 8h6l5.293-5.293-11-11z" fill="currentColor"/></svg>
   `
   el.resetBtn.insertAdjacentHTML('afterbegin', eraser)
})

const gridlineSvg = (() => {
   const borderAll = `
      <svg width="${SVG_SIZE.controlButton}" height="${SVG_SIZE.controlButton}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 12h16M12 4v16"/></svg>
   `
   el.toggleGridlineBtn.insertAdjacentHTML('afterbegin', borderAll)
})
