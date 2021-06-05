import {Component, Element, h, Host} from '@stencil/core';
import '@ionic/core';
import {createAnimation} from '@ionic/core';

@Component({
  tag: 'ok-particle-trail',
  styleUrl: 'ok-particle-trail.css',
  shadow: true,
})
export class OkParticleTrail {

  @Element()
  el: HTMLElement;

  particles: HTMLDivElement [] = [];

  private scattering = {
    minus: -10,
    plus: 10
  }

  async componentDidLoad () {
    window.setTimeout(async () => {
      const groups = this.groupBy(Array.from(this.particles), "data-delay");
      const showAnimations = this.createShowAnimations(groups);
      const hideAnimations = this.createHideAnimations(groups);
      const show = this.createParticlesAnimation(showAnimations);
      const hide = this.hideParticlesAnimation(hideAnimations);
      // play attribute
      while(true) {
        await show.play();
        show.stop();
        await hide.play();
        hide.stop();
      }
    })
    return true;
  }

  render() {
    return (
      <Host>
        <div
          class={'anime-container'}>
          {this.drawParticles()}
        </div>
      </Host>
    );
  }

  private drawParticles() {
    const density = 15;
    const length = 110;
    return [...Array(length).keys()].map((i) => {
      const angle = 0.1 * i;
      const innerWidth = this.el.offsetWidth;
      const innerHeight = this.el.offsetHeight;
      const x = (density * angle) * Math.cos(angle) + innerWidth / 2;
      const y = (density * angle) * Math.sin(angle) + innerHeight / 2;
      return this.drawParticle({x, y}, i)
    });
  }

  private drawParticle(position: {x: number, y: number},index: number ,count = 30) {
    return [...Array(count).keys()].map(() => {
      const size = this.getRandomInt(5, 10);
      const style = {
        width: size + "px",
        height: size + "px",
        transform: `translate3d(${this.getScatteredPosition(position.x)}, ${this.getScatteredPosition(position.y)}, 0px)`,
      } as any;
      return <div ref={ (el) => {
        this.particles = [...this.particles, el];
      }} data-delay={index} class={'particle'} style={style}/>;
    });
  }

  private getScatteredPosition(basePos: number) {
    return basePos + this.getRandomInt(this.scattering.minus, this.scattering.plus) + "px";
  }

  private createParcticleGroupAnimation (particles: NodeList, delay: number){
    // get all particles with the same data-delay
    return createAnimation()
      .addElement(particles)
      .duration(1250)
      .iterations(1)
      .easing('linear')
      .delay(delay * 20)
      .fromTo('opacity', '0', '1');
  }

  private hideParcticleGroupAnimation (particles: NodeList, delay: number){
    // get all particles with the same data-delay
    return createAnimation()
      .addElement(particles)
      .duration(1250)
      .iterations(1)
      .easing('linear')
      .delay(delay * 20)
      .fromTo('opacity', '1', '0');
  }

  private createParticlesAnimation(animations) {
    // create animation for each div and delay them, then join the animations

    return createAnimation()
      .duration(12500)
      .iterations(Infinity)
      .addAnimation(animations);
  }

  private hideParticlesAnimation(animations) {
    // create animation for each div and delay them, then join the animations
    return createAnimation()
      .duration(1250)
      .iterations(Infinity)
      .addAnimation(animations);
  }

  private createShowAnimations(groups: Record<string, HTMLDivElement[]>) {
    return  Object.entries(groups).map(([key, value]) => {
      return this.createParcticleGroupAnimation(value as unknown as NodeList, Number(key));
    });
  }

  private createHideAnimations (groups: Record<string, HTMLDivElement []>) {
    return Object.entries(groups).map(([key, value]) => {
      return this.hideParcticleGroupAnimation(value as unknown as NodeList, Number(key));
    });
  }

  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private groupBy(list: any [], key: number | string) {
    return list.reduce((accu, val) => {
      const group = val[key] ?? val.getAttribute(key);
      const arr = (accu[group] || []);
      accu[group] = arr.concat([val]);
      return accu;
    }, {});
  }

}
