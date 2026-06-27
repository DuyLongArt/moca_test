import screensJson from './screens.json'

export const STITCH_PROJECT_ID = screensJson.projectId

export const stitchScreens = screensJson.screens

export type StitchScreenKey = keyof typeof stitchScreens
