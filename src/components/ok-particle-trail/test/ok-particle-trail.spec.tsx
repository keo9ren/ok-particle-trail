import { newSpecPage } from '@stencil/core/testing';
import { OkParticleTrail } from '../ok-particle-trail';

describe('ok-particle-trail', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OkParticleTrail],
      html: `<ok-particle-trail></ok-particle-trail>`,
    });
    expect(page.root).toEqualHtml(`
      <ok-particle-trail>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ok-particle-trail>
    `);
  });
});
