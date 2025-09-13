import React from 'react';

export const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c2.436 0 4.752-.668 6.643-1.871C20.537 18.79 21.75 16.51 21.75 14.25c0-4.142-3.358-7.5-7.5-7.5S6.75 10.108 6.75 14.25c0 2.26 1.213 4.54 3.107 5.629A15.63 15.63 0 0012 21.75zM12 21.75v-8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12.75c0 .414.336.75.75.75h3c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3c-.414 0-.75.336-.75.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.18 0-9.422 4.033-9.72 9.165-.297 5.132 3.84 9.335 8.97 9.335h1.5c5.13 0 9.267-4.203 8.97-9.335C21.422 6.283 17.18 2.25 12 2.25z" />
    </svg>
);