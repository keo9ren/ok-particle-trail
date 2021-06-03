import { Component, Host, h, Element } from '@stencil/core';
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

  createParticleAnimation() {
    let particles = this.aHost.querySelectorAll('div.dot');
    return createAnimation()
      .addElement(particles)
      .duration(50)
      .iterations(Infinity)
      .easing('linear')
      .fromTo('opacity', '0', '1');
  }

  drawParticles() {
    const density = 12;
    const length = 110;
    for (const i of [...Array(length).keys()]){
      const angle = 0.1 * i;
      //shift the particles to the center of the window
      //by adding half of the screen width and screen height
      const innerWidth = this.el.offsetWidth|| window.innerWidth;
      const innerHeight = this.el.offsetHeight || window.innerHeight;
      const x = (density * angle) * Math.cos(angle) + innerWidth / 2;
      const y = (density * angle) * Math.sin(angle) + innerHeight / 2;

      this.particlesforAngel({x, y});

    }
  }

  particlesforAngel (position: {x: number, y: number}, count = 15){
    const container = this.aHost;
    // @ts-ignore
    for (const i of [...Array(count).keys()]){
      const dot = document.createElement("div");
      dot.classList.add("dot");
      container.appendChild(dot);
      // size = 3;
      const size = this.getRandomInt(5, 10);
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = position.x + this.getRandomInt(-15, 15) + "px";
      dot.style.top = position.y + this.getRandomInt(-15, 15) + "px";
      dot.style.backgroundColor = "hsl(60, 100%, 80%)";
      // Before the animation start all particles should be invisible
      dot.style.opacity = "0";
    }
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  async componentDidLoad () {
    this.drawParticles();
    return this.createParticleAnimation().play();
  }

  render() {
    return (
      <Host>
        <div ref={ (el) => {
          this.aHost = el;
        }} class={'anime-container'}></div>
      </Host>
    );
  }

}
