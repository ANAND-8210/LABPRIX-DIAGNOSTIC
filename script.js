const TEST_TYPES = ["Blood Test", "Sugar Test", "Full Body Checkup"];
const BOOKING_API_URL =
  window.BOOKING_API_URL || "https://your-backend.onrender.com/book";
const WHATSAPP_NUMBER = "918454822399";
const REQUEST_TIMEOUT_MS = 15000;

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("booking-form");
  const submitButton = document.getElementById("submitButton");
  const bookingDateInput = document.getElementById("bookingDate");
  const bookingTimeInput = document.getElementById("bookingTime");
  const formStatus = document.getElementById("form-status");
  const fallbackLink = document.getElementById("whatsapp-fallback");

  if (!bookingForm || !submitButton || !bookingDateInput || !bookingTimeInput) {
    return;
  }

  const fieldMap = {
    name: document.getElementById("fullName"),
    phone: document.getElementById("phoneNumber"),
    email: document.getElementById("emailAddress"),
    testType: document.getElementById("testType"),
    date: bookingDateInput,
    time: bookingTimeInput,
    address: document.getElementById("address")
  };

  const setMinimumDate = () => {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    bookingDateInput.min = localDate;
  };

  const setDefaultTime = () => {
    if (bookingTimeInput.value) {
      return;
    }

    const now = new Date();
    const roundedMinutes = Math.ceil(now.getMinutes() / 30) * 30;

    if (roundedMinutes === 60) {
      now.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
      now.setMinutes(roundedMinutes, 0, 0);
    }

    bookingTimeInput.value = now.toTimeString().slice(0, 5);
  };

  const getFormValues = () => {
    const formData = new FormData(bookingForm);

    return {
      name: formData.get("name")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      testType: formData.get("testType")?.toString().trim() || "",
      date: formData.get("date")?.toString().trim() || "",
      time: formData.get("time")?.toString().trim() || "",
      address: formData.get("address")?.toString().trim() || ""
    };
  };

  const getTodayString = () => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  const validateBooking = (values) => {
    const errors = {};
    const phoneDigits = values.phone.replace(/\D/g, "");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (values.name.length < 2) {
      errors.name = "Please enter your full name.";
    }

    if (!values.phone) {
      errors.phone = "Please enter your phone number.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      errors.phone = "Phone number must be 10 to 15 digits.";
    }

    if (!values.email) {
      errors.email = "Please enter your email address.";
    } else if (!emailPattern.test(values.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!TEST_TYPES.includes(values.testType)) {
      errors.testType = "Please select a valid test type.";
    }

    if (!values.date) {
      errors.date = "Please choose a booking date.";
    } else if (values.date < getTodayString()) {
      errors.date = "Booking date cannot be in the past.";
    }

    if (!values.time) {
      errors.time = "Please choose a booking time.";
    } else if (!timePattern.test(values.time)) {
      errors.time = "Please choose a valid time.";
    }

    if (!values.address) {
      errors.address = "Please enter your address for home visit.";
    } else if (values.address.length < 10) {
      errors.address = "Address should be at least 10 characters long.";
    }

    return errors;
  };

  const clearFieldErrors = () => {
    Object.entries(fieldMap).forEach(([fieldName, field]) => {
      const errorNode = document.getElementById(`${fieldName}-error`);

      if (field) {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
      }

      if (errorNode) {
        errorNode.textContent = "";
      }
    });
  };

  const showFieldErrors = (errors) => {
    clearFieldErrors();

    Object.entries(errors).forEach(([fieldName, message]) => {
      const field = fieldMap[fieldName];
      const errorNode = document.getElementById(`${fieldName}-error`);

      if (field) {
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");
      }

      if (errorNode) {
        errorNode.textContent = message;
      }
    });

    const firstInvalidField = Object.keys(errors)
      .map((fieldName) => fieldMap[fieldName])
      .find(Boolean);

    firstInvalidField?.focus();
  };

  const setFormStatus = (message, state = "") => {
    formStatus.textContent = message;
    formStatus.classList.remove("is-success", "is-error");

    if (state) {
      formStatus.classList.add(`is-${state}`);
    }
  };

  const setSubmittingState = (isSubmitting) => {
    const label = submitButton.querySelector(".button-label");

    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-loading", isSubmitting);

    if (label) {
      label.textContent = isSubmitting ? "Submitting..." : "Book Home Collection";
    }
  };

  const buildWhatsAppMessage = (values) =>
    [
      "New Booking:",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Test: ${values.testType}`,
      `Date: ${values.date}`,
      `Time: ${values.time}`,
      `Address: ${values.address}`
    ].join("\n");

  const buildWhatsAppUrl = (values) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWhatsAppMessage(values)
    )}`;

  const showFallbackLink = (url) => {
    fallbackLink.href = url;
    fallbackLink.classList.remove("is-hidden");
  };

  const hideFallbackLink = () => {
    fallbackLink.classList.add("is-hidden");
    fallbackLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  };

  const requestJson = async (url, payload) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const rawResponse = await response.text();
      const responseData = rawResponse ? JSON.parse(rawResponse) : null;

      if (!response.ok) {
        throw new Error(responseData?.message || "Booking request failed.");
      }

      return responseData;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The booking server took too long to respond.");
      }

      if (error instanceof SyntaxError) {
        throw new Error("The booking server returned an invalid response.");
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearFieldErrors();
    setFormStatus("");
    hideFallbackLink();

    const values = getFormValues();
    const errors = validateBooking(values);

    if (Object.keys(errors).length > 0) {
      showFieldErrors(errors);
      setFormStatus(Object.values(errors)[0], "error");
      return;
    }

    try {
      setSubmittingState(true);

      const responseData = await requestJson(BOOKING_API_URL, values);
      const notificationMessage =
        responseData?.notification?.status === "failed"
          ? " Booking saved, but the WhatsApp API could not deliver the alert automatically."
          : "";

      setFormStatus(`Booking Successful \u2705${notificationMessage}`, "success");
      bookingForm.reset();
      setMinimumDate();
      setDefaultTime();
      clearFieldErrors();
    } catch (error) {
      const fallbackUrl = buildWhatsAppUrl(values);

      setFormStatus(
        `${error.message || "Booking failed."} Opening WhatsApp fallback...`,
        "error"
      );
      showFallbackLink(fallbackUrl);
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    } finally {
      setSubmittingState(false);
    }
  });

  setMinimumDate();
  setDefaultTime();
});
