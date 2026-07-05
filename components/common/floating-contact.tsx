'use client';

import React from 'react';
import Image from 'next/image';

export function FloatingContact() {
  // Thay link Zalo và Shopee của bạn vào đây
  const zaloUrl = "https://zalo.me/0xxxxxxxxx"; 
  const shopeeUrl = "https://shopee.vn/your-shop-username";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-4 py-2 md:py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        
        {/* Widget Nút Zalo */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#0068ff] text-white font-medium rounded-xl shadow-sm hover:bg-[#0056d6] active:scale-95 transition-all duration-200"
        >
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
            alt="Zalo" 
            width={24} 
            height={24}
            className="object-contain bg-white rounded-full p-0.5"
          />
          <span className="text-sm">Chat Zalo</span>
        </a>

        {/* Widget Nút Shopee */}
        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#ee4d2d] text-white font-medium rounded-xl shadow-sm hover:bg-[#d73f21] active:scale-95 transition-all duration-200"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.1 8.5h-2.1v-.6c0-2.3-2-4.1-4.4-4.1S8.2 5.6 8.2 7.9v.6H6.1c-.8 0-1.5.7-1.5 1.5l1 10c.1.7.7 1.2 1.4 1.2h12.1c.7 0 1.3-.5 1.4-1.2l1-10c0-.8-.7-1.5-1.5-1.5zm-9.3-.6c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v.6H9.8v-.6zm4.8 4.7c0 .4-.3.8-.8.8s-.8-.3-.8-.8V11c0-.4.3-.8.8-.8s.8.3.8.8v2.1zm-4.3 0c0 .4-.3.8-.8.8s-.8-.3-.8-.8V11c0-.4.3-.8.8-.8s.8.3.8.8v2.1z"/>
          </svg>
          <span className="text-sm">Mua tại Shopee</span>
        </a>

      </div>
    </div>
  );
}
