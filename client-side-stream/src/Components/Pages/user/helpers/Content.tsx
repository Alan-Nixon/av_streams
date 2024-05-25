import React from 'react';
import { ContentProps } from '../../../../Functions/interfaces';

export default function Content({ children }:ContentProps) {
    return (
        <div className="ml-64 pt-16">
            {children}
        </div>
    );
}
