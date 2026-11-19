function Lightning() {
  let container = null;
  let center = null;

  const createDiv = (target, text, container) => {
    const e = document.createElement("DIV");
    e.style.backgroundColor = "#FFFFFF";
//    e.style.color = "#FFFFFF";
    e.style.borderStyle = null;
//    e.style.borderColor = "#66FF66";
//    e.style.borderRadius = "50%";
//    e.style.fontFamily = "Arial";
//    e.style.fontSize = 12;
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

  const init = async (c) => {
    console.log("init... container: ", c);

    container = c;
    center = createDiv({ x: 100, y: 100, w: 5, h: 5}, "", container);
  }

  const start = async () => {
    let executionTime = performance.now();
    console.log("start: " + executionTime);
    setTimeout(() => exec(executionTime, 0), config.interval);
  }

  const exec = (executionTime, totalFrame) => {
    const now = performance.now();
    const elapsed = (now - executionTime);
    executionTime = now;
    totalFrame += elapsed * config.fps / 1000;

//    console.log("exec. now: " + now 
//      + ", delay: " + config.fps
//      + ", elapsed: " + elapsed 
//      + ", totalFrame: " + totalFrame);
    if (totalFrame >= config.fps) {
      console.log("updated on: " + totalFrame + " frames...");
      totalFrame -= config.fps;
    }

    setTimeout(() => exec(executionTime, totalFrame), config.interval);
  }

  const config = {
    interval: 100,
    fps: 60,
    branch: { min: 1, max: 5 }
  }

  const lightnings = [];

  console.log("this: ", this);
  return {
    init,
    start
  }
}
