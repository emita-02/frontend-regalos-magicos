function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 px-12 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">

        <div>
          <h3 className="font-bold text-[#bd3869] text-lg mb-3">Regalos Mágicos</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Desayunos sorpresa y regalos personalizados para cada ocasión especial.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-600 text-lg mb-3">Contáctanos</h3>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-400">+593 99 816 3828</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-600 text-lg mb-3">Síguenos</h3>
          <div className="flex gap-3 mt-1">
            {/*facebook*/}
            <a href="https://www.facebook.com/share/193CEjMSCd/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1877f2] flex items-center justify-center hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/*instagram*/}
            <a href="https://www.instagram.com/regalosmagicos_quito?igsh=MTBneDl4N2g1ZWQ0dw==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
              </svg>
            </a>
            {/*tiktok*/}
            <a href="https://www.tiktok.com/@regalosmagicos_quito?_r=1&_t=ZS-96hPV2GSWMW" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-600 text-lg mb-3">Horario</h3>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Lunes a Viernes: 8:00 - 18:00</span>
            <span className="text-sm text-gray-400">Sábados: 8:00 - 14:00</span>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto border-t border-pink-50 mt-8 pt-6">
        <p className="text-center text-xs text-gray-300">
          © 2026 Regalos Mágicos. Todos los derechos reservados.
        </p>
      </div>

    </footer>
  )
}

export default Footer
