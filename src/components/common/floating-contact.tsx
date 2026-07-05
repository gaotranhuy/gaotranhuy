'use client';

import React from 'react';
import Image from 'next/image';

export function FloatingContact() {
  // Thay link Zalo (SĐT hoặc OA) và link Shop Shopee của bạn vào đây
  const zaloUrl = "https://zalo.me/84931555551"; 
  const shopeeUrl = "https://shopee.vn/gaotranhuy";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-bounce-slow">
      {/* Nút Zalo */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0068ff] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        title="Chat qua Zalo"
      >
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
          alt="Zalo" 
          width={35} 
          height={35}
          className="object-contain"
        />
      </a>

      {/* Nút Shopee */}
      <a
        href={shopeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#ee4d2d] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        title="Ghé thăm Shopee"
      >
        {/* Bạn có thể dùng SVG custom hoặc hình ảnh logo Shopee */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-8 h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.1 8.5h-2.1v-.6c0-2.3-2-4.1-4.4-4.1S8.2 5.6 8.2 7.9v.6H6.1c-.8 0-1.5.7-1.5 1.5l1 10c.1.7.7 1.2 1.4 1.2h12.1c.7 0 1.3-.5 1.4-1.2l1-10c0-.8-.7-1.5-1.5-1.5zm-9.3-.6c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v.6H9.8v-.6zm4.8 4.7c0 .4-.3.8-.8.8s-.8-.3-.8-.8V11c0-.4.3-.8.8-.8s.8.3.8.8v2.1zm-4.3 0c0 .4-.3.8-.8.8s-.8-.3-.8-.8V11c0-.4.3-.8.8-.8s.8.3.8.8v2.1z"/>
        </svg>
      </a>
    </div>
  );
}
