import LoginForm from './components/loginForm';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-center bg-brand-cream">
      <h1 className="text-4xl font-bold text-brand-gold">
        Cloud Native Frontend
      </h1>
      <LoginForm/>
    </div>
  )
}