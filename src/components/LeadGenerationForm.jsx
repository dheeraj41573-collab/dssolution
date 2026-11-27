"use client";

import { useState } from "react";

export default function LeadGenerationForm({ image }) {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Something went wrong. Please try again.",
        );
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Free Checklist requested successfully!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Network error — please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-light rounded-4xl p-10 xl:px-7.5 xl:py-10">
      <img
        className="mx-auto mb-12 w-full max-w-76.75"
        src={image}
        alt="Free checklist"
      />
      <form id="lead-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name"
            className="form-input mb-5 w-full"
            required
            disabled={sending}
          />
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email Address"
            className="form-input mb-5 w-full"
            required
            disabled={sending}
          />
          <button
            type="submit"
            id="lead-submit"
            className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={sending}
          >
            {sending ? "Submitting…" : "Get Free Checklist"}
          </button>
          {status.message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${status.type === "success" ? "text-green-600" : "text-red-500"}`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
