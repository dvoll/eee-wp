# Readme

## Notes

### Fluid font size calculation

Preferred size linear faktor:

$maxScreenWidth = 62.5rem$ (1000px; layout.wideSize)

$minScreenWidth = 20rem$ (320px)

$linearFactor = 100 * ((maxFontSize - minFontSize) / (maxScreenWidth - minScreenWidth))$

$preferredFontSize = minFontSize + ((1vw - 0.2rem) * linearFactor)$
