/* ============================================================
   fleet.js — data for the 16-agent AI fleet (AI Fleet Commander)
   Used by commands.js for the interactive `fleet status` output.
   The visible table lives in index.html so no-JS users get it too.
   ============================================================ */
window.FLEET = [
  { name: "frontend",      role: "builds UI & components",         status: "online"  },
  { name: "backend",       role: "APIs, services, data flows",     status: "online"  },
  { name: "security",      role: "audits & hardening",             status: "online"  },
  { name: "ui-ux",         role: "design systems & prototypes",    status: "online"  },
  { name: "testing",       role: "QA, test automation",            status: "online"  },
  { name: "healthcare",    role: "hospital domain (HL7, HIS)",     status: "online"  },
  { name: "finance",       role: "budgeting & ops reporting",      status: "idle"    },
  { name: "devops",        role: "CI/CD & infrastructure",         status: "online"  },
  { name: "data-analyst",  role: "dashboards & reports",           status: "idle"    },
  { name: "research",      role: "literature & recon",             status: "idle"    },
  { name: "code-review",   role: "PR & quality gates",             status: "online"  },
  { name: "docs",          role: "documentation & runbooks",       status: "idle"    },
  { name: "sql-engineer",  role: "database design & queries",      status: "online"  },
  { name: "translator",    role: "Bahasa \u2194 English localization", status: "idle" },
  { name: "infra",         role: "server & virtualization",        status: "online"  },
  { name: "commander",     role: "kanban orchestration (me)",      status: "always"  }
];
