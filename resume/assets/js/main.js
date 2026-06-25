(function () {
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  // Scroll progress bar
  var progressEl = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressEl) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) : 0;
    progressEl.style.transform = 'scaleX(' + progress + ')';
  }

  // Back to top
  var toTop = document.getElementById('back-to-top');
  function toggleBackToTop() {
    if (!toTop) return;
    if (window.scrollY > 320) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  }
  if (toTop) {
    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll reveal
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el, idx) {
      el.style.setProperty('--reveal-index', idx);
      io.observe(el);
    });
  } else {
    // Fallback: reveal all
    revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  // Scroll handlers (rAF throttle)
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        toggleBackToTop();
        // 当滚动到页面底部附近时，确保高亮最后一个锚点
        ensureBottomActive();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress);
  // Init
  updateProgress();
  toggleBackToTop();
  
  // Spotlight: 鼠标位置驱动的径向渐变灯光
  var spotlight = document.getElementById('spotlight');
  if (spotlight) {
    var moveSpotlight = function(x, y) {
      // 将径向渐变中心移动到鼠标位置
      spotlight.style.background = 'radial-gradient(600px at ' + x + 'px ' + y + 'px, rgba(29, 78, 216, 0.15), transparent 80%)';
    };
    window.addEventListener('mousemove', function(e){
      moveSpotlight(e.clientX, e.clientY);
    }, { passive: true });
    // 触摸设备：使用触摸点
    window.addEventListener('touchmove', function(e){
      if (e.touches && e.touches[0]) {
        moveSpotlight(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }
  
  // Scrollspy for sidebar
  var sections = ['about','education','projects','publications'].map(function(id){return document.getElementById(id);});
  var links = $$('.side-nav a');
  var indicator = document.querySelector('.side-nav .side-indicator');
  function moveIndicatorTo(linkEl){
    if (!indicator || !linkEl) return;
    var rect = linkEl.getBoundingClientRect();
    var parentRect = linkEl.parentElement.getBoundingClientRect();
    var centerY = rect.top - parentRect.top + rect.height/2;
    indicator.style.transform = 'translateY(' + centerY + 'px)';
  }
  function setActive(id){
    var activeLink = null;
    links.forEach(function(a){
      var target = a.getAttribute('href').split('#')[1];
      var isActive = target === id;
      if (isActive) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'true');
        activeLink = a;
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      }
    });
    if (activeLink) moveIndicatorTo(activeLink);
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          // Update hash without jump
          if (history.replaceState) {
            history.replaceState(null, '', '#' + entry.target.id);
          }
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 });
    sections.forEach(function(s){ if (s) spy.observe(s); });
  }

  // 兜底：当滚动接近文档底部时，强制高亮最后一个分区（避免最后分区高度或阈值原因未触发 IO）
  function ensureBottomActive(){
    var doc = document.documentElement;
    var body = document.body;
    var scrollTop = window.pageYOffset || doc.scrollTop || 0;
    var viewportH = window.innerHeight || doc.clientHeight || 0;
    var docHeight = Math.max(body.scrollHeight, doc.scrollHeight);
    var distanceToBottom = docHeight - (scrollTop + viewportH);
    if (distanceToBottom <= 2) {
      // 找到最后一个存在的 section
      var last = null;
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i]) { last = sections[i]; break; }
      }
      if (last) {
        setActive(last.id);
        if (history.replaceState) {
          history.replaceState(null, '', '#' + last.id);
        }
      }
    }
  }

  // Smooth scroll for side-nav links
  links.forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if (href && href.indexOf('#') !== -1) {
        var id = href.split('#')[1];
        var el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12, behavior: 'smooth' });
        }
      }
    });
  });

  // 初始：默认高亮 About 并定位指示条
  window.addEventListener('load', function(){
    setActive('about');
    var current = document.querySelector('.side-nav a[aria-current]') || links[0];
    if (current) moveIndicatorTo(current);
  });

  // Tag pills: 使用更中性的配色与简洁 hover（无光晕）
})();


