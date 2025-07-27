document.addEventListener("DOMContentLoaded", () => {
  const startContainer = document.querySelector(".start-container");
  const titleImage = document.querySelector(".title-image");
  
  let isTransitioning = false;

  // 초기 애니메이션 설정
  gsap.set(titleImage, {
    opacity: 0,
    y: 30
  });

  // 페이지 로드 시 페이드인 애니메이션
  gsap.to(titleImage, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0.3
  });

  // 호버 효과
  titleImage.addEventListener("mouseenter", () => {
    if (!isTransitioning) {
      gsap.to(titleImage, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  titleImage.addEventListener("mouseleave", () => {
    if (!isTransitioning) {
      gsap.to(titleImage, {
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
        window.location.href = "index.html";
      }
    });

    // 기존 요소들 페이드아웃
    gsap.to(titleImage, {
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
    } else {
      // 페이지가 다시 보일 때 애니메이션 재개
      gsap.globalTimeline.resume();
    }
  });

  // 윈도우 리사이즈 처리
  window.addEventListener("resize", () => {
    // 필요한 경우 리사이즈 로직 추가
  });
}); 