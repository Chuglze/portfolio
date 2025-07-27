class PixelTrail {
  constructor(options = {}) {
    this.gridSize = options.gridSize || 40;
    this.trailSize = options.trailSize || 0.1;
    this.maxAge = options.maxAge || 250;
    this.interpolate = options.interpolate || 5;
    this.color = options.color || '#ffffff';
    this.gooeyFilter = options.gooeyFilter || false;
    
    this.canvas = null;
    this.ctx = null;
    this.trailTexture = null;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.trailData = null;
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.createTrailTexture();
    this.setupEventListeners();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pixel-canvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    
    document.body.appendChild(this.canvas);
  }

  createTrailTexture() {
    const size = 512;
    this.trailTexture = document.createElement('canvas');
    this.trailTexture.width = size;
    this.trailTexture.height = size;
    
    this.trailData = new Uint8ClampedArray(size * size);
    for (let i = 0; i < this.trailData.length; i++) {
      this.trailData[i] = 0;
    }
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.mousePos.x = touch.clientX;
      this.mousePos.y = touch.clientY;
    });

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      // 리사이즈 후 캔버스 컨텍스트 설정 재설정
      this.ctx.imageSmoothingEnabled = false;
    });
  }

  updateTrail() {
    const size = this.trailTexture.width;
    
    // 정사각형 그리드에 맞게 마우스 위치 계산
    const pixelSize = Math.min(window.innerWidth, window.innerHeight) / this.gridSize;
    const offsetX = (window.innerWidth - this.gridSize * pixelSize) / 2;
    const offsetY = (window.innerHeight - this.gridSize * pixelSize) / 2;
    
    // 마우스 위치를 그리드 좌표로 변환
    const adjustedMouseX = this.mousePos.x - offsetX;
    const adjustedMouseY = this.mousePos.y - offsetY;
    
    const gridX = Math.floor(adjustedMouseX / pixelSize);
    const gridY = Math.floor(adjustedMouseY / pixelSize);
    
    if (gridX >= 0 && gridX < this.gridSize && gridY >= 0 && gridY < this.gridSize) {
      const index = gridY * this.gridSize + gridX;
      const textureIndex = Math.floor((gridY / this.gridSize) * size) * size + 
                          Math.floor((gridX / this.gridSize) * size);
      
      if (textureIndex >= 0 && textureIndex < this.trailData.length) {
        this.trailData[textureIndex] = 255;
      }
    }

    // 트레일 페이드아웃
    for (let i = 0; i < this.trailData.length; i++) {
      this.trailData[i] = Math.max(0, this.trailData[i] - this.interpolate);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 정사각형 픽셀을 위해 더 작은 크기 사용
    const pixelSize = Math.min(this.canvas.width, this.canvas.height) / this.gridSize;
    
    // 캔버스 중앙에 그리드 배치
    const offsetX = (this.canvas.width - this.gridSize * pixelSize) / 2;
    const offsetY = (this.canvas.height - this.gridSize * pixelSize) / 2;
    
    this.ctx.fillStyle = this.color;
    
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const index = y * this.gridSize + x;
        const textureIndex = Math.floor((y / this.gridSize) * this.trailTexture.width) * this.trailTexture.width + 
                            Math.floor((x / this.gridSize) * this.trailTexture.width);
        
        if (textureIndex >= 0 && textureIndex < this.trailData.length) {
          const alpha = this.trailData[textureIndex] / 255;
          
          if (alpha > 0) {
            this.ctx.globalAlpha = alpha;
            this.ctx.fillRect(
              offsetX + x * pixelSize,
              offsetY + y * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        }
      }
    }
    
    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.updateTrail();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Gooey 필터 생성 함수
function createGooeyFilter(id = 'goo-filter', strength = 10) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'goo-filter-container';
  svg.style.position = 'absolute';
  svg.style.overflow = 'hidden';
  svg.style.zIndex = '1';
  svg.style.pointerEvents = 'none';
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', id);
  
  const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('stdDeviation', strength);
  blur.setAttribute('result', 'blur');
  
  const colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
  colorMatrix.setAttribute('in', 'blur');
  colorMatrix.setAttribute('type', 'matrix');
  colorMatrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9');
  colorMatrix.setAttribute('result', 'goo');
  
  const composite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
  composite.setAttribute('in', 'SourceGraphic');
  composite.setAttribute('in2', 'goo');
  composite.setAttribute('operator', 'atop');
  
  filter.appendChild(blur);
  filter.appendChild(colorMatrix);
  filter.appendChild(composite);
  defs.appendChild(filter);
  svg.appendChild(defs);
  
  return svg;
}

// 전역 변수로 트레일 인스턴스 저장
let pixelTrailInstance = null;

// 페이지 로드 시 트레일 효과 초기화
function initPixelTrail(options = {}) {
  if (pixelTrailInstance) {
    pixelTrailInstance.destroy();
  }
  
  // Gooey 필터 추가 (옵션)
  if (options.gooeyFilter) {
    const gooeySvg = createGooeyFilter(options.gooeyFilter.id, options.gooeyFilter.strength);
    document.body.appendChild(gooeySvg);
    
    if (options.gooeyFilter.id) {
      document.body.style.filter = `url(#${options.gooeyFilter.id})`;
    }
  }
  
  pixelTrailInstance = new PixelTrail(options);
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  if (pixelTrailInstance) {
    pixelTrailInstance.destroy();
  }
});

// 페이지 가시성 변경 시 처리
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (pixelTrailInstance && pixelTrailInstance.animationId) {
      cancelAnimationFrame(pixelTrailInstance.animationId);
      pixelTrailInstance.animationId = null;
    }
  } else {
    if (pixelTrailInstance && !pixelTrailInstance.animationId) {
      pixelTrailInstance.animate();
    }
  }
}); 