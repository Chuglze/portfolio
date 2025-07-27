document.addEventListener("DOMContentLoaded", () => {
  // 픽셀 트레일 효과 초기화
  initPixelTrail({
    gridSize: 30,
    trailSize: 0.15,
    maxAge: 200,
    interpolate: 8,
    color: '#777777',
    gooeyFilter: {
      id: 'portfolio-goo-filter',
      strength: 8
    }
  });

  // Register GSAP plugins
  gsap.registerPlugin(CustomEase);
  
  // Create custom eases
  CustomEase.create("projectExpand", "0.25, 0.1, 0.25, 1.05");
  CustomEase.create("projectCollapse", "0.36, 0.07, 0.19, 0.97");
  CustomEase.create("textReveal", "0.25, 1, 0.5, 1");
  CustomEase.create("squareStretch", "0.22, 1, 0.36, 1");

  const projectItems = document.querySelectorAll(".project-item");
  let activeProject = null;
  let isClickAllowed = true;

  // Initialize text splitting
  projectItems.forEach((project) => {
    const detailElements = project.querySelectorAll(".project-details p");
    detailElements.forEach((element) => {
      // Create a simple text splitting approach that works without SplitType
      const originalText = element.innerText;
      element.innerHTML = "";
      const lineWrapper = document.createElement("div");
      lineWrapper.className = "line-wrapper";
      const lineElement = document.createElement("div");
      lineElement.className = "line";
      lineElement.innerText = originalText;
      lineWrapper.appendChild(lineElement);
      element.appendChild(lineWrapper);
      
      // Set initial GSAP position
      gsap.set(lineElement, {
        y: "100%",
        opacity: 0
      });
    });

    // Set initial state for project items - hide them
    projectItems.forEach((item) => {
      gsap.set(item, {
        opacity: 0,
        y: 15
      });
    });

    // Create staggered reveal animation on page load
    gsap.to(projectItems, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "none", // Linear easing as requested
      onComplete: () => {
        // Ensure all items are fully visible after animation
        gsap.set(projectItems, {
          clearProps: "opacity,y"
        });
      }
    });

    // Set up hover indicators
    const titleContainer = project.querySelector(".project-title-container");
    const leftIndicator = project.querySelector(".hover-indicator.left");
    const rightIndicator = project.querySelector(".hover-indicator.right");

    // Set proper initial state
    gsap.set(titleContainer, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d"
    });

    // Set initial sizes for indicators
    gsap.set([leftIndicator, rightIndicator], {
      width: "0px", // Start with 0 width
      height: "8px",
      opacity: 1, // Always visible when animating
      transformOrigin: "center center",
      zIndex: 200 // Ensure indicators are always on top
    });

    // Add hover event listeners with fixed positioning
    titleContainer.addEventListener("mouseenter", () => {
      // Only show hover effect when NO project is active (no 3D perspective)
      if (!activeProject) {
        gsap.killTweensOf([leftIndicator, rightIndicator]);
        
        // Left square animation - start with 0 width, expand to 12px, then back to 8px
        gsap
          .timeline()
          .set(leftIndicator, {
            opacity: 1, // Always visible
            x: -20,
            width: "0px", // Start with 0 width
            height: "8px"
          })
          .to(leftIndicator, {
            x: -10,
            width: "12px", // Expand to 12px
            duration: 0.15,
            ease: "power2.in" // Ease in
          })
          .to(leftIndicator, {
            x: 0,
            width: "8px", // Back to 8px
            duration: 0.15,
            ease: "none" // Linear
          });

        // Right square animation (staggered)
        gsap
          .timeline({
            delay: 0.05
          })
          .set(rightIndicator, {
            opacity: 1, // Always visible
            x: 20,
            width: "0px", // Start with 0 width
            height: "8px"
          })
          .to(rightIndicator, {
            x: 10,
            width: "12px", // Expand to 12px
            duration: 0.15,
            ease: "power2.in" // Ease in
          })
          .to(rightIndicator, {
            x: 0,
            width: "8px", // Back to 8px
            duration: 0.15,
            ease: "none" // Linear
          });
      }
    });

    titleContainer.addEventListener("mouseleave", () => {
      // Only animate out when NO project is active
      if (!activeProject) {
        gsap.killTweensOf([leftIndicator, rightIndicator]);
        
        // Left square animation - start at 8px, expand to 12px, then shrink to 0px
        gsap
          .timeline()
          .to(leftIndicator, {
            x: -10,
            width: "12px", // Expand to 12px
            duration: 0.15,
            ease: "none" // Linear
          })
          .to(leftIndicator, {
            x: -20,
            width: "0px", // Shrink to 0px
            duration: 0.15,
            ease: "power2.out" // Ease out
          });

        // Right square animation - start at 8px, expand to 12px, then shrink to 0px
        gsap
          .timeline()
          .to(rightIndicator, {
            x: 10,
            width: "12px", // Expand to 12px
            duration: 0.15,
            ease: "none" // Linear
          })
          .to(rightIndicator, {
            x: 20,
            width: "0px", // Shrink to 0px
            duration: 0.15,
            ease: "power2.out" // Ease out
          });
      }
    });
  });

  // Function to apply 3D transforms with opposite directions
  const applyStarWarsEffect = (activeIndex) => {
    projectItems.forEach((item, index) => {
      const titleContainer = item.querySelector(".project-title-container");
      
      // Skip the active project
      if (index === activeIndex) {
        gsap.to(titleContainer, {
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          translateY: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          zIndex: 50 // Active item should be on top
        });
        return;
      }

      // Calculate distance from active project
      const distance = Math.abs(index - activeIndex);
      
      // Determine if item is above or below active
      const isAbove = index < activeIndex;
      
      // Calculate transform values based on distance and position
      // Items above rotate opposite to items below
      let rotateX, translateZ, translateY;
      
      if (distance === 1) {
        rotateX = isAbove ? 18 : -18; // Opposite directions
        translateZ = -120;
        translateY = isAbove ? -25 : 25;
      } else if (distance === 2) {
        rotateX = isAbove ? 30 : -30; // Opposite directions
        translateZ = -240;
        translateY = isAbove ? -50 : 50;
      } else {
        rotateX = isAbove ? 45 : -45; // Opposite directions
        translateZ = -360;
        translateY = isAbove ? -75 : 75;
      }

      // Apply transform with GSAP
      gsap.to(titleContainer, {
        rotateX: rotateX,
        translateZ: translateZ,
        translateY: translateY,
        scale: 1 - distance * 0.05, // Subtle scaling based on distance
        duration: 0.6,
        ease: "power2.out",
        zIndex: 40 - distance * 5 // Ensure proper stacking
      });

      // Make sure hover indicators stay on top
      const leftIndicator = item.querySelector(".hover-indicator.left");
      const rightIndicator = item.querySelector(".hover-indicator.right");
      gsap.set([leftIndicator, rightIndicator], {
        zIndex: 200 // Always keep indicators on top
      });
    });
  };

  // Function to reset all transforms
  const resetTransforms = () => {
    projectItems.forEach((item) => {
      const titleContainer = item.querySelector(".project-title-container");
      gsap.to(titleContainer, {
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        translateY: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        zIndex: 1
      });

      // Reset hover indicators to initial state
      const leftIndicator = item.querySelector(".hover-indicator.left");
      const rightIndicator = item.querySelector(".hover-indicator.right");
      gsap.set([leftIndicator, rightIndicator], {
        width: "0px",
        x: function(i) {
          return i === 0 ? -20 : 20;
        }
      });
    });
  };

  // Function to close all projects
  const closeAllProjects = () => {
    projectItems.forEach((item) => {
      item.classList.remove("active");
    });
    activeProject = null;
    resetTransforms();
  };

  // Set initial states for videos
  gsap.set(".video-wrapper", {
    scale: 0.8,
    opacity: 0
  });

  // Function to toggle project with debounce
  const toggleProject = (project) => {
    // If clicking is not allowed (debounce), return
    if (!isClickAllowed) return;
    
    // Set clicking to not allowed
    isClickAllowed = false;
    
    // Allow clicking again after delay
    setTimeout(() => {
      isClickAllowed = true;
    }, 500); // 500ms debounce

    // If clicking the active project, close it
    if (activeProject === project) {
      // Hide content first
      const video = project.querySelector(".video-wrapper");
      const leftDetails = project.querySelectorAll(".project-details .line");
      const rightDetails = project.querySelectorAll(".project-details .line");
      const title = project.querySelector(".project-title");
      const content = project.querySelector(".project-content");
      const keywords = project.querySelector(".project-keywords");
      const keywordElements = project.querySelectorAll(".keyword");

      // Animate letter spacing back to normal
      gsap.to(title, {
        letterSpacing: "-0.02em",
        duration: 0.3,
        ease: "projectCollapse"
      });

      // Hide keywords
      gsap.to(keywords, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "projectCollapse"
      });

      gsap.to(keywordElements, {
        opacity: 0,
        y: 5,
        duration: 0.2,
        stagger: 0.05,
        ease: "projectCollapse"
      });

      // Animate video out
      gsap.to(video, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "projectCollapse"
      });

      gsap.to([...leftDetails, ...rightDetails], {
        y: "100%",
        opacity: 0,
        duration: 0.3,
        stagger: 0.03, // Faster stagger
        ease: "projectCollapse"
      });

      gsap.to(content, {
        maxHeight: 0,
        opacity: 0,
        margin: 0,
        duration: 0.3,
        ease: "projectCollapse"
      });

      // After animation, remove active class
      setTimeout(() => {
        project.classList.remove("active");
        activeProject = null;
        resetTransforms();
        
        // Reset spacing when no project is active
        gsap.to(".project-item", {
          marginBottom: "1.5rem",
          duration: 0.4,
          ease: "projectExpand",
          stagger: 0.02
        });
      }, 300);
    } else {
      // Close all projects first
      if (activeProject) {
        // Hide content of previously active project
        const prevVideo = activeProject.querySelector(".video-wrapper");
        const prevLeftDetails = activeProject.querySelectorAll(".project-details .line");
        const prevRightDetails = activeProject.querySelectorAll(".project-details .line");
        const prevTitle = activeProject.querySelector(".project-title");
        const prevContent = activeProject.querySelector(".project-content");
        const prevKeywords = activeProject.querySelector(".project-keywords");
        const prevKeywordElements = activeProject.querySelectorAll(".keyword");

        // Animate letter spacing back to normal
        gsap.to(prevTitle, {
          letterSpacing: "-0.02em",
          duration: 0.25,
          ease: "projectCollapse"
        });

        // Hide keywords
        gsap.to(prevKeywords, {
          opacity: 0,
          y: 10,
          duration: 0.25,
          ease: "projectCollapse"
        });

        gsap.to(prevKeywordElements, {
          opacity: 0,
          y: 5,
          duration: 0.2,
          stagger: 0.05,
          ease: "projectCollapse"
        });

        // Animate video out
        gsap.to(prevVideo, {
          scale: 0.8,
          opacity: 0,
          duration: 0.25,
          ease: "projectCollapse"
        });

        gsap.to([...prevLeftDetails, ...prevRightDetails], {
          y: "100%",
          opacity: 0,
          duration: 0.25,
          stagger: 0.02,
          ease: "projectCollapse"
        });

        gsap.to(prevContent, {
          maxHeight: 0,
          opacity: 0,
          margin: 0,
          duration: 0.25,
          ease: "projectCollapse"
        });

        // After animation, remove active class
        setTimeout(() => {
          closeAllProjects();
          openProject();
        }, 250);
      } else {
        openProject();
      }

      function openProject() {
        // Hide any visible hover indicators
        document.querySelectorAll(".hover-indicator").forEach((indicator) => {
          gsap.killTweensOf(indicator);
          gsap.set(indicator, {
            width: "0px",
            x: indicator.classList.contains("left") ? -20 : 20
          });
        });

        // Open the clicked project
        project.classList.add("active");
        activeProject = project;

        // Apply Star Wars effect with opposite directions
        const activeIndex = Array.from(projectItems).indexOf(project);
        applyStarWarsEffect(activeIndex);

        // Get elements to animate
        const video = project.querySelector(".video-wrapper");
        const leftDetails = project.querySelectorAll(".project-details.left .line");
        const rightDetails = project.querySelectorAll(".project-details.right .line");
        const title = project.querySelector(".project-title");
        const content = project.querySelector(".project-content");
        const keywords = project.querySelector(".project-keywords");
        const keywordElements = project.querySelectorAll(".keyword");

        // Reset positions before animating
        gsap.set(video, {
          scale: 0.8,
          opacity: 0
        });

        gsap.set([...leftDetails, ...rightDetails], {
          y: "100%",
          opacity: 0
        });

        gsap.set(content, {
          display: "flex",
          maxHeight: 0,
          opacity: 0,
          margin: 0
        });

        gsap.set(keywords, {
          opacity: 0,
          y: 10
        });

        gsap.set(keywordElements, {
          opacity: 0,
          y: 5
        });

        // Create timeline for staggered animations
        const tl = gsap.timeline({
          defaults: {
            ease: "textReveal"
          }
        });

        // Animate letter spacing expansion
        tl.to(title, {
          letterSpacing: "0.01em",
          duration: 0.4,
          ease: "projectExpand"
        }, 0);

        // Show keywords
        tl.to(keywords, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "projectExpand"
        }, 0);

        // Expand content
        tl.to(content, {
          maxHeight: 500, // Large enough for most content
          opacity: 1,
          margin: "2rem 0",
          duration: 0.4,
          ease: "projectExpand"
        }, 0);

        // Add animations to timeline - video reveal
        tl.to(video, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "projectExpand"
        }, 0);

        // Staggered text reveals
        tl.to(leftDetails, {
          y: "0%",
          opacity: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: "textReveal"
        }, "-=0.2");

        tl.to(rightDetails, {
          y: "0%",
          opacity: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: "textReveal"
        }, "-=0.4");

        // Animate keywords with stagger
        tl.to(keywordElements, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "textReveal"
        }, "-=0.3");

        // Adjust spacing for better visibility
        const projectIndex = Array.from(projectItems).indexOf(project);
        
        // Compress projects above the active one
        if (projectIndex > 0) {
          gsap.to(Array.from(projectItems).slice(0, projectIndex), {
            marginBottom: "0.5rem",
            duration: 0.4,
            ease: "projectCollapse",
            stagger: 0.02
          });
        }
        
        // Compress projects below the active one
        if (projectIndex < projectItems.length - 1) {
          gsap.to(Array.from(projectItems).slice(projectIndex + 1), {
            marginBottom: "0.5rem",
            duration: 0.4,
            ease: "projectCollapse",
            stagger: 0.02
          });
        }

        // Ensure the active project is visible within the container
        setTimeout(() => {
          const projectsList = document.querySelector(".projects-list");
          const rect = project.getBoundingClientRect();
          const containerRect = projectsList.getBoundingClientRect();
          
          if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
            const scrollOffset = rect.top - containerRect.top - containerRect.height / 2 + rect.height / 2;
            projectsList.scrollBy({
              top: scrollOffset,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    }
  };

  // Add click event listeners to all project items
  projectItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // 영상 영역을 클릭한 경우 이벤트 전파를 막음
      if (e.target.closest('.video-wrapper') || e.target.closest('iframe')) {
        e.stopPropagation();
        return;
      }
      toggleProject(item);
    });
  });

  // 영상 영역 클릭 시 시각적 피드백 제공
  document.addEventListener("click", (e) => {
    const videoWrapper = e.target.closest('.video-wrapper');
    if (videoWrapper) {
      e.stopPropagation();
      
      // 클릭 효과 (선택사항)
      gsap.to(videoWrapper, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    // If a project is active, make sure it's still visible
    if (activeProject) {
      const projectsList = document.querySelector(".projects-list");
      const rect = activeProject.getBoundingClientRect();
      const containerRect = projectsList.getBoundingClientRect();
      
      if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
        const scrollOffset = rect.top - containerRect.top - containerRect.height / 2 + rect.height / 2;
        projectsList.scrollBy({
          top: scrollOffset,
          behavior: "smooth"
        });
      }
    }
  });

  // Clean up any lingering animations when user tabs away
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Reset all hover indicators when page is not visible
      document.querySelectorAll(".hover-indicator").forEach((indicator) => {
        gsap.killTweensOf(indicator);
        gsap.set(indicator, {
          width: "0px",
          x: indicator.classList.contains("left") ? -20 : 20
        });
      });
    }
  });
}); 