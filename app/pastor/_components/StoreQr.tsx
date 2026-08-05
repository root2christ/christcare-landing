'use client';

import { QRCodeSVG } from 'qrcode.react';

/** 스토어 링크 QR — 화면·인쇄 어디서든 선명하도록 SVG 로 그린다 */
export default function StoreQr({ url, size = 148 }: { url: string; size?: number }) {
    return <QRCodeSVG value={url} size={size} level="M" bgColor="#ffffff" fgColor="#0f172a" />;
}
