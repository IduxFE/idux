/**
 * origin: https://github.com/bameyrick/js-easing-functions/blob/master/src/index.ts
 *
 * Principle of JS Easing Functions https://joshondesign.com/2013/03/01/improvedEasingEquations
 * or https://github.com/ai/easings.net.
 *
 * `elapsed` is the current time, starting at zero,
 * `duration` is the duration in time,
 * `initialValue` and `amountOfChange` are the starting and ending values.
 */

export type EasingFn = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => number

export const easeInOutQuad: EasingFn = (
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number,
) => {
  if (duration <= 0) {
    return amountOfChange
  }
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue
}

export const easeInOutCubic: EasingFn = (
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number,
) => {
  if (duration <= 0) {
    return amountOfChange + initialValue
  }
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed * elapsed + initialValue
  }
  return (amountOfChange / 2) * ((elapsed -= 2) * elapsed * elapsed + 2) + initialValue
}
