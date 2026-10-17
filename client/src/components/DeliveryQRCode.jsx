import { QRCodeSVG } from "qrcode.react";

export const DeliveryQRCode = ({ token, title, description }) => {
  if (!token) {
    return (
      <div className="rounded-lg border border-secondary/20 p-4">
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-inactive">
          QR code is not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-secondary/20 bg-brown p-5 text-center">
      <h3 className="font-app-heading text-lg font-bold">{title}</h3>

      <div className="rounded-lg bg-white p-3">
        <QRCodeSVG value={token} size={180} level="M" />
      </div>

      <p className="max-w-xs text-sm text-inactive">{description}</p>
    </div>
  );
};
