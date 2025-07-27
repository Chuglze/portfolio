document.addEventListener("DOMContentLoaded", () => {
  const startContainer = document.querySelector(".start-container");
  const textPressureTitle = document.querySelector(".text-pressure-title");
  const textSpans = document.querySelectorAll(".text-pressure-title span");
  
  console.log("Elements found:", {
    startContainer: !!startContainer,
    textPressureTitle: !!textPressureTitle,
    textSpans: textSpans.length
  });
  
  let isTransitioning = false;
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let animationId;

  // 마우스/터치 위치 추적
  const handleMouseMove = (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    cursorX = touch.clientX;
    cursorY = touch.clientY;
  };

  // 텍스트 압축 효과 애니메이션
  const animateTextPressure = () => {
    mouseX += (cursorX - mouseX) / 15;
    mouseY += (cursorY - mouseY) / 15;

    if (textPressureTitle && textSpans.length > 0) {
      const titleRect = textPressureTitle.getBoundingClientRect();
      const maxDist = titleRect.width / 2;

      textSpans.forEach((span, index) => {
        const rect = span.getBoundingClientRect();
        const charCenter = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
        };

        const dx = mouseX - charCenter.x;
        const dy = mouseY - charCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const getAttr = (distance, minVal, maxVal) => {
          const val = maxVal - Math.abs((maxVal * distance) / maxDist);
          return Math.max(minVal, val + minVal);
        };

        // 샘플 코드와 동일한 폰트 가변 설정
        const wdth = Math.floor(getAttr(distance, 5, 200));
        const wght = Math.floor(getAttr(distance, 100, 900));
        const italVal = getAttr(distance, 0, 1).toFixed(2);

        span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        
        // 첫 번째 프레임에서만 로그 출력
        if (index === 0) {
          console.log("Animating span:", {
            distance,
            wdth,
            wght,
            italVal,
            mouseX,
            mouseY,
            charCenter
          });
        }
      });
    }

    animationId = requestAnimationFrame(animateTextPressure);
  };

  // 초기 마우스 위치 설정
  if (textPressureTitle) {
    const titleRect = textPressureTitle.getBoundingClientRect();
    mouseX = titleRect.left + titleRect.width / 2;
    mouseY = titleRect.top + titleRect.height / 2;
    cursorX = mouseX;
    cursorY = mouseY;
  }

  // 이벤트 리스너 등록
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleTouchMove, { passive: false });

  // 초기 애니메이션 설정
  gsap.set(textPressureTitle, {
    opacity: 0,
    y: 30
  });

  // 텍스트 압축 효과 즉시 시작
  console.log("Starting text pressure animation");
  animateTextPressure();

  // 페이지 로드 시 페이드인 애니메이션
  gsap.to(textPressureTitle, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0.3
  });

  // 호버 효과
  textPressureTitle.addEventListener("mouseenter", () => {
    if (!isTransitioning) {
      gsap.to(textPressureTitle, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  textPressureTitle.addEventListener("mouseleave", () => {
    if (!isTransitioning) {
      gsap.to(textPressureTitle, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  // 페이지 전환 함수
  const transitionToPortfolio = () => {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    // 클릭 효과
    gsap.to(startContainer, {
      scale: 0.95,
      duration: 0.2,
      ease: "power2.in"
    });

    // 페이지 전환 오버레이 생성
    const transitionOverlay = document.createElement("div");
    transitionOverlay.className = "page-transition";
    document.body.appendChild(transitionOverlay);

    // 전환 애니메이션
    gsap.to(transitionOverlay, {
      scaleY: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // 포트폴리오 페이지로 이동
        window.location.href = "portfolio.html";
      }
    });

    // 애니메이션 정리
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    // 기존 요소들 페이드아웃
    gsap.to(textPressureTitle, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: "power2.in"
    });
  };

  // 클릭 이벤트 리스너
  startContainer.addEventListener("click", transitionToPortfolio);
  
  // 키보드 이벤트 (Enter, Space)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      transitionToPortfolio();
    }
  });

  // 터치 이벤트 (모바일)
  startContainer.addEventListener("touchstart", (e) => {
    e.preventDefault();
    transitionToPortfolio();
  });

  // 로딩 완료 후 커서 스타일 변경
  setTimeout(() => {
    document.body.style.cursor = "pointer";
  }, 1000);

  // 페이지 가시성 변경 시 처리
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // 페이지가 숨겨질 때 애니메이션 일시정지
      gsap.globalTimeline.pause();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    } else {
      // 페이지가 다시 보일 때 애니메이션 재개
      gsap.globalTimeline.resume();
      if (!isTransitioning) {
        animateTextPressure();
      }
    }
  });

  // 윈도우 리사이즈 처리
  window.addEventListener("resize", () => {
    // 리사이즈 시 마우스 위치 재설정
    if (textPressureTitle) {
      const titleRect = textPressureTitle.getBoundingClientRect();
      mouseX = titleRect.left + titleRect.width / 2;
      mouseY = titleRect.top + titleRect.height / 2;
    }
  });

  // 클린업 함수
  const cleanup = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleTouchMove);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };

  // 페이지 언로드 시 클린업
  window.addEventListener("beforeunload", cleanup);
}); 