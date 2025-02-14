let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.initialAngle = 0;

    this.init();
  }

  init() {
    // Desktop Events
    this.paper.addEventListener("mousedown", (e) => this.onMouseDown(e));
    document.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", () => this.onMouseUp());

    // Mobile Events
    this.paper.addEventListener("touchstart", (e) => this.onTouchStart(e), { passive: false });
    this.paper.addEventListener("touchmove", (e) => this.onTouchMove(e), { passive: false });
    this.paper.addEventListener("touchend", () => this.onTouchEnd());
  }

  onMouseDown(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    this.paper.style.zIndex = highestZ++;
    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;

    if (e.button === 2) this.rotating = true;
  }

  onMouseMove(e) {
    if (!this.holdingPaper) return;

    this.velX = e.clientX - this.prevMouseX;
    this.velY = e.clientY - this.prevMouseY;

    if (this.rotating) {
      this.rotation += this.velX * 0.5;
    } else {
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    }

    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;

    this.updateTransform();
  }

  onMouseUp() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  onTouchStart(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    this.paper.style.zIndex = highestZ++;
    
    this.prevMouseX = e.touches[0].clientX;
    this.prevMouseY = e.touches[0].clientY;

    if (e.touches.length === 2) {
      this.rotating = true;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      this.initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    }
  }

  onTouchMove(e) {
    e.preventDefault();
    if (!this.holdingPaper) return;

    if (e.touches.length === 2 && this.rotating) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      this.rotation += newAngle - this.initialAngle;
      this.initialAngle = newAngle;
    } else {
      this.velX = e.touches[0].clientX - this.prevMouseX;
      this.velY = e.touches[0].clientY - this.prevMouseY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
    }

    this.updateTransform();
  }

  onTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  updateTransform() {
    this.paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
  }
}

// Apply the script to all papers
document.querySelectorAll(".paper").forEach((paper) => new Paper(paper));
