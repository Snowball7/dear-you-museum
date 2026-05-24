'use strict';
document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 可展开内容交互：点击整行展开/收起
  document.querySelectorAll('.expandable').forEach(function (item) {
    var toggle = item.querySelector('.expand-toggle');
    var content = item.querySelector('.expand-content');
    if (!toggle || !content) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.contains('open');
      if (isOpen) {
        toggle.classList.remove('open');
        content.classList.remove('open');
      } else {
        toggle.classList.add('open');
        content.classList.add('open');
      }
    });
  });

  // 自动展开所有"信面"内容
  document.querySelectorAll('.expandable').forEach(function (item) {
    var labelSpan = item.querySelector('.expand-toggle span:last-child');
    if (labelSpan && labelSpan.textContent.indexOf('信面') !== -1) {
      var toggle = item.querySelector('.expand-toggle');
      var content = item.querySelector('.expand-content');
      if (toggle && content) {
        toggle.classList.add('open');
        content.classList.add('open');
      }
    }
  });

  // 滚动淡入效果：通过 class 控制，避免 JS 失效时内容不可见
  if (!prefersReducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .letter-showcase, .timeline-item').forEach(function (el) {
      el.classList.add('js-fade');
      observer.observe(el);
    });
  }

  // 返回顶部按钮
  var backTop = document.createElement('button');
  backTop.className = 'back-to-top';
  backTop.type = 'button';
  backTop.innerHTML = '↑';
  backTop.setAttribute('aria-label', '返回顶部');
  document.body.appendChild(backTop);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backTop.classList.add('show');
    } else {
      backTop.classList.remove('show');
    }
  });

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TOC 可访问性增强
  document.querySelectorAll('.toc-letters').forEach(function (nav) {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', '信件目录');
    }
  });

  // TOC 滚动高亮
  var tocLinks = document.querySelectorAll('.toc-letters a');
  var tocTargets = [];
  tocLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.charAt(0) === '#') {
      var target = document.querySelector(href);
      if (target) tocTargets.push({ link: link, target: target });
    }
  });

  function updateTocActive() {
    var scrollPos = window.scrollY + window.innerHeight / 3;
    var active = null;
    tocTargets.forEach(function (item) {
      if (item.target.offsetTop <= scrollPos) {
        active = item;
      }
    });
    tocLinks.forEach(function (link) { link.classList.remove('active'); });
    if (active) active.link.classList.add('active');
  }

  if (tocTargets.length > 0) {
    window.addEventListener('scroll', updateTocActive);
    updateTocActive();
  }
});
