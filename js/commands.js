/* ============================================================
   commands.js — fake shell command resolver for the command bar
   Exposes window.resolveCommand(cmd) -> { text, scrollTo, open }
   ============================================================ */
(function () {
  "use strict";

  var HELP = [
    "available commands:",
    "  help             show this help",
    "  whoami           about Kadek",
    "  ls               list sections",
    "  cat <section>    read a section (about, skills, experience, projects, publications)",
    "  fleet status     show the AI fleet",
    "  docker ps        alias for fleet status",
    "  echo $CONTACT    show contact info",
    "  contact          jump to contact",
    "  open <link>      open linkedin / email",
    "  clear            clear this output",
    "  exit             end session"
  ].join("\n");

  var SECTIONS = {
    "about":          { id: "about",          label: "about.md" },
    "about.md":       { id: "about",          label: "about.md" },
    "skills":         { id: "skills",         label: "skills.txt" },
    "skills.txt":     { id: "skills",         label: "skills.txt" },
    "experience":     { id: "experience",     label: "experience" },
    "projects":       { id: "projects",       label: "projects" },
    "publications":   { id: "publications",   label: "publications.bib" },
    "publications.bib": { id: "publications", label: "publications.bib" },
    "education":      { id: "about",          label: "education.txt" },
    "education.txt":  { id: "about",          label: "education.txt" },
    "certifications": { id: "about",          label: "certifications.txt" },
    "certifications.txt": { id: "about",      label: "certifications.txt" }
  };

  function fleetTable() {
    function pad(s, n) { while (s.length < n) s += " "; return s; }
    var fleet = window.FLEET || [];
    var NAME_W = 15; // NAME column width
    var ROLE_W = 0;  // ROLE column width, sized to the longest role
    fleet.forEach(function (a) {
      if (a.role.length > ROLE_W) ROLE_W = a.role.length;
    });
    var rows = fleet.map(function (a) {
      var status = a.status === "always" ? "\u25cf always-on"
                 : a.status === "online" ? "\u25cf online"
                 : "\u25cf idle";
      // Pad each column to a fixed width, then add one separator space so the
      // ROLE text (even when it fills its whole column) never touches STATUS.
      return "  " + pad(a.name, NAME_W) + pad(a.role, ROLE_W) + " " + status;
    });
    var head = "  " + pad("NAME", NAME_W) + pad("ROLE", ROLE_W) + " " + "STATUS";
    var rule = Array(NAME_W + ROLE_W + 14).join("\u2500"); // spans the widest row
    return head + "\n  " + rule + "\n" + rows.join("\n") +
           "\n\n  16 agents \u00b7 1 commander \u00b7 zero micromanagement";
  }

  function resolveCommand(raw) {
    var cmd = (raw || "").trim();
    if (!cmd) return null;

    var lower = cmd.toLowerCase();
    var parts = cmd.split(/\s+/);

    // help
    if (lower === "help" || lower === "h" || lower === "?") {
      return { text: HELP };
    }
    // whoami
    if (lower === "whoami") {
      return {
        text: "Kadek Yoga Vidya Pradnyaditha\n" +
              "IT Support & AI System Developer \u2014 Bali, Indonesia\n" +
              "systems thinker \u00b7 problem solver \u00b7 AI Fleet Commander",
        scrollTo: "about"
      };
    }
    // ls
    if (lower === "ls") {
      return {
        text: "about.md   skills.txt   experience   projects   publications.bib\n" +
              "fleet/     contact"
      };
    }
    // fleet / docker ps
    if (lower === "fleet status" || lower === "fleet" || lower === "docker ps") {
      return { text: fleetTable(), scrollTo: "fleet" };
    }
    // echo $CONTACT
    if (lower === "echo $contact" || lower === "echo contact") {
      return {
        text: "LinkedIn   linkedin.com/in/kadekyogavidyapradnyaditha\n" +
              "Email      vidyayoga7@gmail.com\n" +
              "Location   Bali, Indonesia",
        scrollTo: "contact"
      };
    }
    // contact
    if (lower === "contact") {
      return { text: "jumping to contact\u2026", scrollTo: "contact" };
    }
    // clear
    if (lower === "clear" || lower === "cls") {
      return { text: "", clear: true };
    }
    // exit
    if (lower === "exit" || lower === "logout") {
      return { text: "> Thanks for the visit. Session closed. \u25ae" };
    }
    // cat <section>
    if (parts[0] === "cat" && parts.length >= 2) {
      var key = parts.slice(1).join(" ");
      var s = SECTIONS[key] || SECTIONS[key.toLowerCase()];
      if (s) {
        return { text: "opening " + s.label + "\u2026", scrollTo: s.id };
      }
      return { text: "cat: " + parts[1] + ": No such file or directory" };
    }
    // open <link>
    if (parts[0] === "open" && parts.length >= 2) {
      var target = parts.slice(1).join(" ").toLowerCase();
      if (target.indexOf("linkedin") !== -1) {
        return { text: "opening linkedin\u2026", open: "https://linkedin.com/in/kadekyogavidyapradnyaditha" };
      }
      if (target.indexOf("email") !== -1 || target.indexOf("mail") !== -1) {
        return { text: "opening email\u2026", open: "mailto:vidyayoga7@gmail.com" };
      }
      return { text: "open: unknown target '" + parts.slice(1).join(" ") + "'" };
    }
    // unknown
    return {
      text: "command not found: " + cmd + "\n" +
            "type 'help' to see available commands"
    };
  }

  window.resolveCommand = resolveCommand;
})();
