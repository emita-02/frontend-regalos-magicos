import CardProducto from "../components/CardProducto";

import rfa from '../assets/desayuno_arco.jpeg'
import af from '../assets/arreglo_flores.jpeg'
import rp from '../assets/regalo_peluche.jpeg'
import dbh from '../assets/desayuno_bh.jpeg'
import dma from '../assets/desayunoM_arco.jpeg'
import dhbm from '../assets/desayunoHB_madera.jpeg'
import dmf from '../assets/desayunoM_flores.jpeg'
import fb from '../assets/fresas_burbuja.jpeg'
import cb from '../assets/regaloB_cerveza.jpeg'
import ctj from '../assets/cajaT_jarro.jpeg'

function Home() {

  return (
    <>
      {/* Chat IA 
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      <div className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-pink-100 w-64">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Asistente IA ✨
        </p>

        <p className="text-xs text-gray-400">
          Hola 👋 ¿Necesitas ayuda para elegir un regalo?
        </p>
      </div>

      <button className="w-16 h-16 rounded-full bg-[#bd3869] text-white shadow-xl flex items-center justify-center text-2xl hover:scale-105 transition duration-300">
        💬
      </button>

    </div>
    */}
    <main className="bg-[#fdf6f9] min-h-screen">

      <section className="bg-[#fce8f3] w-full mt-20">
        <div className='max-w-6xl mx-auto px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-10'>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-700 mt-6 mb-5 leading-tight">
              Sorprende a quien <br />
              <span className="text-[#bd3869]">más quieres</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
              Desayunos sorpresa, regalos personalizados y experiencias únicas para cada ocasión especial.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#bd3869] text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition duration-300">
                Ver catálogo
              </button>
              <button className="border border-[#00b1c1] text-[#00b1c1] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#f0fafb] transition duration-300">
                Personalizar regalo
              </button>
            </div>
            <span className="bg-white text-[#bd3869] text-sm font-semibold px-4 py-1 rounded-full tracking-wide shadow-sm mb-6 inline-flex items-center gap-1 mt-8">
              ✨ Envíos a domicilio
            </span>
          </div>
        

        {/*Imagenes */}
          <div className="flex-1 grid grid-cols-2 gap-6 w-full">
            <img src={rfa} alt="Regalo Futbolero Arco" className="w-full h-70 object-cover rounded-3xl shadow-md" />
            <img src={af} alt="Arreglo Floral" className="w-full h-70 object-cover rounded-3xl shadow-md" />
            <img src={rp} alt="Regalo Personalizado" className="w-full h-70 object-cover rounded-3xl shadow-md" />
            <img src={dbh} alt="Desayuno Hombre" className="w-full h-70 object-cover rounded-3xl shadow-md" />
          </div>
        </div>
      </section>

      {/*desayunos favoritos */}
      <section className="px-12 py-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-600 mb-8">
          Desayunos <span className="text-[#00b1c1]">favoritos</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id:1, img: dma, nombre: 'Desayuno Mujer Arco', desc: 'Plato fuerte + mini pastel + frutas + jugo o caffe lato + frutos secos + snack dulce + yogurt con granola + tarjeta o foto', precio: '$20.00' },
            { id:2, img: dhbm, nombre: 'Desayuno Hombre Burbuja', desc: 'Plato fuerte + mini pastel + frutas + jugo + frutos secos + snack dulce + yogurt + mini vino + copa + tarjeta o foto', precio: '$35.00' },
            { id:3, img: dmf, nombre: 'Desayuno Mujer Flores', desc: 'Plato fuerte + frutas + jugo + frutos secos + snack dulce + yogurt con granola + tarjeta o foto + flores', precio: '$30.00' },
          ].map((item) => (
            <CardProducto
              key={item.id}
              producto={item}
            />
          ))}
        </div>
      </section>

      {/*regalos favoritos */}
      <section className="px-12 py-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-600 mb-8">
          Regalos <span className="text-[#00b1c1]">favoritos</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id:4, img: fb, nombre: 'Arreglo de Fresas', desc: 'Fresas con chocolate + tarjeta o foto', precio: '$20.00' },
            { id:5, img: cb, nombre: 'Arreglo de Cerveza', desc: 'Cerveza corona + copa + 2 golosinas + mini vino + frutos secos + tarjeta o foto', precio: '$35.00' },
            { id:6, img: ctj, nombre: 'Caja con tapa', desc: 'Jarro CERVECERO + 3 golosinas + cerveza corona + frutos secos + tarjeta o foto', precio: '$30.00' },
          ].map((item) => (
            <CardProducto
              key={item.id}
              producto={item}
            />
          ))}
        </div>
      </section>

      {/* Estadísticas */}
      <section className="px-12 py-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '1000+', label: 'Clientes felices' },
            { num: '98%', label: 'Satisfacción' },
            { num: '+3 años', label: 'De experiencia' },
          ].map((s, i) => (
            <div key={i} className="bg-[#fce8f3] rounded-2xl p-6 text-center">
              <p className="text-2xl font-bold text-[#bd3869]">{s.num}</p>
              <p className="text-base text-[#bd3869] opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
    </>
  )
}

export default Home
