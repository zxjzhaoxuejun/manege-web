export function generateTitle(title) {
  const haskey = this.$te(`route.${title}`)
  if (haskey) {
    return this.$t(`route.${title}`)
  }
  return title
}

