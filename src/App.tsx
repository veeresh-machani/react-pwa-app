import React, { useState } from "react";
import { Send, CheckCircle2, Clock } from "lucide-react";

import { LatestVersion } from "./components/LatestVersion";

export function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert("Please fill out your name and email.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="app-shell">
      {/* App Header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-title">Application Portal</span>
          <span className="brand-tag">v2.1</span>
        </div>
      </header>

      {/* LatestVersion Snackbar Alert */}
      <LatestVersion />

      {/* Main Form Content */}
      <main className="main-content">
        <div className="form-card">
          {submitted ? (
            <div className="success-card">
              <div className="success-icon">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="form-title">Thank You!</h2>
              <p className="form-subtitle">
                Your message from <strong>{formData.fullName}</strong> has been
                received successfully.
              </p>
              <button
                onClick={handleReset}
                className="btn btn-primary btn-block"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="form-header">
                <h1 className="form-title">Get in Touch</h1>
                <p className="form-subtitle">
                  Have questions or feedback? Fill in the simple form below.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-select"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feedback">Product Feedback</option>
                    <option value="Support">Technical Support</option>
                    <option value="Billing">Billing Question</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-block"
                >
                  {isSubmitting ? (
                    <>
                      <Clock size={16} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
