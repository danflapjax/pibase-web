/**
 * Renders <internal-link kind="..." id="..."/> elements generated by the core
 * parser as <a/> tags.
 */
export class InternalLink extends HTMLElement {
  constructor() {
    super()
    const kind = this.getAttribute('kind')
    const id = this.getAttribute('id')

    // FIXME – lookup name from global context and correct the href
    this.attachShadow({ mode: 'open' }).innerHTML = `<a href="http://example.com/${kind}">${kind}${id}</a>`
  }
}