import { pause } from './step'

export const UI = {
  devToggle: (() => {
    const container = document.createElement('div')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', (e) =>
      pause.setIsEnabled((e.target as unknown as { checked: boolean }).checked)
    )
    checkbox.name = 'enable-dev'
    const label = document.createElement('label')
    label.htmlFor = checkbox.name
    label.innerText = 'Enable Dev mode'
    container.appendChild(label)
    container.appendChild(checkbox)
    return container
  })(),
  stepButton: (() => {
    const el = document.createElement('button')
    el.innerText = 'Next'
    return el
  })(),
  notification: document.createElement('div'),
}

function init() {
  const root = document.getElementById('dev-tools')!
  root.appendChild(UI.devToggle)
  root.appendChild(UI.stepButton)
  root.appendChild(UI.notification)
}
init()
