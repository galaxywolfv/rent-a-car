import React from 'react';
import Link from 'next/link';

interface ActionButtonProps<T> {
    onClick?: (item: T | undefined) => void;
    text?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    href?: string;
    item?: T;
    customClasses?: string; // Additional custom classes
}

const ActionButton = <T,>({
    onClick,
    href,
    icon,
    item,
    text,
    iconPosition = 'right',
    customClasses = '',
}: ActionButtonProps<T>) => {
    const buttonClass = `flex px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 text-brand hover:opacity-75 border-2 space-x-1 ${customClasses}`;

    const content = (
        <button
            className={buttonClass}
            onClick={onClick ? () => onClick(item) : undefined}
        >
            {iconPosition === 'left' && icon && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            )}
            {text && <span>{text}</span>}
            {iconPosition === 'right' && icon && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            )}
        </button>
    );

    return href ? (
        <Link href={href}>
            {content}
        </Link>
    ) : (
        content
    );
};

export default ActionButton;
