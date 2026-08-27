import React, { useState } from 'react';
import type { ARPayment } from '../../types/ar';
import { formatCurrencyINR } from '../../data/arMockData';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Send,
  Building2,
  Calendar,
  CreditCard,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface ARPaymentHeaderProps {
  payment: ARPayment;
  onPostToERP: (paymentId: string) => void;
  isPosting: boolean;
}

export const ARPaymentHeader: React.FC<ARPaymentHeaderProps> = ({
  payment,
  onPostToERP,
  isPosting,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(payment.paymentRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (payment.status) {
      case 'Fully Reconciled':
        return (
          <span className="ar-status-badge ar-status-reconciled ar-status-badge--lg">
            <CheckCircle2 size={14} />
            Fully Reconciled
          </span>
        );
      case 'Partially Matched':
        return (
          <span className="ar-status-badge ar-status-partial ar-status-badge--lg">
            <AlertTriangle size={14} />
            Partially Matched
          </span>
        );
      case 'Needs Review':
        return (
          <span className="ar-status-badge ar-status-review ar-status-badge--lg">
            <Clock size={14} />
            Needs Review
          </span>
        );
      case 'Posted':
        return (
          <span className="ar-status-badge ar-status-posted ar-status-badge--lg">
            <FileCheck size={14} />
            Posted
          </span>
        );
    }
  };

  const getERPStatusBadge = () => {
    switch (payment.erpStatus) {
      case 'Posted':
        return (
          <span className="ar-erp-badge ar-erp-badge--posted">
            <CheckCircle2 size={13} />
            ERP: Posted
          </span>
        );
      case 'Ready to Post':
        return (
          <span className="ar-erp-badge ar-erp-badge--ready">
            <Sparkles size={13} />
            ERP: Ready to Post
          </span>
        );
      case 'Pending Match':
        return (
          <span className="ar-erp-badge ar-erp-badge--pending">
            <Clock size={13} />
            ERP: Pending Match
          </span>
        );
      case 'On Hold':
        return (
          <span className="ar-erp-badge ar-erp-badge--hold">
            <AlertTriangle size={13} />
            ERP: On Hold
          </span>
        );
    }
  };

  return (
    <div className="ar-payment-header-card">
      <div className="ar-payment-header-card__top">
        {/* Sender Info & Amount */}
        <div className="ar-payment-header-card__sender-block">
          <div
            className="ar-payment-header-card__avatar"
            style={{ backgroundColor: payment.senderColor || '#4F46E5' }}
          >
            {payment.senderLogoInitial || payment.sender.slice(0, 2).toUpperCase()}
          </div>
          <div className="ar-payment-header-card__sender-details">
            <div className="ar-payment-header-card__sender-sub">
              <span>Payment Received</span>
              {payment.senderAccount && (
                <span className="ar-payment-header-card__dot-sep">·</span>
              )}
              {payment.senderAccount && <span>{payment.senderAccount}</span>}
            </div>
            <h2 className="ar-payment-header-card__sender-title">{payment.sender}</h2>
            <div className="ar-payment-header-card__amount-row">
              <span className="ar-payment-header-card__amount">
                {formatCurrencyINR(payment.paymentAmount)}
              </span>
              <span className="ar-payment-header-card__channel-pill">
                <CreditCard size={13} />
                {payment.paymentChannel}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button & Status Group */}
        <div className="ar-payment-header-card__actions-group">
          {payment.erpStatus === 'Ready to Post' && (
            <button
              onClick={() => onPostToERP(payment.id)}
              disabled={isPosting}
              className="ar-btn ar-btn--primary ar-btn--post"
              title="Post reconciled payment and invoice clearing to SAP ERP"
            >
              <Send size={15} className={isPosting ? 'ar-spin' : ''} />
              {isPosting ? 'Posting to SAP...' : 'Post to ERP'}
            </button>
          )}

          {payment.erpStatus === 'Posted' && (
            <div className="ar-posted-state-box">
              <div className="ar-posted-state-box__icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="ar-posted-state-box__info">
                <span className="ar-posted-state-box__title">Posted to SAP</span>
                <span className="ar-posted-state-box__sub">
                  Doc #{payment.sapDoc} · {payment.postedAt || 'Clearing Complete'}
                </span>
              </div>
            </div>
          )}

          {payment.erpStatus === 'Pending Match' && (
            <div className="ar-pending-notice">
              <span>Resolve balance before posting</span>
            </div>
          )}

          {payment.erpStatus === 'On Hold' && (
            <div className="ar-pending-notice ar-pending-notice--review">
              <span>Review suggested match</span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Row */}
      <div className="ar-payment-header-card__meta-bar">
        <div className="ar-payment-header-card__meta-items">
          <div className="ar-payment-meta-item">
            <Calendar size={14} className="ar-payment-meta-item__icon" />
            <span className="ar-payment-meta-item__label">Received:</span>
            <span className="ar-payment-meta-item__val">
              {payment.receivedDate} · {payment.receivedTime}
            </span>
          </div>

          <div className="ar-payment-meta-item">
            <span className="ar-payment-meta-item__label">Reference:</span>
            <code className="ar-payment-meta-item__code">{payment.paymentRef}</code>
            <button
              onClick={handleCopyRef}
              className="ar-payment-meta-item__copy-btn"
              title="Copy Reference"
            >
              {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
            </button>
          </div>

          <div className="ar-payment-meta-item">
            <Building2 size={14} className="ar-payment-meta-item__icon" />
            <span className="ar-payment-meta-item__label">SAP Doc:</span>
            <span
              className={`ar-payment-meta-item__val ${
                payment.sapDoc !== '—' ? 'ar-payment-meta-item__val--sap' : 'ar-payment-meta-item__val--empty'
              }`}
            >
              {payment.sapDoc}
            </span>
          </div>
        </div>

        <div className="ar-payment-header-card__badges-group">
          {getStatusBadge()}
          {getERPStatusBadge()}
        </div>
      </div>
    </div>
  );
};

export default ARPaymentHeader;
