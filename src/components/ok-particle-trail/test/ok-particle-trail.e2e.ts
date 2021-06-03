import { newE2EPage } from '@stencil/core/testing';

describe('ok-particle-trail', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ok-particle-trail></ok-particle-trail>');

    const element = await page.find('ok-particle-trail');
    expect(element).toHaveClass('hydrated');
  });
});
