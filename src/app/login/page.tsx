import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in – Alpahaar Foods" };

export default function LoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-brand">
        <div className="logo">Alpahaar Foods</div>
        <div className="subtitle">Maa Ke Haath Ka Swaad</div>
      </div>
      <LoginForm />
    </div>
  );
}
