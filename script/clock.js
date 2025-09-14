function Clock() {
  let container = null;
  let center = null;

  const createDiv = (target, text, container) => {
    const e = document.createElement("DIV");
    e.style.backgroundColor = "#660000";
    e.style.color = "#FF0000";
    e.style.borderStyle = "solid";
    e.style.borderColor = "#FF6666";
    e.style.borderRadius = "50%";
    e.style.fontFamily = "Arial";
    e.style.fontSize = 12;
    e.style.display = "block";
    e.style.position = "absolute";
    e.style.left = target.x;
    e.style.top = target.y;
    e.style.width = target.w || 20;
    e.style.height = target.h || 20;
    container.appendChild(e);
    e.innerHTML = `<div style="position: absolute; top: 50%; text-align: center; width: 100%; transform: translateY(-50%);">${text}</div>`;
    //    centerize(e);

    e.move = (target) => {
      e.style.left = target.x - (parseFloat(e.style.width) / 2.0);
      e.style.top = target.y - (parseFloat(e.style.height) / 2.0);
      //      console.log(target, e.style.width, e.style.left);
    }

    return e;
  }

  const translateAnim = (from, to, speed) => {
    const xDiff = ((to.x - from.x) * speed);
    const x = Math.abs(xDiff) < 1 ? to.x : from.x + xDiff;
    //          console.log(`x: ${pos.x}, target: ${target.x}, diff: ${xDiff} (${Math.abs(xDiff)}) -> ${x}`);

    const yDiff = ((to.y - from.y) * speed);
    const y = Math.abs(yDiff) < 1 ? to.y : from.y + yDiff;
    //          console.log(`y: ${pos.y}, target: ${target.y}, diff: ${yDiff} (${Math.abs(yDiff)}) -> ${y}`);

    return {
      x: x,
      y: y
    }
  }

  //clock body
  const createClock = ({
    hour,
    config,
    prev
  }) => {
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const angle = hour * 30;
    const text = hours[hour];
    return createClockObject({
      hour, angle, text, size: null, config, prev
    });
  }

  const createClockObject = ({ index, angle, text, size, config, prev }) => {
    const div = createDiv({ x: 0, y: 0, w: size?.w || null, h: size?.h || null }, text, container);
    const c = {
      index: index,
      e: div,
      prev,
      init: function() {
        const label = this.e.children[0].innerHTML;

        const c = {
          x: parseFloat(center.style.left),
          y: parseFloat(center.style.top)
        }

        const target = {
          x: c.x + (config.diameter * sin(angle)),
          y: c.y - (config.diameter * cos(angle))
        }

        this.e.style.left = target.x - (parseFloat(div.style.width) / 2.0);
        this.e.style.top = target.y - (parseFloat(div.style.height) / 2.0);

        this.diff = {
          x: parseFloat(this.prev.style.left) - parseFloat(this.e.style.left),
          y: parseFloat(this.prev.style.top) - parseFloat(this.e.style.top)
        };

        //          console.log("prev: ", this.prev, ", diff: ", this.diff, this.e);
      },
      update: function(center) {
        //          console.log(label, ", angle:", angle, ", prev: ", prev, c, ", target: ", target, ", pos: ", pos);

        const prev = {
          x: parseFloat(this.prev.style.left),
          y: parseFloat(this.prev.style.top)
        }

        const target = {
          x: prev.x - this.diff.x,
          y: prev.y - this.diff.y
        }

        //absolute
        //          this.e.style.left = target.x;
        //          this.e.style.top = target.y;

        //translate
        const pos = {
          x: parseFloat(this.e.style.left),
          y: parseFloat(this.e.style.top)
        }

        const translated = translateAnim(pos, target, config.speed);
        //          console.log(label, pos, target, translated);

        this.e.style.left = translated.x;
        this.e.style.top = translated.y;
        //          console.log("width: " + this.e.style.width);
      },
      elapsed: 0
    }
    c.init();
    return c;
  }
  // end of clock body

  const createNeedle = ({
    index,
    getAngle,
    r,
    size,
    config,
    prev
  }) => {
    const div = createDiv(
      { x: 0, y: 0, w: size?.w || 5, h: size?.h || 5 },
      "",
      container
    );
    return {
      index,
      e: div,
      prev,
      update: function(center) {
        const prev = /*index == 0 ? center : */{
          x: parseFloat(this.prev.style.left),
          y: parseFloat(this.prev.style.top)
        }

        const target = {
          x: prev.x + (r * sin(getAngle())),
          y: prev.y - (r * cos(getAngle()))
        }
        //        target.x = target.x - (index == 0 ? parseFloat(this.e.style.width) / 2.0 : 0);
        //        target.y = target.y - (index == 0 ? parseFloat(this.e.style.height) / 2.0 : 0);

        const pos = {
          x: parseFloat(this.e.style.left),
          y: parseFloat(this.e.style.top)
        }

        const translated = translateAnim(pos, target, config.speed);

        this.e.style.left = translated.x;
        this.e.style.top = translated.y;
      }
    }
  }

  const sin = (v) => Math.sin(v * Math.PI / 180);
  const cos = (v) => Math.cos(v * Math.PI / 180);
  const tan = (v) => Math.tan(v * Math.PI / 180);

  const init = async (c) => {
    //    console.log("init: ", c);
    container = c;
    //    console.log("container: ", container);

    center = createDiv({ x: 0, y: 0, w: 30, h: 30 }, "", container);
    center.style.display = "none";

    //clocks
    for (let i = 0; i < 12; i++) {
      const c = createClock({
        hour: i,
        config,
        prev: i == 0 ? center : clocks[i - 1].e,
      });
      clocks.push(c);
    }

    //hours
    let len = 6;
    for (let i = 0; i < len; i++) {
      const hAngle = 360 / 12;
      const h = createNeedle({
        index: i,
        getAngle: () => {
          const now = new Date();
          return (hAngle * now.getHours()) + //hour angle +
            (hAngle / 60 * now.getMinutes()); //minute angle
        },
        r: 8,
        size: { w: 5, h: 5 },
        config,
        prev: i == 0 ? center : needle.hour[i - 1].e
      });
      needle.hour.push(h);
      h.e.style.backgroundColor = "";
    }

    //minutes
    len = 10;
    for (let i = 0; i < len; i++) {
      const m = createNeedle({
        index: i,
        getAngle: () => 360 / 60 * new Date().getMinutes(),
        r: 8,
        size: { w: 5, h: 5 },
        config,
        prev: i == 0 ? center : needle.minute[i - 1].e
      });
      needle.minute.push(m);
      m.e.style.backgroundColor = "";
    }

    //seconds
    len = 10;
    for (let i = 0; i < len; i++) {
      const s = createNeedle({
        index: i,
        getAngle: () => 360 / 60 * new Date().getSeconds(),
        r: 8,
        size: { w: 5, h: 5 },
        config,
        prev: i == 0 ? center : needle.second[i - 1].e
      });
      needle.second.push(s);
      s.e.style.backgroundColor = "#FF6666";
      s.e.style.borderStyle = "none";
    }

    window.addEventListener("mousemove", (event) => {
      target.x = event.x;
      target.y = event.y;
    });
  }

  const start = async () => {
    let executionTime = new Date().getTime();
    let totalElapsed = 0;
    setTimeout(() => {
      const now = new Date().getTime();
      const elapsed = (now - executionTime);
      totalElapsed += elapsed;

      center.move(target);

      clocks.map((clock, index) => {
        clock.update(target);
      });

      needle.hour.map((hour, index) => {
        hour.update(target);
      });

      needle.minute.map((minute, index) => {
        minute.update(target);
      });

      needle.second.map((second, index) => {
        second.update(target);
      });

      start();
    }, 1);
  };

  const config = {
    speed: 0.2,
    diameter: 100,
    interval: 1
  }

  const target = {
    x: 0,
    y: 0
  }

  //clocks
  const clocks = []; //[createClock(6, config, target)]

  //needle
  const needle = {
    hour: [],
    minute: [],
    second: []
  }
  console.log("this: ", this);
  return {
    init,
    start
  }
}

