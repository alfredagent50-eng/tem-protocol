const currencies = new Set(['ILS', 'USD', 'EUR']);
const requestStatuses = new Set(['host_review', 'accepted', 'rejected']);

export function validateCreateRequest(input) {
  const errors = [];

  if (!input || typeof input !== 'object') errors.push('body must be an object');
  if (!isNonEmptyString(input?.slotId)) errors.push('slotId is required');
  if (!isNonEmptyString(input?.typeId)) errors.push('typeId is required');
  if (!isNonEmptyString(input?.guestName)) errors.push('guestName is required');
  if (!isEmail(input?.guestEmail)) errors.push('guestEmail must be a valid email');
  if (!Number.isFinite(input?.amount) || input.amount <= 0) errors.push('amount must be positive');
  if (!currencies.has(input?.currency)) errors.push('currency is unsupported');
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
      amount: input.amount,
      currency: input.currency,
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
