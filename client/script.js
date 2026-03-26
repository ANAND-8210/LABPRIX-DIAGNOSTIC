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
});
