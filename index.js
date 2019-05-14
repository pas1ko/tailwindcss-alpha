const Color = require('color')

const PREFIXES = {
  backgroundColor: ['bg'],
  textColor: ['text'],
  borderColor: ['border', 'border-t', 'border-r', 'border-b', 'border-l'],
  fill: ['fill'],
  stroke: ['stroke']
}

const PROPERTIES = {
  backgroundColor: ['backgroundColor'],
  textColor: ['color'],
  borderColor: [
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor'
  ],
  fill: ['fill'],
  stroke: ['stroke']
}

module.exports = function(opts = {}) {
  return function({ e, addUtilities, config }) {
    let {
      alpha = config('theme.alpha', config('theme.opacity', {})),
      modules = {
        backgroundColor: true,
        textColor: false,
        borderColor: false,
        fill: false,
        stroke: false
      }
    } = opts

    Object.entries(alpha).forEach(([alphaKey, alphaValue]) => {
      let alphaValueFloat = parseFloat(alphaValue)
      if (alphaValueFloat === 0 || alphaValueFloat === 1) return null

      Object.entries(modules).forEach(([configKey, variants]) => {
        if (variants === true) {
          variants = config(`variants.${configKey}`, [])
        }
        if (variants === false) return

        let colors = config(`theme.${configKey}`, {})

        addUtilities(
          Object.entries(colors)
            .map(([colorKey, color]) => {
              try {
                let parsed = Color(color)
                if (parsed.valpha === 1) {
                  return PREFIXES[configKey].map((prefix, i) => {
                    return {
                      [`.${e(`${prefix}-${colorKey}-${alphaKey}`)}`]: {
                        [`${PROPERTIES[configKey][i]}`]: parsed
                          .alpha(alphaValueFloat)
                          .string()
                      }
                    }
                  })
                }
              } catch (err) {
                return null
              }
              return null
            })
            .filter(Boolean),
          variants
        )
      })
    })
  }
}
