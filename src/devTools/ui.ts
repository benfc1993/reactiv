import { getVDomRoot, nodePointers } from '../react/globalState'
import { getNodeTree } from './nodeTree'
import { pause } from './step'
import '@andypf/json-viewer'

type JsonViewer = HTMLElement & {
  id: string
  expanded: number
  indent: number

  showDataTypes: boolean
  theme: string
  showToolbar: boolean
  showSize: boolean
  showCopy: boolean
  expandIconType: string
  data: Record<string, any> | null
}

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
  vDomButton: (() => {
    const el = document.createElement('button')
    el.innerText = 'view virtual dom'
    let open = false
    el.addEventListener('click', () => {
      const jsonViewerContainer = document.getElementById('json-viewer')
      if (!jsonViewerContainer) return

      const jsonViewer = document.createElement(
        'andypf-json-viewer'
      ) as JsonViewer

      jsonViewer.id = 'json'
      jsonViewer.indent = 2
      jsonViewer.expanded = 1
      jsonViewer.showDataTypes = true
      jsonViewer.theme = 'monokai'
      jsonViewer.showToolbar = true
      jsonViewer.showSize = true
      jsonViewer.showCopy = true
      jsonViewer.expandIconType = 'square'
      jsonViewer.data = getVDomRoot()
      jsonViewerContainer.innerHTML = ''
      open = !open
      el.innerText = open ? 'hide virtual dom' : 'view virtual dom'
      if (open) jsonViewerContainer.appendChild(jsonViewer)
    })
    return el
  })(),

  notification: document.createElement('div'),
}

function init() {
  const root = document.getElementById('dev-tools')!
  root.appendChild(UI.devToggle)
  root.appendChild(UI.stepButton)
  root.appendChild(UI.notification)
  root.appendChild(UI.vDomButton)
}
init()
