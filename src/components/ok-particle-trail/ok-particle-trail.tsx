import {Component, Element, h, Host} from '@stencil/core';
import {createAnimation} from '@ionic/core';

@Component({
  tag: 'ok-particle-trail',
  styleUrl: 'ok-particle-trail.css',
  shadow: true,
})
export class OkParticleTrail {

  @Element()
  el: HTMLElement;

  aHost!: HTMLDivElement;

  createParcticleGroupAnimation (particles: NodeList, delay: number){
    // get all particles with the same data-delay
    return createAnimation()
      .addElement(particles)
      .duration(1250)
      .iterations(1)
      .easing('linear')
      .delay(delay * 20)
      // .keyframes([
      //   { offset: 0, opacity: '0'},
      //   { offset: 0.3, opacity: '1' },
      //   { offset: 1.0, opacity: '0' }
      // ]);
      .fromTo('opacity', '0', '1');
  }

  hideParcticleGroupAnimation (particles: NodeList, delay: number){
    // get all particles with the same data-delay
    return createAnimation()
      .addElement(particles)
      .duration(1250)
      .iterations(1)
      .easing('linear')
      .delay(delay * 20)
      // .keyframes([
      //   { offset: 0, opacity: '0'},
      //   { offset: 0.3, opacity: '1' },
      //   { offset: 1.0, opacity: '0' }
      // ]);
     .fromTo('opacity', '1', '0');
  }


  private groupBy(list: any [], key: number | string) {
    return list.reduce((accu, val) => {
      const group = val[key] ?? val.getAttribute(key);
      const arr = (accu[group] || []);
      accu[group] = arr.concat([val]);
      return accu;
    }, {});
  }

  createParticlesAnimation() {
    // create animation for each div and delay them, then join the animations
    // TODO: Test if this can be replaced by element refs into an array
    const particles = this.aHost.querySelectorAll('div.dot');
    const group = this.groupBy(Array.from(particles), "data-delay");
    const animations = Object.entries(group).map(([key, value]) => {
      return this.createParcticleGroupAnimation(value as unknown as NodeList, Number(key));
    });

    return createAnimation()
      .duration(12500)
      .iterations(Infinity)
      .addAnimation(animations);
  }

  hideParticlesAnimation() {
    // create animation for each div and delay them, then join the animations
    // TODO: Test if this can be replaced by element refs into an array
    const particles = this.aHost.querySelectorAll('div.dot');
    const group = this.groupBy(Array.from(particles), "data-delay");
    const animations = Object.entries(group).map(([key, value]) => {
      return this.hideParcticleGroupAnimation(value as unknown as NodeList, Number(key));
    });

    return createAnimation()
      .duration(1250)
      .iterations(Infinity)
      .addAnimation(animations);
  }

  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async componentDidLoad () {
    window.setTimeout(async () => {
      while(true) {
        await this.createParticlesAnimation().play();
        this.createParticlesAnimation().pause();
        await this.hideParticlesAnimation().play();
        this.hideParticlesAnimation().pause();
      }
    })
    return true;
  }

  drawParticles() {
    const density = 12;
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

  drawParticle(position: {x: number, y: number},index: number ,count = 15) {
    return [...Array(count).keys()].map(() => {
      const size = this.getRandomInt(5, 10);
      const style = {
        width: size + "px",
        height: size + "px",
        left: position.x + this.getRandomInt(-15, 15) + "px",
        top: position.y + this.getRandomInt(-15, 15) + "px",
        backgroundColor: "hsl(60, 100%, 80%)",
        opacity: "0"
      } as any;
      return <div data-delay={index} class={'dot'} style={style}/>;
    });
  }

  render() {
    return (
      <Host>
        <div ref={ (el) => {
          this.aHost = el;
        }} class={'anime-container'}>
          {this.drawParticles()}
        </div>
      </Host>
    );
  }

}
