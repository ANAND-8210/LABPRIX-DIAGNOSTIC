const packages = [
  {
    name: "Normal Health Checkup Package",
    price: "Rs. 3000",
    badge: "Popular",
    featured: true,
    image: "../image1.jpg",
    tests: [
      "CBC",
      "ESR",
      "Random Blood Sugar",
      "HbA1C",
      "Lipid Profile",
      "Liver Profile",
      "Kidney Profile",
      "Urine Routine",
      "Calcium",
      "T3, T4, TSH",
      "Vitamin D3",
      "Vitamin B12",
      "Iron Studies"
    ]
  },
  {
    name: "Advance Health Checkup Package",
    price: "Rs. 3500",
    badge: "Upgrade",
    image: "../image2.jpg",
    tests: [
      "CBC",
      "ESR",
      "Random Blood Sugar",
      "HbA1C",
      "Lipid Profile",
      "Liver Profile",
      "Kidney Profile",
      "Urine Routine",
      "Calcium",
      "T3, T4, TSH",
      "Vitamin D3",
      "Vitamin B12",
      "Iron Studies",
      "Hb Electrophoresis"
    ]
  },
  {
    name: "Diabetic Profile",
    price: "Rs. 1200",
    badge: "Diabetes Care",
    image: "../image3.jpg",
    tests: [
      "CBC",
      "Blood Sugar Fasting",
      "Post Prandial",
      "HbA1C",
      "Lipid Profile"
    ]
  },
  {
    name: "Type 2 Diabetes Test",
    price: "Rs. 550",
    badge: "Quick Test",
    image: "../image4.jpg",
    tests: [
      "Random Blood Sugar",
      "HbA1C"
    ]
  },
  {
    name: "Thyroid Profile",
    price: "Rs. 750",
    badge: "Thyroid Care",
    image: "../image5.jpg",
    tests: [
      "T3",
      "T4",
      "TSH",
      "FT3",
      "FT4"
    ]
  },
  {
    name: "Senior Citizen Health Checkup",
    price: "Rs. 3900",
    badge: "Senior Care",
    image: "../image6.jpg",
    tests: [
      "CRP",
      "RA",
      "CK Total",
      "CBC",
      "ESR",
      "Blood Sugar",
      "HbA1C",
      "Lipid",
      "Liver",
      "Kidney",
      "Urine",
      "Calcium",
      "Thyroid",
      "Vitamins",
      "Iron"
    ]
  },
  {
    name: "Male Full Body Checkup",
    price: "Rs. 4500",
    badge: "Men's Wellness",
    image: "../image7.jpg",
    tests: [
      "PSA",
      "CEA",
      "HIV",
      "HBsAg",
      "Full body tests"
    ]
  },
  {
    name: "Female Full Body Checkup",
    price: "Rs. 4750",
    badge: "Women's Wellness",
    image: "../image8.jpg",
    tests: [
      "CA-125",
      "CEA",
      "HIV",
      "HBsAg",
      "Full body tests"
    ]
  },
  {
    name: "Preventive Silver Profile",
    price: "Rs. 2200",
    badge: "Preventive Care",
    image: "../image4.jpg",
    tests: [
      "CBC",
      "ESR",
      "Sugar",
      "HbA1C",
      "Lipid",
      "Liver Screening",
      "Kidney Screening",
      "Urine",
      "Thyroid"
    ]
  },
  {
    name: "Routine Health Checkup",
    price: "Rs. 1500",
    badge: "Routine Care",
    image: "../image6.jpg",
    tests: [
      "CBC",
      "ESR",
      "Sugar Fasting/PP",
      "Lipid",
      "Liver",
      "Kidney",
      "Urine",
      "TSH"
    ]
  }
];

const packageAliases = {
  "Normal Health Checkup Package": ["normal health checkup", "normal package", "normal checkup"],
  "Advance Health Checkup Package": ["advance health checkup", "advance package", "advanced package"],
  "Diabetic Profile": ["diabetic profile", "diabetes profile", "diabetic package"],
  "Type 2 Diabetes Test": ["type 2 diabetes test", "type 2 test", "diabetes test"],
  "Thyroid Profile": ["thyroid profile", "thyroid package", "thyroid test"],
  "Senior Citizen Health Checkup": ["senior citizen health checkup", "senior citizen package", "senior package"],
  "Male Full Body Checkup": ["male full body checkup", "male checkup", "mens checkup", "men checkup"],
  "Female Full Body Checkup": ["female full body checkup", "female checkup", "womens checkup", "women checkup"],
  "Preventive Silver Profile": ["preventive silver profile", "preventive profile", "silver profile"],
  "Routine Health Checkup": ["routine health checkup", "routine package", "routine profile"]
};

