"use client";

import { useState, type FormEvent } from "react";

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  sending: boolean;
  sent: boolean;
  error: string | null;
}

export function useContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    sending: false,
    sent: false,
    error: null,
  });

  const setField = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value, error: null }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setForm((prev) => ({ ...prev, sending: true, error: null }));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Mesaj gonderilemedi.");
      }

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        sending: false,
        sent: true,
        error: null,
      });
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        sending: false,
        error: err instanceof Error ? err.message : "Beklenmeyen bir hata olustu.",
      }));
    }
  };

  return { form, setField, handleSubmit };
}
