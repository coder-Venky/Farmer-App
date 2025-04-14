import React, { useState } from 'react';
import { X, QrCode } from 'lucide-react';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onComplete: () => void;
}

export function PaymentModal({ total, onClose, onComplete }: PaymentModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  
  // In a real application, this would be generated server-side
  const upiId = "farmer@upi";
  const upiLink = `upi://pay?pa=${upiId}&pn=FarmersMarket&am=${total}&cu=INR`;
  
  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleVerifyPayment = async () => {
    setLoading(true);
    // In a real application, this would verify the transaction with your backend
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">UPI Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-green-600">Amount: ₹{total}</p>
            <p className="text-gray-600">UPI ID: {upiId}</p>
          </div>

          <div className="flex justify-center">
            <img 
              src={qrCodeUrl} 
              alt="Payment QR Code" 
              className="w-48 h-48"
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-center text-gray-600">
              Scan the QR code with any UPI app to pay
            </p>
            
            <div className="flex gap-4 justify-center">
              {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                <a
                  key={app}
                  href={upiLink}
                  className="flex flex-col items-center"
                >
                  <img 
                    src={`https://logo.clearbit.com/${app.toLowerCase().replace(' ', '')}.com`}
                    alt={app}
                    className="w-12 h-12 rounded-lg"
                  />
                  <span className="text-sm mt-1">{app}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <input
                type="text"
                placeholder="Enter UPI Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                onClick={handleVerifyPayment}
                disabled={!transactionId || loading}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}