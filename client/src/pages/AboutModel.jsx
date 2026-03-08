import React from 'react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;



  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          📖 Գրքապտույտի Մասին
        </h2>

     <div className="text-gray-700  max-h-64 overflow-y-auto pr-2 ">
    <p className="mb-6 text-base leading-relaxed font-medium ">
    Բարի գալուստ <strong>Գրքապտույտ</strong>՝ ժամանակակից թվային հարթակ, որը ստեղծվել է
    գրքասերների համար։ Այստեղ գրքերը պարզապես տեղեկատվության աղբյուր չեն, այլ
    բացահայտումների և նոր գաղափարների աշխարհ։ Մեր հարթակում կարող եք հեշտությամբ
    որոնել ձեզ հետաքրքրող գրքերը, կարդալ դրանց էլեկտրոնային տարբերակները,
    լսել աուդիոգրքեր և կազմակերպել ձեր ընթերցանության գործընթացը մեկ հարմար
    միջավայրում։
  </p>

  <p className="text-base leading-relaxed">
    <strong>Գրքապտույտը</strong> նպատակ ունի ընթերցանությունը դարձնել ավելի
    հասանելի, հարմար և ժամանակակից՝ միավորելով տեխնոլոգիաները և գրականությունը։
    Անկախ նրանից՝ դուք փնտրում եք նոր գրքեր, ցանկանում եք վերադառնալ ձեր
    սիրելի դասականներին, թե պարզապես ուզում եք բացահայտել նոր ժանրեր,
    մեր հարթակը կօգնի ձեզ այդ ճանապարհին։
  </p>

  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
      Ինչու՞ ընտրել մեզ 🤔
    </h3>

    <ul className="space-y-2">
      {[
    { title: "Արագ և հարմար որոնում", icon: "🔍" },
      { title: "Աուդիոգրքերի հասանելիություն", icon: "🎧" },
      { title: "Գրքերի էլեկտրոնային տարբերակներ", icon: "📄" },
      { title: "AI օգնական՝ գրքերի ընտրության համար", icon: "🤖" },
      { title: "Ժանրերի լայն ընտրանի", icon: "📚" }
      ].map((item, index) => (
        <li key={index} className="flex items-center gap-2 text-sm">
          <span className="text-blue-500 text-xs">●</span>
          <span className="font-medium text-gray-800">{item.title}</span>
          <span className="ml-auto opacity-70">{item.icon}</span>
        </li>
      ))}
    </ul>
  </div>

  <p className="mt-6 text-sm font-medium text-blue-600 italic">
    «Գրքերը պտտվում են, գիտելիքը՝ տարածվում»
  </p>
</div>

        <button 
          onClick={onClose}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg"
        >
          Լավ
        </button>
      </div>
    </div>
  );
}