"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setSending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Something went wrong. Please try again.",
        );
      }

      form.reset();
      setStatus({
        type: result.notificationWarning ? "warning" : "success",
        message:
          result.notificationWarning ||
          "Message sent! We'll be in touch shortly.",
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
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-[22px]"
    >
      <div className="flex flex-col gap-[17px]">
        <label className="text-text-dark flex flex-col gap-2 text-[0.88rem] font-semibold">
          <span>Your name</span>
          <input
            type="text"
            name="name"
            placeholder="e.g. Alex Morgan"
            autoComplete="name"
            required
            className="border-border bg-body text-text-dark placeholder:text-text-light focus:border-primary focus:ring-primary/15 min-h-[51px] w-full rounded-xl border px-[15px] py-3 text-[0.96rem] font-normal transition-[border-color,box-shadow,background] duration-200 placeholder:opacity-80 focus:ring-3 focus:outline-none"
          />
        </label>
        <label className="text-text-dark flex flex-col gap-2 text-[0.88rem] font-semibold">
          <span>Work email</span>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            className="border-border bg-body text-text-dark placeholder:text-text-light focus:border-primary focus:ring-primary/15 min-h-[51px] w-full rounded-xl border px-[15px] py-3 text-[0.96rem] font-normal transition-[border-color,box-shadow,background] duration-200 placeholder:opacity-80 focus:ring-3 focus:outline-none"
          />
        </label>
        <label className="text-text-dark flex flex-col gap-2 text-[0.88rem] font-semibold">
          <span>Phone number</span>
          <input
            type="tel"
            name="phone"
            placeholder="+91 00000 00000"
            autoComplete="tel"
            required
            className="border-border bg-body text-text-dark placeholder:text-text-light focus:border-primary focus:ring-primary/15 min-h-[51px] w-full rounded-xl border px-[15px] py-3 text-[0.96rem] font-normal transition-[border-color,box-shadow,background] duration-200 placeholder:opacity-80 focus:ring-3 focus:outline-none"
          />
        </label>
        <label className="text-text-dark flex flex-col gap-2 text-[0.88rem] font-semibold">
          <span>How can we help?</span>
          <textarea
            name="message"
            placeholder="Tell us a little about your goals or project..."
            rows={4}
            required
            className="border-border bg-body text-text-dark placeholder:text-text-light focus:border-primary focus:ring-primary/15 min-h-[130px] w-full resize-y rounded-xl border px-[15px] py-3 text-[0.96rem] leading-[1.6] font-normal transition-[border-color,box-shadow,background] duration-200 placeholder:opacity-80 focus:ring-3 focus:outline-none"
          />
        </label>
      </div>
      <div className="flex flex-col gap-3.5">
        {status.message && (
          <p
            role="status"
            className={`m-0 rounded-xl border px-[15px] py-[13px] text-[0.92rem] leading-6 ${
              status.type === "success"
                ? "border-green-500/35 bg-green-500/10 text-green-700 dark:text-green-300"
                : status.type === "warning"
                  ? "border-amber-500/35 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                  : "border-red-500/35 bg-red-500/10 text-red-700 dark:text-red-300"
            }`}
          >
            {status.message}
          </p>
        )}
        <button
          type="submit"
          id="contact-submit"
          className="from-primary to-primary-light focus-visible:outline-primary flex min-h-[54px] w-full items-center justify-center rounded-xl bg-gradient-to-r px-6 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={sending}
        >
          {sending ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