const testDetails = [
  {
    name: "CBC",
    aliases: ["cbc", "complete blood count"],
    description:
      "CBC measures red cells, white cells, hemoglobin, and platelets to look for anemia, infection, and overall blood health."
  },
  {
    name: "ESR",
    aliases: ["esr", "erythrocyte sedimentation rate"],
    description:
      "ESR is an inflammation marker that can support investigation of infection and inflammatory conditions."
  },
  {
    name: "Random Blood Sugar",
    aliases: ["random blood sugar", "rbs", "blood sugar"],
    description:
      "Random Blood Sugar checks current glucose levels and is commonly used for diabetes screening."
  },
  {
    name: "HbA1C",
    aliases: ["hba1c", "hb a1c", "a1c"],
    description:
      "HbA1C shows the average blood sugar level over the last two to three months."
  },
  {
    name: "Lipid Profile",
    aliases: ["lipid profile", "lipid", "cholesterol test"],
    description:
      "Lipid Profile measures cholesterol and triglycerides to assess heart and blood vessel risk."
  },
  {
    name: "Liver Profile",
    aliases: ["liver profile", "liver function", "liver"],
    description:
      "Liver Profile evaluates enzymes and proteins that help assess liver health."
  },
  {
    name: "Kidney Profile",
    aliases: ["kidney profile", "kidney function", "kidney"],
    description:
      "Kidney Profile checks markers that help evaluate filtration and kidney function."
  },
  {
    name: "Urine Routine",
    aliases: ["urine routine", "urine test", "urine"],
    description:
      "Urine Routine helps screen for infection, sugar loss in urine, kidney issues, and hydration changes."
  },
  {
    name: "Calcium",
    aliases: ["calcium"],
    description:
      "Calcium testing supports bone health assessment and can also reflect hormone or kidney-related issues."
  },
  {
    name: "T3",
    aliases: ["t3"],
    description:
      "T3 is a thyroid hormone that helps assess thyroid activity and metabolism."
  },
  {
    name: "T4",
    aliases: ["t4"],
    description:
      "T4 is a major thyroid hormone used with T3 and TSH to evaluate thyroid function."
  },
  {
    name: "TSH",
    aliases: ["tsh"],
    description:
      "TSH is one of the key thyroid screening markers and helps identify underactive or overactive thyroid states."
  },
  {
    name: "FT3",
    aliases: ["ft3"],
    description:
      "FT3 measures free triiodothyronine, the active unbound thyroid hormone in circulation."
  },
  {
    name: "FT4",
    aliases: ["ft4"],
    description:
      "FT4 measures free thyroxine and gives a clearer picture of active thyroid hormone levels."
  },
  {
    name: "Vitamin D3",
    aliases: ["vitamin d3", "vitamin d"],
    description:
      "Vitamin D3 testing helps assess bone support, immunity, and deficiency risk."
  },
  {
    name: "Vitamin B12",
    aliases: ["vitamin b12", "b12"],
    description:
      "Vitamin B12 testing supports evaluation of nerve health, anemia, and nutritional deficiency."
  },
  {
    name: "Iron Studies",
    aliases: ["iron studies", "iron"],
    description:
      "Iron Studies help assess iron deficiency, iron overload, and anemia causes."
  },
  {
    name: "Hb Electrophoresis",
    aliases: ["hb electrophoresis", "hemoglobin electrophoresis"],
    description:
      "Hb Electrophoresis is used to detect hemoglobin variants and inherited blood disorders."
  },
  {
    name: "CRP",
    aliases: ["crp", "c reactive protein"],
    description:
      "CRP is a marker of inflammation that can rise in infection and other inflammatory conditions."
  },
  {
    name: "RA",
    aliases: ["ra", "rheumatoid factor"],
    description:
      "RA testing supports evaluation of rheumatoid arthritis and some autoimmune conditions."
  },
  {
    name: "CK Total",
    aliases: ["ck total", "creatine kinase"],
    description:
      "CK Total can help assess muscle injury or strain and some cardiac-related concerns."
  },
  {
    name: "PSA",
    aliases: ["psa"],
    description:
      "PSA is commonly used in male health screening related to the prostate."
  },
  {
    name: "CEA",
    aliases: ["cea"],
    description:
      "CEA is a marker sometimes used in monitoring and follow-up for selected conditions."
  },
  {
    name: "HIV",
    aliases: ["hiv"],
    description:
      "HIV screening helps detect antibodies or antigens related to HIV infection."
  },
  {
    name: "HBsAg",
    aliases: ["hbsag", "hepatitis b"],
    description:
      "HBsAg screening is used to check for hepatitis B surface antigen."
  },
  {
    name: "CA-125",
    aliases: ["ca 125", "ca-125"],
    description:
      "CA-125 is a marker that may be used in selected female health evaluations and follow-up."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_LOCAL_API_ORIGIN = "http://localhost:5000";
  const FALLBACK_LOCAL_API_ORIGIN = "http://127.0.0.1:5000";
  const API_PORT = "5000";
  const API_DISCOVERY_TIMEOUT_MS = 2500;
  const API_REQUEST_TIMEOUT_MS = 10000;
  const packageGrid = document.getElementById("package-grid");
  const packageSelect = document.getElementById("package-select");
  const bookingForm = document.getElementById("booking-form");
  const bookingModal = document.getElementById("booking-modal");
  const preferredDateInput = document.getElementById("preferred-date");
  const formFeedback = document.getElementById("form-feedback");
  const connectionStatus = document.getElementById("connection-status");
  const submitButton = document.getElementById("submit-button");
  const aiChatForm = document.getElementById("ai-chat-form");
  const aiChatInput = document.getElementById("ai-chat-input");
  const aiChatMessages = document.getElementById("ai-chat-messages");
  const chatSuggestionButtons = document.querySelectorAll("[data-chat-question]");
  const openButtons = document.querySelectorAll("[data-open-booking]");
  const closeButtons = document.querySelectorAll("[data-close-booking]");
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocusedElement = null;
  let resolvedApiBaseUrl = null;
  let apiResolutionPromise = null;

  const setConnectionStatus = (message, state) => {
    if (!connectionStatus) {
      return;
    }

    connectionStatus.textContent = message;
    connectionStatus.dataset.state = state;
  };

  const normalizeText = (value = "") =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9+]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const containsPhrase = (text, phrase) => {
    const normalizedText = normalizeText(text);
    const normalizedPhrase = normalizeText(phrase);

    if (!normalizedText || !normalizedPhrase) {
      return false;
    }

    return new RegExp(`(?:^| )${escapeRegExp(normalizedPhrase)}(?:$| )`).test(
      normalizedText
    );
  };

  const formatTests = (tests) => tests.join(", ");

  const buildPackagePriceList = () =>
    packages.map((pkg) => `- ${pkg.name}: ${pkg.price}`).join("\n");

  const findPackageByMessage = (normalizedMessage) =>
    packages.find((pkg) => {
      const aliases = [pkg.name, ...(packageAliases[pkg.name] || [])];
      return aliases.some((alias) => containsPhrase(normalizedMessage, alias));
    }) || null;

  const findTestByMessage = (normalizedMessage) =>
    testDetails.find((test) =>
      test.aliases.some((alias) => containsPhrase(normalizedMessage, alias))
    ) || null;

  const packageIncludesTest = (pkg, test) =>
    pkg.tests.some((packageTest) => {
      return test.aliases.some((alias) => containsPhrase(packageTest, alias));
    });

  const getPackagesWithTest = (test) =>
    packages.filter((pkg) => packageIncludesTest(pkg, test));

  const buildPackageResponse = (pkg) => {
    const packageNotes = {
      "Thyroid Profile":
        "This package focuses on thyroid hormone balance and thyroid gland function.",
      "Diabetic Profile":
        "This package is useful when you want a broader diabetes-focused screening.",
      "Type 2 Diabetes Test":
        "This is a smaller diabetes-focused test option for quick screening.",
      "Senior Citizen Health Checkup":
        "This package is designed for broader preventive screening in older adults."
    };
    const note = packageNotes[pkg.name] ? ` ${packageNotes[pkg.name]}` : "";

    return `${pkg.name} costs ${pkg.price} and includes ${pkg.tests.length} tests: ${formatTests(
      pkg.tests
    )}.${note}`;
  };

  const appendChatMessage = (role, message) => {
    if (!aiChatMessages) {
      return;
    }

    const article = document.createElement("article");
    const label = document.createElement("span");
    const copy = document.createElement("p");

    article.className = `chat-message ${role === "user" ? "is-user" : "is-bot"}`;
    label.className = "chat-role";
    label.textContent = role === "user" ? "You" : "LabPrix AI";
    copy.textContent = message;

    article.append(label, copy);
    aiChatMessages.append(article);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  };

  const getChatResponse = (message) => {
    const normalizedMessage = normalizeText(message);
    const matchedPackage = findPackageByMessage(normalizedMessage);
    const matchedTest = findTestByMessage(normalizedMessage);

    if (!normalizedMessage) {
      return "Ask me about a package, a test name, or the price of a health package.";
    }

    if (/\b(hello|hi|hey|help)\b/.test(normalizedMessage)) {
      return "Hello! I can explain common tests, list package prices, tell you what is included in a package, and help you choose a package before booking.";
    }

    if (matchedPackage && /(price|cost|fee|amount)/.test(normalizedMessage)) {
      return `${matchedPackage.name} is priced at ${matchedPackage.price}.`;
    }

    if (matchedPackage && /(include|included|contains|tests|details|detail|explain)/.test(normalizedMessage)) {
      return buildPackageResponse(matchedPackage);
    }

    if (matchedPackage && /(book|appointment|date|schedule)/.test(normalizedMessage)) {
      return `To book ${matchedPackage.name}, click its Book Now button or use the main booking button, then fill in your name, phone, email, package, and preferred date.`;
    }

    if (matchedPackage) {
      return buildPackageResponse(matchedPackage);
    }

    if (matchedTest && /(which package|which packages|package includes|included in|have this test|contains)/.test(normalizedMessage)) {
      const packagesWithTest = getPackagesWithTest(matchedTest);

      if (packagesWithTest.length === 0) {
        return `${matchedTest.name} is not explicitly listed in the current package cards.`;
      }

      return `${matchedTest.name} is included in: ${packagesWithTest
        .map((pkg) => pkg.name)
        .join(", ")}.`;
    }

    if (matchedTest) {
      const packagesWithTest = getPackagesWithTest(matchedTest);
      const inclusionText =
        packagesWithTest.length > 0
          ? ` It appears in: ${packagesWithTest.map((pkg) => pkg.name).join(", ")}.`
          : "";

      return `${matchedTest.name}: ${matchedTest.description}${inclusionText}`;
    }

    if (/\b(diabet\w*|sugar|hba1c)\b/.test(normalizedMessage)) {
      return "For diabetes-focused screening, the best matches are Diabetic Profile for a broader package and Type 2 Diabetes Test for a quick screening option.";
    }

    if (/\b(thyroid|tsh|ft3|ft4|t3|t4)\b/.test(normalizedMessage)) {
      return "For thyroid-related screening, the Thyroid Profile is the best direct option. It includes T3, T4, TSH, FT3, and FT4.";
    }

    if (/\b(senior|elder|old age)\b/.test(normalizedMessage)) {
      return "Senior Citizen Health Checkup is the best match for broader preventive screening for older adults.";
    }

    if (/\b(female|women|womens|woman)\b/.test(normalizedMessage)) {
      return "Female Full Body Checkup is the strongest match for a female-focused preventive package.";
    }

    if (/\b(male|men|mens|man)\b/.test(normalizedMessage)) {
      return "Male Full Body Checkup is the strongest match for a male-focused preventive package.";
    }

    if (/\b(preventive|routine|basic checkup|full price list|all prices|package prices|package list)\b/.test(normalizedMessage)) {
      return `Here are the current package prices:\n${buildPackagePriceList()}`;
    }

    if (/(book|appointment|booking|form)/.test(normalizedMessage)) {
      return "Use the Book Now button anywhere on the page to open the booking form. After that, choose your package and preferred date, then submit your details.";
    }

    return 'I can help with package prices, test meanings, and package inclusions. Try asking "What does CBC mean?", "Which package is best for diabetes?", or "What is included in the Thyroid Profile?"';
  };

  const handleChatQuestion = (question) => {
    if (!question) {
      return;
    }

    appendChatMessage("user", question);
    window.setTimeout(() => {
      appendChatMessage("bot", getChatResponse(question));
    }, 220);
  };

  const getApiCandidates = () => {
    const { protocol, hostname, origin } = window.location;
    const candidates = [];

    if (protocol !== "file:" && origin && origin !== "null") {
      candidates.push(origin);
    }

    if ((protocol === "http:" || protocol === "https:") && hostname) {
      candidates.push(`${protocol}//${hostname}:${API_PORT}`);
    }

    candidates.push(DEFAULT_LOCAL_API_ORIGIN, FALLBACK_LOCAL_API_ORIGIN);

    return [...new Set(candidates)];
  };

  const buildApiUrl = (baseUrl, pathname) => {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const requestJson = async (baseUrl, pathname, options = {}) => {
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? API_REQUEST_TIMEOUT_MS;
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(buildApiUrl(baseUrl, pathname), {
        ...options,
        signal: controller.signal
      });
      const responseText = await response.text();
      const trimmedResponse = responseText.trim();
      let data = null;

      if (trimmedResponse) {
        if (trimmedResponse.startsWith("<")) {
          throw new Error("Expected JSON from the booking server but received HTML.");
        }

        try {
          data = JSON.parse(trimmedResponse);
        } catch (error) {
          throw new Error("Unexpected response from server.");
        }
      }

      return { response, data };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The booking server took too long to respond.");
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const resolveApiBaseUrl = async (forceRefresh = false) => {
    if (resolvedApiBaseUrl && !forceRefresh) {
      return resolvedApiBaseUrl;
    }

    if (apiResolutionPromise && !forceRefresh) {
      return apiResolutionPromise;
    }

    setConnectionStatus("Checking booking server connection...", "checking");

    apiResolutionPromise = (async () => {
      for (const candidate of getApiCandidates()) {
        try {
          const { response, data } = await requestJson(candidate, "/api/health", {
            timeoutMs: API_DISCOVERY_TIMEOUT_MS
          });

          if (response.ok && data?.success) {
            resolvedApiBaseUrl = candidate;
            setConnectionStatus(`Booking server connected at ${candidate}.`, "success");
            return candidate;
          }
        } catch (error) {
          continue;
        }
      }

      resolvedApiBaseUrl = null;
      setConnectionStatus(
        "Booking server offline. Start the Express server and open http://localhost:5000.",
        "error"
      );
      return null;
    })();

    const result = await apiResolutionPromise;
    apiResolutionPromise = null;
    return result;
  };

  const renderPackages = () => {
    if (!packageGrid || !packageSelect) {
      return;
    }

    packageGrid.innerHTML = packages
      .map(
        (pkg) => `
          <article class="package-card ${pkg.featured ? "featured" : ""}">
            <figure class="card-media">
              <img src="${pkg.image}" alt="${pkg.name}">
            </figure>
            <div class="card-head">
              <span class="package-chip">${pkg.badge}</span>
              <h3>${pkg.name}</h3>
              <p class="price-tag">${pkg.price}</p>
            </div>
            <ul class="card-tests">
              ${pkg.tests.map((test) => `<li>${test}</li>`).join("")}
            </ul>
            <button
              class="card-button"
              type="button"
              data-book-package="${pkg.name}"
            >
              Book Now
            </button>
          </article>
        `
      )
      .join("");

    packageSelect.innerHTML = `
      <option value="">Choose a package</option>
      ${packages
        .map((pkg) => `<option value="${pkg.name}">${pkg.name}</option>`)
        .join("")}
    `;
  };

  const setMinimumDate = () => {
    if (!preferredDateInput) {
      return;
    }

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    preferredDateInput.min = localDate;
  };

  const clearFeedback = () => {
    if (!formFeedback) {
      return;
    }

    formFeedback.textContent = "";
    formFeedback.dataset.state = "";
  };

  const setFeedback = (message, state) => {
    if (!formFeedback) {
      return;
    }

    formFeedback.textContent = message;
    formFeedback.dataset.state = state;
  };

  const clearFieldErrors = () => {
    if (!bookingForm) {
      return;
    }

    bookingForm.querySelectorAll("input, select").forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    });
  };

  const markFieldErrors = (errors) => {
    clearFieldErrors();

    Object.keys(errors).forEach((fieldName) => {
      const field = bookingForm?.querySelector(`[name="${fieldName}"]`);

      if (field) {
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
      }
    });
  };

  const openModal = (selectedPackage = "") => {
    if (!bookingModal || !packageSelect) {
      return;
    }

    lastFocusedElement = document.activeElement;
    bookingModal.classList.add("is-open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    packageSelect.value = selectedPackage || "";
    clearFeedback();
    clearFieldErrors();

    const firstField = bookingModal.querySelector("input, select");
    if (firstField) {
      firstField.focus();
    }

    if (!resolvedApiBaseUrl) {
      void resolveApiBaseUrl();
    }
  };

  const closeModal = () => {
    if (!bookingModal) {
      return;
    }

    bookingModal.classList.remove("is-open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const validateBooking = (bookingData) => {
    const errors = {};
    const phoneDigits = bookingData.phone.replace(/\D/g, "");

    if (!bookingData.name) {
      errors.name = "Full name is required.";
    }

    if (!bookingData.phone) {
      errors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      errors.phone = "Phone number must be between 10 and 15 digits.";
    }

    if (!bookingData.email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!bookingData.package) {
      errors.package = "Please select a package.";
    }

    if (!bookingData.date) {
      errors.date = "Please choose a preferred date.";
    }

    return errors;
  };

  const getBookingData = () => {
    const formData = new FormData(bookingForm);

    return {
      name: formData.get("name")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      package: formData.get("package")?.toString().trim() || "",
      date: formData.get("date")?.toString().trim() || ""
    };
  };

  const setSubmittingState = (isSubmitting) => {
    if (!submitButton) {
      return;
    }

    const label = submitButton.querySelector(".button-label");

    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-loading", isSubmitting);

    if (label) {
      label.textContent = isSubmitting ? "Submitting..." : "Confirm Booking";
    }
  };

  renderPackages();
  setMinimumDate();
  void resolveApiBaseUrl();
  appendChatMessage(
    "bot",
    "Hello! I can help with package prices, included tests, thyroid and diabetes screening, vitamins, and booking guidance. Ask about CBC, HbA1C, a package name, or click one of the suggested questions."
  );

  document.querySelectorAll("[data-book-package]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.bookPackage || "");
    });
  });

  openButtons.forEach((button) => {
    button.addEventListener("click", () => openModal());
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  chatSuggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.chatQuestion || "";
      handleChatQuestion(question);
      aiChatInput?.focus();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!bookingModal?.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = Array.from(
        bookingModal.querySelectorAll(focusableSelector)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  bookingForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearFeedback();
    clearFieldErrors();

    const bookingData = getBookingData();
    const errors = validateBooking(bookingData);

    if (Object.keys(errors).length > 0) {
      markFieldErrors(errors);
      setFeedback(Object.values(errors)[0], "error");
      return;
    }

    try {
      setSubmittingState(true);

      const apiBaseUrl = await resolveApiBaseUrl();

      if (!apiBaseUrl) {
        throw new Error(
          "Cannot reach the booking server. Start the Express server on http://localhost:5000."
        );
      }

      const { response, data } = await requestJson(apiBaseUrl, "/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error(
          data?.message || "Something went wrong while saving the booking."
        );
      }

      setConnectionStatus(`Booking server connected at ${apiBaseUrl}.`, "success");
      setFeedback(data?.message || "Booking saved successfully.", "success");
      bookingForm.reset();
      setMinimumDate();
      clearFieldErrors();
      window.setTimeout(closeModal, 900);
    } catch (error) {
      resolvedApiBaseUrl = null;
      void resolveApiBaseUrl(true);

      const message =
        error instanceof TypeError
          ? "Cannot reach the booking server. Start the Express server on http://localhost:5000."
          : error.message || "Something went wrong.";

      setFeedback(message, "error");
    } finally {
      setSubmittingState(false);
    }
  });

  aiChatForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = aiChatInput?.value.trim() || "";

    if (!question) {
      return;
    }

    handleChatQuestion(question);

    if (aiChatInput) {
      aiChatInput.value = "";
      aiChatInput.focus();
    }
  });
});
