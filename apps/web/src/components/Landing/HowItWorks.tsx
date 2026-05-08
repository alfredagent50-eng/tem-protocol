/**
 * Three-step explainer. Editorial — display serif headings, terse copy,
 * matter-of-fact about the model. No exclamation marks. No metaphor stacking.
 */
import React from 'react';

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works" aria-label="How it works">
      <div>
        <p className="overline">How it works</p>
        <h2>One link. One slot. One real signal.</h2>
      </div>

      <div className="how-steps">
        <article className="how-step">
          <span className="step-num">01</span>
          <h3>Pick a sip.</h3>
          <p>
            Choose a fifteen-minute slot from a host's public calendar. The
            price is set up front — never after the click.
          </p>
        </article>

        <article className="how-step">
          <span className="step-num">02</span>
          <h3>Pay the minimum.</h3>
          <p>
            We hold the funds. The host sees a paid request enter their
            inbox; you see a clean confirmation.
          </p>
        </article>

        <article className="how-step">
          <span className="step-num">03</span>
          <h3>Pour, or pass.</h3>
          <p>
            The host accepts or returns the hold. You're charged only when
            they pour. Either way, your time wasn't wasted.
          </p>
        </article>
      </div>
    </section>
  );
}
