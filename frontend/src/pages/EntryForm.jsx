import React from "react";
import { useState } from "react";
import { CheckCircle2, ChevronRight, Ruler, Shirt, Sparkles } from "lucide-react";
import { createEntry } from "../lib/api.js";

const initialForm = {
  fullName: "",
  jerseyName: "",
  jerseyNumber: "",
  jerseySize: "",
  sleeve: "HALF",
  pantWaist: "",
  pantLength: "",
};

export default function EntryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setSubmitting(true);
    try {
      const result = await createEntry({
        ...form,
        jerseyNumber: Number(form.jerseyNumber),
      });
      setStatus({ type: "success", message: result.message });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">GET YOUR KIT READY</div>
          <h1>Team kit <span>registration.</span></h1>
          <p className="page-description">Add your details and get your jersey and track pant sizes recorded.</p>
        </div>
        <div className="heading-art" aria-hidden="true">
          <div className="art-circle"><Shirt size={58} strokeWidth={1.15} /></div>
          <span className="art-spark"><Sparkles size={19} /></span>
        </div>
      </section>

      <form className="form-card" onSubmit={submit}>
        <div className="form-section">
          <div className="section-heading">
            <div className="section-icon jersey-icon"><Shirt size={20} /></div>
            <div>
              <h2>Jersey information</h2>
              <p>How your jersey should look and fit.</p>
            </div>
            <span className="section-number">01</span>
          </div>

          <div className="field-grid">
            <label className="field field-full">
              <span>Full Name<span className="required">*</span></span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={update}
                placeholder="e.g. Ben Stokes"
                maxLength={60}
                autoComplete="name"
                required
              />
              <small> Enter your full name.</small>
            </label>

            <label className="field field-full">
              <span>Name to print on the back <span className="required">*</span></span>
              <input
                name="jerseyName"
                value={form.jerseyName}
                onChange={update}
                placeholder="e.g. Stokes"
                maxLength={60}
                autoComplete="name"
                required
              />
              <small>This name must be unique for each entry.</small>
            </label>

            <label className="field">
              <span>Jersey number <span className="required">*</span></span>
              <input
                type="number"
                name="jerseyNumber"
                value={form.jerseyNumber}
                onChange={update}
                placeholder="e.g. 07"
                min="0"
                max="999"
                step="1"
                required
              />
            </label>

            <fieldset className="field fieldset-field">
              <legend>Jersey size <span className="required">*</span></legend>
              <div className="size-options">
                {[
                  ["S", "36"], ["M", "38"], ["L", "40"], ["XL", "42"], ["XXL", "44"],
                ].map(([size, chest]) => (
                  <label className={`size-option ${form.jerseySize === size ? "selected" : ""}`} key={size}>
                    <input
                      type="radio"
                      name="jerseySize"
                      value={size}
                      checked={form.jerseySize === size}
                      onChange={update}
                      required
                    />
                    <strong>{size}</strong>
                    <small>{chest}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field fieldset-field field-full">
              <legend>Sleeve style <span className="required">*</span></legend>
              <div className="choice-row">
                {[
                  ["HALF", "Half sleeve", "Classic short sleeve"],
                  ["FULL", "Full sleeve", "Extra arm coverage"],
                ].map(([value, title, hint]) => (
                  <label className={`choice-card ${form.sleeve === value ? "selected" : ""}`} key={value}>
                    <input type="radio" name="sleeve" value={value} checked={form.sleeve === value} onChange={update} />
                    <span className={`sleeve-symbol ${value === "FULL" ? "full" : ""}`} />
                    <span className="choice-copy"><strong>{title}</strong><small>{hint}</small></span>
                    <span className="choice-check"><CheckCircle2 size={18} /></span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="section-divider" />

        <div className="form-section">
          <div className="section-heading">
            <div className="section-icon pant-icon"><Ruler size={20} /></div>
            <div>
              <h2>Track pant information</h2>
              <p>Enter your measurements as provided by your kit supplier.</p>
            </div>
            <span className="section-number">02</span>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Waist <span className="required">*</span></span>
              <input name="pantWaist" value={form.pantWaist} onChange={update} placeholder="e.g. 32 " maxLength={40} required />
              <small>Include the unit if needed.</small>
            </label>
            <label className="field">
              <span>Length <span className="required">*</span></span>
              <input name="pantLength" value={form.pantLength} onChange={update} placeholder="e.g. 40 " maxLength={40} required />
              <small>Include the unit if needed.</small>
            </label>
          </div>
        </div>

        {status.message && (
          <div className={`notice ${status.type}`} role="status">
            {status.type === "success" ? <CheckCircle2 size={19} /> : <span className="notice-mark">!</span>}
            {status.message}
          </div>
        )}

        <div className="form-actions">
          <p><span className="required">*</span> Required fields</p>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Saving entry..." : "Save my details"} <ChevronRight size={18} />
          </button>
        </div>
      </form>
      <p className="privacy-note">Your details are saved securely to the team registration database.</p>
    </>
  );
}
