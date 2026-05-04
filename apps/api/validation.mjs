const currencies = new Set(['USD', 'EUR', 'GBP', 'ILS']);
const requestStatuses = new Set(['pending_payment', 'paid', 'host_review', 'accepted', 'completed', 'rejected', 'expired']);

export function validateCreateRequest(input) {
  const errors = [];

  if (!input || typeof input !== 'object') errors.push('body must be an object');
  if (!isNonEmptyString(input?.slotId)) errors.push('slotId is required');
  if (!isNonEmptyString(input?.typeId)) errors.push('typeId is required');
  if (!isNonEmptyString(input?.guestName)) errors.push('guestName is required');
  if (!isEmail(input?.guestEmail)) errors.push('guestEmail must be a valid email');
  if (!isNonEmptyString(input?.paymentIntentId)) errors.push('paymentIntentId is required');
  if (input?.note != null && typeof input.note !== 'string') errors.push('note must be a string');

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      slotId: input.slotId.trim(),
      typeId: input.typeId.trim(),
      guestName: input.guestName.trim(),
      guestEmail: input.guestEmail.trim(),
      note: input.note?.trim?.() ?? '',
      paymentIntentId: input.paymentIntentId.trim(),
    },
  };
}

export function validateStatus(input) {
  if (!requestStatuses.has(input?.status)) {
    return { ok: false, errors: ['status is unsupported'] };
  }
  return { ok: true, value: input.status };
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
