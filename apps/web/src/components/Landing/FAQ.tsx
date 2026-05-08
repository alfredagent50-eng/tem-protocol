/**
 * Brief, opinionated FAQ. Voice rules: plural, present, considered.
 * No apologies for the model.
 */
import React from 'react';

export function FAQ() {
  return (
    <section className="faq-section" id="faq" aria-label="Frequently asked">
      <div>
        <p className="overline">Questions</p>
        <h2>The model, plainly.</h2>
      </div>

      <div className="faq-list">
        <details className="faq-item">
          <summary>Why does time cost money?</summary>
          <p>
            Because it does. The product premise is self-evident — paid time
            is honest time. We won't apologize for it.
          </p>
        </details>

        <details className="faq-item">
          <summary>What if the host doesn't accept?</summary>
          <p>
            The hold returns. You're never charged for time that didn't happen.
            Most hosts respond inside a day; some inside an hour.
          </p>
        </details>

        <details className="faq-item">
          <summary>Can I bid up on a busy slot?</summary>
          <p>
            Yes. Public pages only show market state — the next bid floor —
            never the private notes of who else asked.
          </p>
        </details>

        <details className="faq-item">
          <summary>What does the host see?</summary>
          <p>
            Your name, your contact, the slot, and a short note. Money's
            held until they accept. Then it pays out on completion.
          </p>
        </details>
      </div>
    </section>
  );
}
