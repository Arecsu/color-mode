// Add dark / light detection that runs before loading Nuxt

// Global variable minimizers
const w = window
const de = document.documentElement

const knownColorSchemes = ['dark', 'light']

const preference = window.localStorage.getItem('<%= options.storageKey %>') || '<%= options.preference %>'
const themeColors = JSON.parse('<%= options.escapedThemeColors %>')
// Get previous meta element if the script is run the second time (e.g. in dev mode)
let themeColorMetaElm = d.head.querySelector('meta[data-nuxtjs-color-mode]')
let value = preference === 'system' ? getColorScheme() : preference
// Applied forced color mode
const forcedColorMode = de.getAttribute('data-color-mode-forced')
if (forcedColorMode) {
  value = forcedColorMode
}

addColorScheme(value)

w['<%= options.globalName %>'] = {
  preference,
  value,
  getColorScheme,
  addColorScheme,
  removeColorScheme
}

function addColorScheme (value) {
  const className = '<%= options.classPrefix %>' + value + '<%= options.classSuffix %>'
  const dataValue = '<%= options.dataValue %>'
  if (de.classList) {
    de.classList.add(className)
  } else {
    de.className += ' ' + className
  }
  if (dataValue) {
    de.setAttribute('data-' + dataValue, value)
  }

  const themeColor = themeColors && themeColors[value]
  if (themeColor) {
    if (!themeColorMetaElm) {
      themeColorMetaElm = d.createElement('meta')
      themeColorMetaElm.setAttribute('data-nuxtjs-color-mode', '')
      themeColorMetaElm.name = 'theme-color'
    }
    themeColorMetaElm.content = themeColor
    if (themeColorMetaElm.parentNode !== d.head) {
      d.head.appendChild(themeColorMetaElm)
    }
  } else if (themeColorMetaElm && themeColorMetaElm.parentNode) {
    themeColorMetaElm.parentNode.removeChild(themeColorMetaElm)
  }
}

function removeColorScheme (value) {
  const className = '<%= options.classPrefix %>' + value + '<%= options.classSuffix %>'
  const dataValue = '<%= options.dataValue %>'
  if (de.classList) {
    de.classList.remove(className)
  } else {
    de.className = de.className.replace(new RegExp(className, 'g'), '')
  }
  if (dataValue) {
    de.removeAttribute('data-' + dataValue)
  }
}

function prefersColorScheme (suffix) {
  return w.matchMedia('(prefers-color-scheme' + suffix + ')')
}

function getColorScheme () {
  if (w.matchMedia && prefersColorScheme('').media !== 'not all') {
    for (const colorScheme of knownColorSchemes) {
      if (prefersColorScheme(':' + colorScheme).matches) {
        return colorScheme
      }
    }
  }

  return '<%= options.fallback %>'
}
