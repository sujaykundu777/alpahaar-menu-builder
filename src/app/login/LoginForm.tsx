"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="card">
      <h1 className="card-title">
        Namaste! 🙏
        <div className="card-subtitle">अंदर आने के लिए साइन इन करें</div>
      </h1>

      <div className="input-group">
        <label className="input-label" htmlFor="email">Email • ईमेल</label>
        <div className="input-wrapper">
          <input id="email" name="email" type="email" className="input-field" autoComplete="email" required />
        </div>
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="password">Password • पासवर्ड</label>
        <div className="input-wrapper">
          <input id="password" name="password" type="password" className="input-field" autoComplete="current-password" required />
        </div>
      </div>

      {state?.error && <div className="notice error" role="alert">{state.error}</div>}

      <button type="submit" className="save-button" disabled={pending} style={{ marginTop: "1rem" }}>
        {pending ? <span className="spinner" /> : <span>🔓</span>}
        <span>{pending ? "Signing in…" : "Sign in (साइन इन)"}</span>
      </button>
    </form>
  );
}
