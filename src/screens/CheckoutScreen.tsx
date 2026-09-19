import React, { useState } from 'react';
import { ScreenId } from '../types';
import { APP_ASSETS } from '../data/mockData';

interface CheckoutScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigate, onBack }) => {
  const [adultCount, setAdultCount] = useState<number>(2);
  const [studentCount, setStudentCount] = useState<number>(1);
  const [includeAudioGuide, setIncludeAudioGuide] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'credit_card' | 'pix_mbway'>(
    'apple_pay'
  );
  const [couponCode, setCouponCode] = useState<string>('BEMVINDO');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Pricing calculation
  const adultPrice = 12;
  const studentPrice = 6;
  const audioGuidePrice = 3.5;
  const discount = couponCode === 'BEMVINDO' ? 4.5 : 0;

  const subtotal =
    adultCount * adultPrice +
    studentCount * studentPrice +
    (includeAudioGuide ? audioGuidePrice : 0);
  const total = Math.max(0, subtotal - discount);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-40 pt-safe bg-[#f7f9fb]/90 backdrop-blur-xl border-b border-[#eceef0]">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#eceef0] flex items-center justify-center text-[#00263f] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ae3115]">
              Ambiente Seguro
            </span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
              <h1 className="text-[15px] font-bold text-[#00263f]">Checkout SmartTrip</h1>
            </div>
          </div>
          <button
            onClick={() => alert('Suporte SmartTrip 24/7 disponível via chat ou WhatsApp.')}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#eceef0] flex items-center justify-center text-[#42474e]"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-4 mt-3">
        {/* Stepper info */}
        <div className="flex items-center justify-between text-[11px] font-bold text-[#42474e]">
          <span>Etapa 3 de 3: Resumo & Pagamento</span>
          <span className="text-emerald-700 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Criptografia 256-bit
          </span>
        </div>

        {/* Selected Attraction Summary Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex gap-3">
            <img
              src={APP_ASSETS.mosteiroCheckoutThumb}
              alt="Mosteiro dos Jerónimos"
              className="w-20 h-20 rounded-2xl object-cover border border-[#eceef0] shrink-0"
            />
            <div className="flex flex-col min-w-0 justify-between py-0.5">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] w-fit mb-1">
                  <span className="material-symbols-outlined text-[12px]">bolt</span>
                  FAST TRACK • SEM FILAS
                </span>
                <h2 className="text-[16px] font-bold text-[#00263f] truncate">
                  Mosteiro dos Jerónimos
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#42474e]">
                <span className="material-symbols-outlined text-[15px] text-[#ae3115]">
                  calendar_today
                </span>
                <span>14 Out, 2025 às 10:45</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f4f6] rounded-2xl p-2.5 flex items-center justify-between text-[11px]">
            <span className="text-[#42474e] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#00263f]">
                smartphone
              </span>
              Voucher Digital (Apple & Google Wallet)
            </span>
            <span className="text-emerald-700 font-bold">Confirmação Imediata</span>
          </div>
        </div>

        {/* Ticket Quantity Selectors */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <h3 className="text-[15px] font-bold text-[#00263f]">Selecione os Ingressos</h3>

          {/* Adult */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f4f6]">
            <div>
              <div className="text-[13px] font-bold text-[#191c1e]">Adulto Geral</div>
              <div className="text-[11px] text-[#72777e]">Acesso total aos claustros • €12</div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                className="w-8 h-8 rounded-full bg-white border border-[#eceef0] text-[#00263f] font-bold flex items-center justify-center active:scale-90"
              >
                -
              </button>
              <span className="text-[14px] font-bold w-4 text-center">{adultCount}</span>
              <button
                onClick={() => setAdultCount(adultCount + 1)}
                className="w-8 h-8 rounded-full bg-[#00263f] text-white font-bold flex items-center justify-center active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          {/* Student */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f4f6]">
            <div>
              <div className="text-[13px] font-bold text-[#191c1e]">Estudante / Jovem</div>
              <div className="text-[11px] text-[#72777e]">Com documento comprovativo • €6</div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentCount(Math.max(0, studentCount - 1))}
                className="w-8 h-8 rounded-full bg-white border border-[#eceef0] text-[#00263f] font-bold flex items-center justify-center active:scale-90"
              >
                -
              </button>
              <span className="text-[14px] font-bold w-4 text-center">{studentCount}</span>
              <button
                onClick={() => setStudentCount(studentCount + 1)}
                className="w-8 h-8 rounded-full bg-[#00263f] text-white font-bold flex items-center justify-center active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          {/* Audio Guide Add-on */}
          <div
            onClick={() => setIncludeAudioGuide(!includeAudioGuide)}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#cee5ff]/40 border border-[#cee5ff] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00263f] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[17px]">headphones</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#001d32]">
                    Audioguia SmartTrip com IA
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#00263f] text-white">
                    +€3,50
                  </span>
                </div>
                <span className="text-[11px] text-[#00263f]">
                  Narrador em português com histórias dos navegadores
                </span>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                includeAudioGuide ? 'bg-[#00263f] text-white' : 'border border-[#72777e]'
              }`}
            >
              {includeAudioGuide && (
                <span className="material-symbols-outlined text-[15px]">check</span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <h3 className="text-[15px] font-bold text-[#00263f]">Método de Pagamento</h3>

          <div className="flex flex-col gap-2">
            {/* Apple Pay / Google Pay */}
            <div
              onClick={() => setPaymentMethod('apple_pay')}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'apple_pay'
                  ? 'border-[#ae3115] bg-[#ffdad2]/20'
                  : 'border-[#eceef0] bg-[#f2f4f6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-[#00263f]">
                  contactless
                </span>
                <div>
                  <div className="text-[13px] font-bold text-[#191c1e]">
                    Apple Pay / Google Pay
                  </div>
                  <div className="text-[11px] text-[#72777e]">
                    Pagamento rápido com biometria
                  </div>
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'apple_pay'
                    ? 'border-[#ae3115] bg-[#ae3115]'
                    : 'border-[#c2c7ce]'
                }`}
              >
                {paymentMethod === 'apple_pay' && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </span>
            </div>

            {/* Credit Card */}
            <div
              onClick={() => setPaymentMethod('credit_card')}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'credit_card'
                  ? 'border-[#ae3115] bg-[#ffdad2]/20'
                  : 'border-[#eceef0] bg-[#f2f4f6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-[#00263f]">
                  credit_card
                </span>
                <div>
                  <div className="text-[13px] font-bold text-[#191c1e]">
                    Cartão de Crédito
                  </div>
                  <div className="text-[11px] text-[#72777e]">
                    Mastercard final •••• 4829
                  </div>
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#ae3115] bg-[#ae3115]'
                    : 'border-[#c2c7ce]'
                }`}
              >
                {paymentMethod === 'credit_card' && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </span>
            </div>

            {/* MB WAY / Pix */}
            <div
              onClick={() => setPaymentMethod('pix_mbway')}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'pix_mbway'
                  ? 'border-[#ae3115] bg-[#ffdad2]/20'
                  : 'border-[#eceef0] bg-[#f2f4f6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-[#00263f]">
                  qr_code_scanner
                </span>
                <div>
                  <div className="text-[13px] font-bold text-[#191c1e]">
                    MB WAY ou Pix Internacional
                  </div>
                  <div className="text-[11px] text-[#72777e]">
                    Sem taxa de IOF com conversão comercial
                  </div>
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'pix_mbway'
                    ? 'border-[#ae3115] bg-[#ae3115]'
                    : 'border-[#c2c7ce]'
                }`}
              >
                {paymentMethod === 'pix_mbway' && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown & Coupon */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] text-[#42474e]">
            <span>{adultCount}x Adulto Geral</span>
            <span>€ {(adultCount * adultPrice).toFixed(2)}</span>
          </div>

          {studentCount > 0 && (
            <div className="flex items-center justify-between text-[13px] text-[#42474e]">
              <span>{studentCount}x Estudante</span>
              <span>€ {(studentCount * studentPrice).toFixed(2)}</span>
            </div>
          )}

          {includeAudioGuide && (
            <div className="flex items-center justify-between text-[13px] text-[#42474e]">
              <span>Audioguia IA SmartTrip</span>
              <span>€ {audioGuidePrice.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[13px] text-emerald-700 font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_offer</span>
              Cupom Aplicado ({couponCode})
            </span>
            <span>-€ {discount.toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-[#f2f4f6] flex items-baseline justify-between">
            <div>
              <span className="text-[16px] font-extrabold text-[#00263f]">Total a Pagar</span>
              <p className="text-[11px] text-[#72777e]">Impostos e taxas incluídos</p>
            </div>
            <div className="text-right">
              <span className="text-[22px] font-black text-[#ae3115]">
                € {total.toFixed(2)}
              </span>
              <div className="text-[10px] text-emerald-700 font-bold">Economizou € 4,50</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Checkout CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#eceef0] p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-full bg-[#ae3115] text-white text-[15px] font-bold shadow-lg shadow-[#ae3115]/30 hover:bg-[#fd6a49] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  refresh
                </span>
                <span>Processando Pagamento Seguro...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Confirmar e Pagar € {total.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col items-center text-center gap-4 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Ingresso Emitido com Sucesso
              </span>
              <h3 className="text-[20px] font-bold text-[#00263f] mt-0.5">
                Mosteiro dos Jerónimos
              </h3>
              <p className="text-[13px] text-[#42474e] mt-1">
                Data: 14 de Outubro, 2025 às 10:45 • Fast Track
              </p>
            </div>

            {/* QR Code Placeholder */}
            <div className="p-4 rounded-2xl bg-[#f2f4f6] border border-[#eceef0] flex flex-col items-center gap-2">
              <div className="w-36 h-36 bg-white rounded-xl p-2 shadow-xs flex items-center justify-center">
                <span className="material-symbols-outlined text-[100px] text-[#00263f]">
                  qr_code_2
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#72777e]">
                SMART-LIS-984210
              </span>
            </div>

            <div className="flex flex-col w-full gap-2 pt-1">
              <button
                onClick={() => {
                  alert('Voucher salvo na carteira digital do dispositivo!');
                }}
                className="w-full py-3 rounded-full bg-[#00263f] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                <span>Adicionar à Apple / Google Wallet</span>
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('roteiro');
                }}
                className="w-full py-2.5 text-[13px] font-bold text-[#ae3115] hover:underline"
              >
                Voltar ao Roteiro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
