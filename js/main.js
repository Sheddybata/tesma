(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (toggle && header) {
    const label = toggle.querySelector(".visually-hidden");
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    };

    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("is-open"));
    });

    nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const errorBanner = document.getElementById("form-errors");
  const success = document.getElementById("form-success");
  const summary = document.getElementById("enquiry-summary");
  const send = document.getElementById("send-whatsapp");
  const edit = document.getElementById("edit-enquiry");

  const checks = [
    {
      input: form.elements.parent,
      error: document.getElementById("parent-error"),
      message: "Enter the parent or guardian’s name."
    },
    {
      input: form.elements.phone,
      error: document.getElementById("phone-error"),
      message: "Enter a phone number we can call or WhatsApp."
    },
    {
      input: form.elements.classChoice,
      error: document.getElementById("class-error"),
      message: "Choose a class, or “Not sure yet”."
    }
  ];

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  const clearErrors = () => {
    checks.forEach(({ input, error }) => {
      input.removeAttribute("aria-invalid");
      if (error) error.hidden = true;
    });
    if (errorBanner) errorBanner.hidden = true;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    let firstInvalid = null;
    checks.forEach(({ input, error, message }) => {
      if (!input.value.trim()) {
        input.setAttribute("aria-invalid", "true");
        if (error) {
          error.hidden = false;
          error.textContent = message;
        }
        firstInvalid = firstInvalid || input;
      }
    });

    const phone = form.elements.phone.value.trim();
    if (phone && phone.replace(/\D/g, "").length < 7) {
      const error = document.getElementById("phone-error");
      form.elements.phone.setAttribute("aria-invalid", "true");
      if (error) {
        error.hidden = false;
        error.textContent = "That phone number looks too short.";
      }
      firstInvalid = firstInvalid || form.elements.phone;
    }

    if (firstInvalid) {
      if (errorBanner) {
        errorBanner.hidden = false;
        errorBanner.textContent = "Please complete the marked fields before the note can be prepared.";
        errorBanner.focus();
      } else {
        firstInvalid.focus();
      }
      return;
    }

    const parent = form.elements.parent.value.trim();
    const child = form.elements.child.value.trim();
    const classChoice = form.elements.classChoice.value;
    const note = form.elements.note.value.trim();
    const lines = [
      "Hello TESMA admissions, I would like to enquire about a place.",
      "Parent or guardian: " + parent,
      "Phone: " + phone,
      child ? "Child’s first name: " + child : "",
      "Class: " + classChoice,
      note ? "Note: " + note : ""
    ].filter(Boolean);

    if (send) {
      send.href = "https://wa.me/2349039830321?text=" + encodeURIComponent(lines.join("\n"));
    }

    if (summary) {
      const rows = [
        ["Parent or guardian", parent],
        ["Phone", phone],
        ["Child", child || "Not given"],
        ["Class", classChoice],
        ["Note", note || "None"]
      ];
      summary.innerHTML = rows
        .map(([label, value]) => "<div><dt>" + label + "</dt><dd>" + escapeHtml(value) + "</dd></div>")
        .join("");
    }

    form.hidden = true;
    if (success) {
      success.hidden = false;
      document.getElementById("success-title")?.focus();
    }
  });

  edit?.addEventListener("click", () => {
    if (success) success.hidden = true;
    form.hidden = false;
    form.elements.parent.focus();
  });
})();
