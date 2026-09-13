/*
 * IDE — App entry point.
 *
 * The Shell imports this module lazily and renders its default export, so
 * CodeMirror only downloads when you actually open the IDE.
 */
import './ide.css'
import IdeApp from './IdeApp'

export default IdeApp
