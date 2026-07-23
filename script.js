const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("#site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const year = document.querySelector("[data-year]");

year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.closest("[data-project-card]")?.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const number = entry.target;
      const target = Number(number.dataset.count);
      const suffix = number.dataset.suffix || "";
      const shouldFormat = number.dataset.format === "comma";
      const startTime = performance.now();
      const duration = 1100;

      const tick = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        const displayed = shouldFormat
          ? current.toLocaleString("en-GB")
          : String(current);
        number.textContent = `${displayed}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(number);
    });
  },
  { threshold: 0.7 },
);

document.querySelectorAll("[data-count]").forEach((number) => {
  countObserver.observe(number);
});

document.querySelectorAll("[data-project-card]").forEach((card) => {
  const button = card.querySelector(".project-toggle");

  button.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.firstChild.textContent = isOpen ? "Hide approach " : "View approach ";
  });
});

const timeline = document.querySelector("[data-timeline]");
const timelineProgress = document.querySelector("[data-timeline-progress]");

const updateTimeline = () => {
  if (!timeline || !timelineProgress) return;
  const rect = timeline.getBoundingClientRect();
  const viewportPoint = window.innerHeight * 0.58;
  const progress = Math.max(
    0,
    Math.min(rect.height, viewportPoint - rect.top),
  );
  timelineProgress.style.height = `${progress}px`;
};

updateTimeline();
window.addEventListener("scroll", updateTimeline, { passive: true });
window.addEventListener("resize", updateTimeline);

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    });
  },
  { rootMargin: "-38% 0px -55% 0px" },
);

sections.forEach((section) => sectionObserver.observe(section));

const skillData = {
  solutions: {
    description:
      "Turning requirements into configured workflows, tracked milestones and coordinated delivery.",
    skills: [
      "Requirements gathering",
      "Customer onboarding",
      "Workflow design",
      "Configuration testing",
      "Milestone tracking",
      "Blocker resolution",
    ],
  },
  data: {
    description:
      "Preparing structured, reliable evidence for decisions, reporting and empirical analysis.",
    skills: [
      "Data validation",
      "Deduplication",
      "Linked Excel tables",
      "Difference-in-Differences",
      "Quality checks",
      "Structured reporting",
    ],
  },
  commercial: {
    description:
      "Connecting customer needs, market intelligence and operational constraints to practical action.",
    skills: [
      "International accounts",
      "Product selection",
      "Commercial quotations",
      "Distributor onboarding",
      "Market research",
      "Stakeholder communication",
    ],
  },
  tools: {
    description:
      "Using business and AI tools pragmatically to improve speed without compromising accuracy.",
    skills: [
      "Zoho CRM",
      "Microsoft Excel",
      "Stata",
      "Microsoft Copilot",
      "ChatGPT",
      "Claude",
    ],
  },
};

const skillButtons = [...document.querySelectorAll("[data-skill]")];
const skillDescription = document.querySelector("[data-skill-description]");
const skillCloud = document.querySelector("[data-skill-cloud]");

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.skill;
    const content = skillData[selected];

    skillButtons.forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab === button));
    });

    skillDescription.textContent = content.description;
    skillCloud.replaceChildren(
      ...content.skills.map((skill) => {
        const element = document.createElement("span");
        element.textContent = skill;
        return element;
      }),
    );
  });
});
