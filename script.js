/* ==========================================================================
   CodeMentra AI — Your Personalized AI Coding Mentor
   Frontend Interactive Engine (script.js)
   Pure Vanilla JavaScript (Zero External Runtime Dependencies)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Toast Notification System
     ------------------------------------------------------------------------ */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 200ms ease';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, 3400);
  }

  /* ------------------------------------------------------------------------
     2. Sticky Header, Back-to-Top & Active Section Highlighting (rAF Throttled)
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const trackedSections = document.querySelectorAll('section[id]');
  let scrollTicking = false;

  function updateScrollState() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 24);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollY > 520);
    }

    let currentSectionId = 'home';
    trackedSections.forEach(function (sec) {
      const top = sec.offsetTop - 130;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute('id') || 'home';
      }
    });

    navLinks.forEach(function (link) {
      const target = link.getAttribute('href');
      link.classList.toggle('active', target === '#' + currentSectionId);
    });

    scrollTicking = false;
  }

  function onWindowScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollState);
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onWindowScroll, { passive: true });
  updateScrollState();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     3. Mobile Hamburger Menu
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  function closeMobileMenu() {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileDrawer.classList.toggle('open', !isExpanded);
    });

    mobileDrawer.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', closeMobileMenu);
    });
  }

  /* ------------------------------------------------------------------------
     4. Hero Workbench Interactive Hint & Fix Toggle
     ------------------------------------------------------------------------ */
  const heroToggleFixBtn = document.getElementById('hero-toggle-fix-btn');
  const heroCodeLine2 = document.getElementById('hero-code-line-2');
  const heroErrorBanner = document.getElementById('hero-error-banner');
  const heroMentorQuote = document.getElementById('hero-mentor-quote');
  const heroProgressFill = document.getElementById('hero-progress-fill');
  const heroProgressLabel = document.getElementById('hero-progress-label');
  let heroFixed = false;

  if (heroToggleFixBtn && heroCodeLine2 && heroErrorBanner && heroMentorQuote && heroProgressFill && heroProgressLabel) {
    heroToggleFixBtn.addEventListener('click', function () {
      heroFixed = !heroFixed;
      if (heroFixed) {
        heroCodeLine2.className = 'code-line';
        heroCodeLine2.innerHTML =
          '<span class="line-num">2</span><span>    <span class="tok-kw">return</span> a + <span class="tok-str">b</span>;<span class="typing-cursor" aria-hidden="true"></span></span>';
        heroErrorBanner.classList.add('resolved');
        heroErrorBanner.innerHTML =
          '<span>● Check Passed: calculateSum(4, 6) → 10</span><span>0 Errors</span>';
        heroMentorQuote.textContent =
          '"Great job! You matched parameter b in the return expression."';
        heroProgressFill.style.width = '100%';
        heroProgressLabel.textContent = '100%';
        heroToggleFixBtn.textContent = 'Reset Error Demo';
        showToast('Variable mismatch resolved using CodeMentra hint.');
      } else {
        heroCodeLine2.className = 'code-line code-line-error';
        heroCodeLine2.innerHTML =
          '<span class="line-num">2</span><span>    <span class="tok-kw">return</span> a + <span class="tok-err">c</span>;<span class="typing-cursor" aria-hidden="true"></span></span>';
        heroErrorBanner.classList.remove('resolved');
        heroErrorBanner.innerHTML =
          '<span>▲ ReferenceError: "c" is not defined (line 2)</span><span>1 Issue</span>';
        heroMentorQuote.textContent =
          '"There\'s a variable mismatch in your function."';
        heroProgressFill.style.width = '75%';
        heroProgressLabel.textContent = '75%';
        heroToggleFixBtn.textContent = 'Test Hint Fix';
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Interactive AI Debugging Demo ("See How CodeMentra Thinks.")
     ------------------------------------------------------------------------ */
  const debugScenarios = {
    sum: {
      filename: 'calculateSum.js',
      code: 'function calculateSum(a, b) {\n    return a + c;\n}',
      problem: '"c" is not defined.',
      why: 'There is a variable mismatch in the function. You used "c", but the function receives "b".',
      hint: 'Check the variable names in the return statement.',
      nextStep: 'Match the second operand to the parameter declared above.',
      solution: 'function calculateSum(a, b) {\n    return a + b;\n}',
      validPattern: /return\s+a\s*\+\s*b\s*;/
    },
    greet: {
      filename: 'greetUser.js',
      code: 'function greet(name) {\n    console.log("Hello " + user);\n}',
      problem: 'The variable "user" is not defined.',
      why: 'Your function receives the parameter "name", but the code attempts to use "user".',
      hint: 'Check which variable is available inside the function.',
      nextStep: 'Try replacing the undefined variable with the function parameter.',
      solution: 'function greet(name) {\n    console.log("Hello " + name);\n}',
      validPattern: /console\.log\(\s*["']Hello\s*["']\s*\+\s*name\s*\)/
    },
    loop: {
      filename: 'sumArray.js',
      code: 'function sumScores(scores) {\n    let total = 0;\n    for (let i = 0; i <= scores.length; i++) {\n        total += scores[i];\n    }\n    return total;\n}',
      problem: 'Loop condition "i <= scores.length" reads one index past the end of the array (undefined).',
      why: 'Zero-indexed arrays run from index 0 to scores.length - 1. Accessing scores[scores.length] evaluates to undefined, resulting in NaN.',
      hint: 'Compare the final index of a 0-based array with the loop comparison operator.',
      nextStep: 'Change the loop condition from "<=" to "<" so the loop stops at the last valid element.',
      solution: 'function sumScores(scores) {\n    let total = 0;\n    for (let i = 0; i < scores.length; i++) {\n        total += scores[i];\n    }\n    return total;\n}',
      validPattern: /i\s*<\s*scores\.length/
    },
    even: {
      filename: 'checkEven.js',
      code: 'function isEvenNumber(num) {\n    if (num % 2 = 0) {\n        return true;\n    }\n    return false;\n}',
      problem: 'Invalid assignment operator "=" used inside an if-statement condition.',
      why: 'A single "=" assigns a value instead of comparing two values. In JavaScript, equality comparison requires "===" or "==".',
      hint: 'Look closely at the operator between "num % 2" and "0".',
      nextStep: 'Replace the single "=" with strict equality "===" to compare the remainder.',
      solution: 'function isEvenNumber(num) {\n    if (num % 2 === 0) {\n        return true;\n    }\n    return false;\n}',
      validPattern: /num\s*%\s*2\s*===?\s*0/
    }
  };

  let activeScenarioKey = 'sum';
  const codeTextarea = document.getElementById('debugger-code-input');
  const editorFilename = document.getElementById('debugger-filename');
  const testCodeBtn = document.getElementById('test-code-btn');
  const analyzeCodeBtn = document.getElementById('analyze-code-btn');
  const hintCodeBtn = document.getElementById('hint-code-btn');
  const showSolutionBtn = document.getElementById('show-solution-btn');
  const analysisStatusBadge = document.getElementById('analysis-status-badge');
  const outProblem = document.getElementById('analysis-problem');
  const outWhy = document.getElementById('analysis-why');
  const outHint = document.getElementById('analysis-hint');
  const outNext = document.getElementById('analysis-next');
  const itemHint = document.getElementById('analysis-item-hint');
  const itemNext = document.getElementById('analysis-item-next');
  const solutionRevealBox = document.getElementById('solution-reveal-box');
  const solutionCodePre = document.getElementById('solution-code-pre');
  const scenarioTabBtns = document.querySelectorAll('[data-scenario]');

  function clearHintHighlight() {
    if (itemHint) itemHint.classList.remove('highlighted');
    if (itemNext) itemNext.classList.remove('highlighted');
  }

  function renderAnalysisForScenario(key, announceToast) {
    const data = debugScenarios[key];
    if (!data) return;

    clearHintHighlight();
    if (outProblem) outProblem.textContent = data.problem;
    if (outWhy) outWhy.textContent = data.why;
    if (outHint) outHint.textContent = data.hint;
    if (outNext) outNext.textContent = data.nextStep;
    if (solutionCodePre) solutionCodePre.textContent = data.solution;

    if (solutionRevealBox) {
      solutionRevealBox.classList.remove('visible');
    }
    if (showSolutionBtn) {
      showSolutionBtn.textContent = 'Show Solution';
    }
    if (analysisStatusBadge) {
      analysisStatusBadge.textContent = '● Guided Analysis Ready (Solution Hidden)';
    }
    if (announceToast) {
      showToast('CodeMentra AI analyzed the code and generated step-by-step guidance.');
    }
  }

  scenarioTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.getAttribute('data-scenario');
      if (!key || !debugScenarios[key]) return;
      activeScenarioKey = key;

      scenarioTabBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      if (codeTextarea) codeTextarea.value = debugScenarios[key].code;
      if (editorFilename) editorFilename.textContent = debugScenarios[key].filename;
      renderAnalysisForScenario(key, false);
    });
  });

  if (testCodeBtn) {
    testCodeBtn.addEventListener('click', function () {
      const data = debugScenarios[activeScenarioKey];
      if (!data || !codeTextarea) return;
      const currentCode = codeTextarea.value;

      if (data.validPattern && data.validPattern.test(currentCode)) {
        if (analysisStatusBadge) {
          analysisStatusBadge.textContent = '● Test Passed: Bug Resolved Independently!';
        }
        showToast('Test Passed! Your edited code fixed the issue.');
      } else {
        renderAnalysisForScenario(activeScenarioKey, false);
        if (analysisStatusBadge) {
          analysisStatusBadge.textContent = '▲ Test Failed: ' + data.problem;
        }
        showToast('Test detected an issue: ' + data.problem);
      }
    });
  }

  if (analyzeCodeBtn) {
    analyzeCodeBtn.addEventListener('click', function () {
      renderAnalysisForScenario(activeScenarioKey, true);
    });
  }

  if (hintCodeBtn) {
    hintCodeBtn.addEventListener('click', function () {
      const data = debugScenarios[activeScenarioKey];
      if (!data) return;
      if (itemHint) itemHint.classList.add('highlighted');
      if (itemNext) itemNext.classList.add('highlighted');
      if (analysisStatusBadge) {
        analysisStatusBadge.textContent = '● Hint Highlighted — Try editing the code!';
      }
      showToast('Hint: ' + data.hint);
    });
  }

  if (showSolutionBtn && solutionRevealBox) {
    showSolutionBtn.addEventListener('click', function () {
      const isVisible = solutionRevealBox.classList.toggle('visible');
      showSolutionBtn.textContent = isVisible ? 'Hide Solution' : 'Show Solution';
      if (analysisStatusBadge) {
        analysisStatusBadge.textContent = isVisible
          ? '● Reference Solution Revealed'
          : '● Guided Analysis Ready (Solution Hidden)';
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Personalized Dashboard Preview — Interactive Sidebar Tabs
     ------------------------------------------------------------------------ */
  const dashViews = {
    overview: {
      title: 'Good morning, Alex 👋',
      subtitle: 'Interactive Product Preview · Sample Learner Workspace',
      courseTitle: 'JavaScript Fundamentals',
      courseProgress: '68%',
      challengeTitle: 'Array Methods',
      challengeMeta: 'Practice transforming and filtering datasets without mutating the source array.',
      mentorTip: '"You\'re close. Try checking how the loop updates the index."',
      mentorContext: 'Active hint on Array Methods · Sample Mentor Prompt'
    },
    learn: {
      title: 'Adaptive Learning Path',
      subtitle: 'Module 03 of 06 · Core Programming Foundations',
      courseTitle: 'Functions, Scope & Closures',
      courseProgress: '68%',
      challengeTitle: 'Next Concept: Understanding Variable Scope',
      challengeMeta: 'Interactive Lesson + 3 Concept Checkpoints',
      mentorTip: '"Before moving to closures, make sure you can trace local vs. outer variables."',
      mentorContext: 'Personalized Roadmap · Adjusted to your quiz accuracy'
    },
    challenges: {
      title: 'Coding Practice Arena',
      subtitle: 'Structured Problem Sets · Hint-Assisted Practice',
      courseTitle: 'Arrays & String Manipulation Track',
      courseProgress: '74%',
      challengeTitle: 'Active Problem: Remove Duplicate Values',
      challengeMeta: '2 Hints Available · Independent Solve Mode',
      mentorTip: '"Think about how a Set or index lookup can track values you have already seen."',
      mentorContext: 'Smart Hint Engine · No direct spoiler code'
    },
    projects: {
      title: 'Guided Project Studio',
      subtitle: 'Milestone-Based Real-World Application Building',
      courseTitle: 'Task Management Web App',
      courseProgress: '60%',
      challengeTitle: 'Milestone 3: LocalStorage Persistence',
      challengeMeta: 'Skills: DOM Events · JSON Serialization · State Sync',
      mentorTip: '"Remember to stringify your task array before saving it to localStorage."',
      mentorContext: 'Project Architecture Review · Passing 3/5 Milestones'
    },
    mentor: {
      title: 'AI Coding Mentor Session',
      subtitle: 'Step-by-Step Socratic Debugging & Concept Clarification',
      courseTitle: 'Live Debugging Session: Async Fetch Call',
      courseProgress: '85%',
      challengeTitle: 'Diagnostic: Unhandled Promise Result',
      challengeMeta: 'Focus: async / await syntax & try/catch error handling',
      mentorTip: '"Why does console.log(data) print a pending Promise before await finishes?"',
      mentorContext: 'Guided Questioning · Building mental models'
    },
    interviews: {
      title: 'Technical Interview Readiness',
      subtitle: 'Internship & Placement Preparation Track',
      courseTitle: 'Data Structures & Problem Explanation',
      courseProgress: '55%',
      challengeTitle: 'Mock Prompt: Array vs. Linked List Tradeoffs',
      challengeMeta: 'Focus: Time Complexity & Memory Allocation Clarity',
      mentorTip: '"Structure your spoken answer: Definition → Memory Layout → Big-O Access Time."',
      mentorContext: 'Interview Rubric Feedback · Communication + Technical Depth'
    },
    progress: {
      title: 'Learner Progress Analytics',
      subtitle: 'Weekly Consistency & Concept Mastery Breakdown',
      courseTitle: 'Overall Foundation Track Completion',
      courseProgress: '68%',
      challengeTitle: 'Strongest Area: Conditional Logic & Loops',
      challengeMeta: 'Recommended Focus: Recursion & Array Reduce',
      mentorTip: '"Solving 1 challenge daily has improved your first-attempt debugging accuracy."',
      mentorContext: 'Adaptive Feedback · Updated after each practice session'
    },
    profile: {
      title: 'Learner Profile & Goals',
      subtitle: 'B.Tech Computer Science · 2nd Year Beginner Track',
      courseTitle: 'Primary Goal: Coding Placement & Internship Readiness',
      courseProgress: '68%',
      challengeTitle: 'Preferred Languages: JavaScript & Python',
      challengeMeta: 'Daily Practice Target: 30 Minutes / Day',
      mentorTip: '"Your roadmap is calibrated for campus internship coding rounds."',
      mentorContext: 'Personalization Profile · Editable anytime'
    }
  };

  const sidebarTabBtns = document.querySelectorAll('.sidebar-tab-btn');
  const dashHeading = document.getElementById('dash-heading');
  const dashSubtitle = document.getElementById('dash-subtitle');
  const dashCourseTitle = document.getElementById('dash-course-title');
  const dashCourseProgress = document.getElementById('dash-course-progress');
  const dashCourseBar = document.getElementById('dash-course-bar');
  const dashChallengeTitle = document.getElementById('dash-challenge-title');
  const dashChallengeMeta = document.getElementById('dash-challenge-meta');
  const dashMentorTip = document.getElementById('dash-mentor-tip');
  const dashMentorContext = document.getElementById('dash-mentor-context');

  sidebarTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tabKey = btn.getAttribute('data-dash-tab');
      if (!tabKey || !dashViews[tabKey]) return;

      sidebarTabBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      const view = dashViews[tabKey];
      if (dashHeading) dashHeading.textContent = view.title;
      if (dashSubtitle) dashSubtitle.textContent = view.subtitle;
      if (dashCourseTitle) dashCourseTitle.textContent = view.courseTitle;
      if (dashCourseProgress) dashCourseProgress.textContent = 'Progress: ' + view.courseProgress;
      if (dashCourseBar) dashCourseBar.style.width = view.courseProgress;
      if (dashChallengeTitle) dashChallengeTitle.textContent = view.challengeTitle;
      if (dashChallengeMeta) dashChallengeMeta.textContent = view.challengeMeta;
      if (dashMentorTip) dashMentorTip.textContent = view.mentorTip;
      if (dashMentorContext) dashMentorContext.textContent = view.mentorContext;
    });
  });

  /* ------------------------------------------------------------------------
     7. Projects Section Filtering & Project Blueprint Modal
     ------------------------------------------------------------------------ */
  const projectFilterBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-level]');

  projectFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-project-filter');
      projectFilterBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      projectCards.forEach(function (card) {
        const level = card.getAttribute('data-level');
        card.style.display = filter === 'all' || level === filter ? 'flex' : 'none';
      });
    });
  });

  const projectDetailsData = {
    portfolio: {
      title: 'Personal Portfolio',
      level: 'Beginner',
      skills: 'Semantic HTML5 · Modern CSS Grid/Flexbox · Responsive Media Queries · DOM Navigation',
      desc: 'Build a clean, responsive developer portfolio to showcase your academic coursework, coding skills, and contact links.',
      milestones: [
        '01. Structure semantic sections (Hero, Projects, Skills, Contact)',
        '02. Design a mobile-first responsive grid layout without horizontal overflow',
        '03. Add keyboard-accessible navigation and project filter tabs with JavaScript'
      ],
      mentorHint: 'CodeMentra AI guides you through responsive breakpoints and flexbox alignment bugs step by step.'
    },
    taskapp: {
      title: 'Task Management App',
      level: 'Beginner',
      skills: 'JavaScript DOM Manipulation · Event Delegation · Array Methods · LocalStorage API',
      desc: 'Create an interactive study and task tracker where users can add, filter, complete, and persist daily programming tasks.',
      milestones: [
        '01. Implement state array for tasks with unique IDs and completion flags',
        '02. Build dynamic DOM rendering and status filtering (All, Active, Completed)',
        '03. Persist task state across page reloads using JSON and localStorage'
      ],
      mentorHint: 'CodeMentra AI helps you debug event listener duplication and state synchronization issues.'
    },
    weather: {
      title: 'Weather Dashboard',
      level: 'Intermediate',
      skills: 'Async/Await · Fetch API · JSON Parsing · Error Handling & Loading States',
      desc: 'Develop a live weather lookup dashboard that fetches forecast data, handles network errors gracefully, and displays metrics.',
      milestones: [
        '01. Connect to a weather REST endpoint using async/await and try/catch',
        '02. Transform nested JSON response fields into clean UI cards',
        '03. Handle invalid city names, loading states, and rate-limit fallbacks'
      ],
      mentorHint: 'CodeMentra AI walks you through asynchronous execution order and Promise error handling.'
    },
    student: {
      title: 'Student Management System',
      level: 'Intermediate',
      skills: 'CRUD Operations · Data Validation · Search & Sort Algorithms · Modular JS',
      desc: 'Architect a structured student record interface supporting enrollment validation, multi-field search, and grade aggregation.',
      milestones: [
        '01. Design student record schema with form validation rules',
        '02. Implement real-time search, sorting by GPA/attendance, and record editing',
        '03. Calculate cohort summary analytics with tabular accuracy'
      ],
      mentorHint: 'CodeMentra AI coaches you on separating data logic from UI rendering functions.'
    },
    fullstack: {
      title: 'Full-Stack Web Application',
      level: 'Advanced',
      skills: 'RESTful API Design · Authentication Flow · Database Schema · State Architecture',
      desc: 'Combine frontend state management with a structured backend API and database layer to build an end-to-end web application.',
      milestones: [
        '01. Design REST API routes, request validation, and database models',
        '02. Connect frontend client views with authenticated API requests',
        '03. Handle edge cases, pagination, and end-to-end error recovery'
      ],
      mentorHint: 'CodeMentra AI helps you trace client-server status codes, CORS headers, and async data flows.'
    }
  };

  const projectModal = document.getElementById('project-blueprint-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const pmTitle = document.getElementById('pm-title');
  const pmMeta = document.getElementById('pm-meta');
  const pmDesc = document.getElementById('pm-desc');
  const pmSkills = document.getElementById('pm-skills');
  const pmMilestones = document.getElementById('pm-milestones');
  const pmMentorHint = document.getElementById('pm-mentor-hint');
  let lastFocusedTrigger = null;

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('[data-open-project]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.getAttribute('data-open-project');
      const info = projectDetailsData[key];
      if (!info || !projectModal) return;

      lastFocusedTrigger = btn;
      if (pmTitle) pmTitle.textContent = info.title;
      if (pmMeta) pmMeta.textContent = 'Example Learning Project · Difficulty: ' + info.level;
      if (pmDesc) pmDesc.textContent = info.desc;
      if (pmSkills) pmSkills.textContent = info.skills;
      if (pmMentorHint) pmMentorHint.textContent = info.mentorHint;
      if (pmMilestones) {
        pmMilestones.innerHTML = info.milestones
          .map(function (m) {
            return '<li class="milestone-item">' + m + '</li>';
          })
          .join('');
      }
      projectModal.classList.add('open');
      projectModal.setAttribute('aria-hidden', 'false');
      if (projectModalClose) projectModalClose.focus();
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', function () {
      closeProjectModal();
      if (lastFocusedTrigger) lastFocusedTrigger.focus();
    });
  }

  /* ------------------------------------------------------------------------
     8. Mock Interview Simulator Interaction
     ------------------------------------------------------------------------ */
  const interviewQuestions = [
    {
      topic: 'Data Structures · Question 01 of 04',
      question: '"What is the difference between an array and a linked list?"',
      sampleAnswer:
        'An array stores elements in contiguous memory locations allowing O(1) indexed access, while a linked list stores nodes scattered in memory connected via pointers, offering dynamic resizing and O(1) insertion/deletion when the node reference is known.',
      goodFeedback: 'Good explanation.',
      improveTip: 'Mention memory allocation and access complexity.'
    },
    {
      topic: 'JavaScript Fundamentals · Question 02 of 04',
      question: '"How does == differ from === in JavaScript?"',
      sampleAnswer:
        'The == operator performs type coercion before comparing values, whereas === checks both value and data type without implicit conversion.',
      goodFeedback: 'Clear distinction between loose and strict equality.',
      improveTip: 'Provide a concrete example such as 5 == "5" (true) vs 5 === "5" (false).'
    },
    {
      topic: 'Problem Solving · Question 03 of 04',
      question: '"What is a base case in recursion and why is it necessary?"',
      sampleAnswer:
        'A base case is the terminating condition that stops recursive calls and returns a value directly without making another recursive call.',
      goodFeedback: 'Accurate definition of the terminating condition.',
      improveTip: 'Mention that omitting a base case leads to infinite recursion and a call stack overflow error.'
    },
    {
      topic: 'Web Concepts · Question 04 of 04',
      question: '"What is the purpose of asynchronous programming in web applications?"',
      sampleAnswer:
        'Asynchronous programming allows long-running tasks like API requests or timers to run without freezing the main UI thread.',
      goodFeedback: 'Strong grasp of non-blocking execution.',
      improveTip: 'Mention Promises, async/await, and how the event loop handles resolved callbacks.'
    }
  ];

  let currentQuestionIndex = 0;
  const iqTopic = document.getElementById('interview-topic-label');
  const iqText = document.getElementById('interview-question-text');
  const iqInput = document.getElementById('interview-answer-input');
  const iqSubmitBtn = document.getElementById('submit-interview-btn');
  const iqNextBtn = document.getElementById('next-interview-btn');
  const iqSampleBtn = document.getElementById('fill-sample-answer-btn');
  const iqFeedbackTitle = document.getElementById('interview-feedback-text');
  const iqImproveTitle = document.getElementById('interview-improve-text');
  const iqStatusBadge = document.getElementById('interview-status-badge');

  function loadInterviewQuestion(idx) {
    const q = interviewQuestions[idx];
    if (!q) return;
    if (iqTopic) iqTopic.textContent = q.topic;
    if (iqText) iqText.textContent = q.question;
    if (iqInput) iqInput.value = '';
    if (iqFeedbackTitle) iqFeedbackTitle.textContent = q.goodFeedback;
    if (iqImproveTitle) iqImproveTitle.textContent = q.improveTip;
    if (iqStatusBadge) iqStatusBadge.textContent = '● Sample Evaluation Preview';
  }

  if (iqSampleBtn) {
    iqSampleBtn.addEventListener('click', function () {
      const q = interviewQuestions[currentQuestionIndex];
      if (iqInput && q) {
        iqInput.value = q.sampleAnswer;
      }
    });
  }

  if (iqSubmitBtn) {
    iqSubmitBtn.addEventListener('click', function () {
      const q = interviewQuestions[currentQuestionIndex];
      const userVal = iqInput ? iqInput.value.trim() : '';
      if (!userVal) {
        showToast('Write a brief response or click "Insert Sample Answer" to test feedback.');
        if (iqInput) iqInput.focus();
        return;
      }

      if (iqFeedbackTitle) iqFeedbackTitle.textContent = q.goodFeedback;
      if (iqImproveTitle) iqImproveTitle.textContent = q.improveTip;
      if (iqStatusBadge) iqStatusBadge.textContent = '● Answer Evaluated by CodeMentra Demo';
      showToast('Interview response evaluated! Review your feedback card.');
    });
  }

  if (iqNextBtn) {
    iqNextBtn.addEventListener('click', function () {
      currentQuestionIndex = (currentQuestionIndex + 1) % interviewQuestions.length;
      loadInterviewQuestion(currentQuestionIndex);
      showToast('Loaded next technical interview question.');
    });
  }

  /* ------------------------------------------------------------------------
     9. Progress Tracking Week Toggle (Sample Data Demonstration)
     ------------------------------------------------------------------------ */
  const weekToggleBtns = document.querySelectorAll('[data-week-toggle]');
  const weekBars = [
    { fill: 'bar-mon', val: 'val-mon' },
    { fill: 'bar-tue', val: 'val-tue' },
    { fill: 'bar-wed', val: 'val-wed' },
    { fill: 'bar-thu', val: 'val-thu' },
    { fill: 'bar-fri', val: 'val-fri' },
    { fill: 'bar-sat', val: 'val-sat' },
    { fill: 'bar-sun', val: 'val-sun' }
  ];

  const weekDatasets = {
    current: [
      { h: '45%', label: '35m' },
      { h: '65%', label: '50m' },
      { h: '55%', label: '40m' },
      { h: '85%', label: '65m' },
      { h: '70%', label: '55m' },
      { h: '95%', label: '75m' },
      { h: '60%', label: '45m' }
    ],
    previous: [
      { h: '35%', label: '25m' },
      { h: '40%', label: '30m' },
      { h: '50%', label: '38m' },
      { h: '45%', label: '35m' },
      { h: '60%', label: '45m' },
      { h: '70%', label: '52m' },
      { h: '50%', label: '38m' }
    ]
  };

  weekToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const mode = btn.getAttribute('data-week-toggle');
      const dataset = weekDatasets[mode];
      if (!dataset) return;

      weekToggleBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      weekBars.forEach(function (item, index) {
        const fillEl = document.getElementById(item.fill);
        const valEl = document.getElementById(item.val);
        if (fillEl) fillEl.style.height = dataset[index].h;
        if (valEl) valEl.textContent = dataset[index].label;
      });
    });
  });

  /* ------------------------------------------------------------------------
     10. FAQ Accordion
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------------
     11. Get Started / Onboarding Modal & Form Handling
     ------------------------------------------------------------------------ */
  const getStartedModal = document.getElementById('get-started-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const onboardingForm = document.getElementById('onboarding-form');
  const onboardingSuccess = document.getElementById('onboarding-success');
  const modalFormContainer = document.getElementById('modal-form-container');
  const resetModalBtn = document.getElementById('reset-modal-btn');
  const modalTitleText = document.getElementById('modal-title-text');

  function openOnboardingModal(mode, triggerEl) {
    if (!getStartedModal) return;
    closeProjectModal();
    if (triggerEl) lastFocusedTrigger = triggerEl;

    if (modalFormContainer && onboardingSuccess) {
      modalFormContainer.style.display = 'block';
      onboardingSuccess.style.display = 'none';
    }
    if (modalTitleText) {
      modalTitleText.textContent =
        mode === 'login' ? 'Welcome Back to CodeMentra AI' : 'Start Your Learning Journey';
    }
    getStartedModal.classList.add('open');
    getStartedModal.setAttribute('aria-hidden', 'false');
    const firstInput = getStartedModal.querySelector('input');
    if (firstInput) {
      setTimeout(function () {
        firstInput.focus();
      }, 50);
    }
  }

  function closeOnboardingModal() {
    if (!getStartedModal) return;
    getStartedModal.classList.remove('open');
    getStartedModal.setAttribute('aria-hidden', 'true');
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const mode = trigger.getAttribute('data-open-modal') || 'start';
      openOnboardingModal(mode, trigger);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeOnboardingModal);
  }

  if (getStartedModal) {
    getStartedModal.addEventListener('click', function (e) {
      if (e.target === getStartedModal) closeOnboardingModal();
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', function (e) {
      if (e.target === projectModal) {
        closeProjectModal();
        if (lastFocusedTrigger) lastFocusedTrigger.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
      if (getStartedModal && getStartedModal.classList.contains('open')) {
        closeOnboardingModal();
      }
      if (projectModal && projectModal.classList.contains('open')) {
        closeProjectModal();
        if (lastFocusedTrigger) lastFocusedTrigger.focus();
      }
    }
  });

  if (onboardingForm) {
    onboardingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameInput = document.getElementById('learner-name');
      const emailInput = document.getElementById('learner-email');
      if (!nameInput || !emailInput) return;

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameVal) {
        showToast('Please enter your name to personalize your mentor workspace.');
        nameInput.focus();
        return;
      }

      if (!emailVal || !emailPattern.test(emailVal)) {
        showToast('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      if (modalFormContainer && onboardingSuccess) {
        modalFormContainer.style.display = 'none';
        onboardingSuccess.style.display = 'block';
      }
      showToast('Welcome to CodeMentra AI!');
    });
  }

  if (resetModalBtn) {
    resetModalBtn.addEventListener('click', function () {
      if (onboardingForm) onboardingForm.reset();
      closeOnboardingModal();
    });
  }

  /* ------------------------------------------------------------------------
     12. Graceful Placeholder Link Handling (Social # Links)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-placeholder-link]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const platform = link.getAttribute('data-placeholder-link') || 'Social';
      showToast(platform + ' profile link placeholder — will connect upon official venture launch.');
    });
  });
})();
