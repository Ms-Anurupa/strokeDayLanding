/** aria props for an input inside <Field>. */
export function fieldAria(id, error, hint) {
  return {
    id,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  }
}
