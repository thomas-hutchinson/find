/*
 * Devices — App entry point.
 *
 * The Shell imports this module lazily and renders its default export. Styles
 * are imported here so they arrive with the App's chunk and never load for
 * another App.
 */
import './palette.css'
import './devices.css'
import App from './App'

export default App
