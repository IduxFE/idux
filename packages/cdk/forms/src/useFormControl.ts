/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { ComputedRef, DeepReadonly, Ref, UnwrapRef } from 'vue'
import type {
  AsyncValidatorFn,
  ValidatorFn,
  ValidatorOptions,
  TriggerType,
  ValidationError,
  ErrorMessages,
  ValidStatus,
  Errors,
} from './types'

import { computed, readonly, ref, watchEffect } from 'vue'
import { isArray, isNil, isObject } from '@idux/cdk/utils'
import { Validators } from './validators'
import { ModelType } from './constant'

export interface FormControl<T = any> {
  /**
   * The ref value for the control.
   */
  modelRef: Ref<UnwrapRef<T> | null>

  /**
   * The validation status of the control, there are three possible validation status values:
   * * **valid**: This control has passed all validation checks.
   * * **invalid**: This control has failed at least one validation check.
   * * **validating**: This control is in the midst of conducting a validation check.
   */
  status: DeepReadonly<Ref<ValidStatus>>

  /**
   * An object containing any errors generated by failing validation, or null if there are no errors.
   */
  errors: DeepReadonly<Ref<Errors | null>>

  /**
   * Running validations manually, rather than automatically.
   */
  validate: () => Promise<Errors | null>

  /**
   * Resets the form control, marking it `unblurred`, and setting the value to initialization value.
   */
  reset: () => void

  /**
   * Sets a new value for the form control.
   *
   * @param value The new value.
   */
  setValue: (value: T | null) => void

  /**
   * Sets the new sync validator for the form control, it overwrites existing sync validators.
   * If you want to clear all sync validators, you can pass in a null.
   */
  setValidator: (newValidator: ValidatorFn | ValidatorFn[] | null) => void

  /**
   * Sets the new async validator for the form control, it overwrites existing async validators.
   * If you want to clear all async validators, you can pass in a null.
   */
  setAsyncValidator: (newAsyncValidator: AsyncValidatorFn | AsyncValidatorFn[] | null) => void

  /**
   * Sets errors on a form control when running validations manually, rather than automatically.
   */
  setErrors: (newErrors: Errors | null) => void

  /**
   * Reports error data for the control.
   *
   * @param errorCode The code of the error to check
   */
  getError: (errorCode: keyof ErrorMessages) => ValidationError | null

  /**
   * Reports whether the control has the error specified.
   *
   * @param errorCode The code of the error to check
   */
  hasError: (errorCode: keyof ErrorMessages) => boolean

  /**
   * Marks the control as `blurred`.
   */
  markAsBlurred: () => void

  /**
   * Marks the control as `unblurred`.
   */
  markAsUnblurred: () => void

  /**
   * A control is valid when its `status` is `valid`.
   */
  valid: ComputedRef<boolean>

  /**
   * A control is invalid when its `status` is `invalid`.
   */
  invalid: ComputedRef<boolean>

  /**
   * A control is validating when its `status` is `validating`.
   */
  validating: ComputedRef<boolean>

  /**
   * A control is marked `blurred` once the user has triggered a `blur` event on it.
   */
  blurred: ComputedRef<boolean>

  /**
   * A control is `unblurred` if the user has not yet triggered a `blur` event on it.
   */
  unblurred: ComputedRef<boolean>
}

export function useFormControl<T = any>(
  initValue?: T | null,
  validator?: ValidatorFn | ValidatorFn[] | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
): FormControl<T>
export function useFormControl<T = any>(initValue?: T | null, options?: ValidatorOptions | null): FormControl<T>
export function useFormControl<T = any>(
  initValue: T | null = null,
  validatorOrOptions?: ValidatorFn | ValidatorFn[] | ValidatorOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
): FormControl<T> {
  const modelRef = ref(initValue)
  const status = ref<ValidStatus>('valid')
  const blurred = ref(false)
  const errors = ref<Errors | null>(null)

  let { _validator, _asyncValidator, _trigger } = convertOptions(validatorOrOptions, asyncValidator)

  const reset = () => {
    modelRef.value = initValue as any
    markAsUnblurred()
  }

  const setValue = (value: T | null) => {
    modelRef.value = value as any
  }

  const setValidator = (newValidator: ValidatorFn | ValidatorFn[] | null) => {
    _validator = toValidator(newValidator)
  }

  const setAsyncValidator = (newAsyncValidator: AsyncValidatorFn | AsyncValidatorFn[] | null) => {
    _asyncValidator = toAsyncValidator(newAsyncValidator)
  }

  const setErrors = (newErrors: Errors | null) => {
    errors.value = newErrors
    status.value = newErrors ? 'invalid' : 'valid'
  }

  const getError = (errorCode: keyof ErrorMessages) => {
    return errors.value ? errors.value[errorCode] ?? null : null
  }

  const hasError = (errorCode: keyof ErrorMessages) => !!getError(errorCode)

  const markAsBlurred = () => {
    blurred.value = true
  }

  const markAsUnblurred = () => {
    blurred.value = false
  }

  const _runValidator = () => {
    return _validator ? _validator(modelRef.value) : null
  }
  const _runAsyncValidator = () => {
    if (!_asyncValidator) {
      return null
    }
    status.value = 'validating'
    return _asyncValidator(modelRef.value)
  }

  const validate = async () => {
    let newErrors = _runValidator()
    if (isNil(newErrors)) {
      newErrors = await _runAsyncValidator()
    }
    setErrors(newErrors)
    return newErrors
  }

  watchEffect(() => {
    if (_trigger === 'change' || (_trigger === 'blur' && blurred.value)) {
      validate()
    }
  })

  return {
    __type: ModelType.Control,
    modelRef,
    status: readonly(status),
    errors: readonly(errors),
    validate,
    reset,
    setValue,
    setValidator,
    setAsyncValidator,
    setErrors,
    getError,
    hasError,
    markAsBlurred,
    markAsUnblurred,
    valid: computed(() => status.value === 'valid'),
    invalid: computed(() => status.value === 'invalid'),
    validating: computed(() => status.value === 'validating'),
    blurred: computed(() => blurred.value),
    unblurred: computed(() => !blurred.value),
  } as FormControl<T>
}

function toValidator(validator?: ValidatorFn | ValidatorFn[] | null): ValidatorFn | null {
  return isArray(validator) ? Validators.compose(validator) : validator || null
}

function toAsyncValidator(asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): AsyncValidatorFn | null {
  return isArray(asyncValidator) ? Validators.composeAsync(asyncValidator) : asyncValidator || null
}

function isOptions(val?: ValidatorFn | ValidatorFn[] | ValidatorOptions | null): val is ValidatorOptions {
  return isObject(val) && !isArray(val)
}

function convertOptions(
  validatorOrOptions: ValidatorFn | ValidatorFn[] | ValidatorOptions | null | undefined,
  asyncValidator: AsyncValidatorFn | AsyncValidatorFn[] | null | undefined,
) {
  let _trigger: TriggerType = 'change'
  let _validator: ValidatorFn | null
  let _asyncValidator: AsyncValidatorFn | null
  if (isOptions(validatorOrOptions)) {
    _trigger = validatorOrOptions.trigger ?? _trigger
    _validator = toValidator(validatorOrOptions.validators)
    _asyncValidator = toAsyncValidator(validatorOrOptions.asyncValidators)
  } else {
    _validator = toValidator(validatorOrOptions)
    _asyncValidator = toAsyncValidator(asyncValidator)
  }
  return { _validator, _asyncValidator, _trigger }
}
