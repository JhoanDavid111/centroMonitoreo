import logo from '../assets/logosEnergiaUpme.svg'

export default function TwoFactorForm({ onVerify, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#262626] font-sans">
      <div className="bg-[#1d1d1d] p-8 rounded shadow-md w-full max-w-sm text-white">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Energía UPME" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Verificación 2FA</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            const code = e.target.code.value
            onVerify(code)
          }}
          className="space-y-4"
        >
          <input
            name="code"
            type="text"
            placeholder="Código de verificación"
            required
            className="w-full px-4 py-2 rounded bg-[#333] text-white placeholder-gray-400"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#FFC800] hover:bg-[#e6b000] text-black font-semibold py-2 rounded"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  )
}