import React, { useState } from 'react';
import type { MatchedInvoice } from '../../types/ar';
import { formatCurrencyINR } from '../../data/arMockData';
import ARLinkedRecords from './ARLinkedRecords';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

interface ARInvoiceCardProps {
  invoice: MatchedInvoice;
  defaultExpanded?: boolean;
}

export const ARInvoiceCard: React.FC<ARInvoiceCardProps> = ({
  invoice,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`ar-invoice-card ${isExpanded ? 'ar-invoice-card--expanded' : ''}`}>
      {/* Collapsed Header / Summary Bar */}
      <div
        className="ar-invoice-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="ar-invoice-card__header-left">
          <button
            className="ar-invoice-card__expand-btn"
            aria-label={isExpanded ? 'Collapse invoice' : 'Expand invoice'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div className="ar-invoice-card__doc-info">
            <div className="ar-invoice-card__ref-row">
              <span className="ar-invoice-card__badge">
                <FileText size={12} />
                {invoice.docRef}
              </span>
              <span className="ar-invoice-card__match-badge">
                <ShieldCheck size={12} />
                {invoice.matchStatus}
              </span>
            </div>
            <h4 className="ar-invoice-card__desc" title={invoice.description}>
              {invoice.description}
            </h4>
          </div>
        </div>

        <div className="ar-invoice-card__header-right">
          <div className="ar-invoice-card__quick-amounts">
            <div className="ar-invoice-card__quick-stat">
              <span className="ar-invoice-card__quick-label">Gross</span>
              <span className="ar-invoice-card__quick-val">
                {formatCurrencyINR(invoice.grossAmount)}
              </span>
            </div>

            <div className="ar-invoice-card__quick-stat">
              <span className="ar-invoice-card__quick-label">TDS</span>
              <span className="ar-invoice-card__quick-val ar-invoice-card__quick-val--tds">
                - {formatCurrencyINR(invoice.tdsAmount)}
              </span>
            </div>

            <div className="ar-invoice-card__quick-stat ar-invoice-card__quick-stat--net">
              <span className="ar-invoice-card__quick-label">Net Settled</span>
              <span className="ar-invoice-card__quick-val ar-invoice-card__quick-val--net">
                {formatCurrencyINR(invoice.netAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Deep Details View */}
      {isExpanded && (
        <div className="ar-invoice-card__body">
          {/* Financial Breakdown Grid */}
          <div className="ar-invoice-breakdown">
            <div className="ar-invoice-breakdown__item">
              <span className="ar-invoice-breakdown__label">Gross / Source Amount</span>
              <span className="ar-invoice-breakdown__value">
                {formatCurrencyINR(invoice.grossAmount)}
              </span>
              <span className="ar-invoice-breakdown__hint">Original Invoice Amount</span>
            </div>

            <div className="ar-invoice-breakdown__item ar-invoice-breakdown__item--deduct">
              <span className="ar-invoice-breakdown__label">
                TDS Deducted {invoice.tdsSection ? `(${invoice.tdsSection})` : ''}
              </span>
              <span className="ar-invoice-breakdown__value ar-color-amber">
                - {formatCurrencyINR(invoice.tdsAmount)}
              </span>
              <span className="ar-invoice-breakdown__hint">Tax Withheld by Customer</span>
            </div>

            <div className="ar-invoice-breakdown__item ar-invoice-breakdown__item--deduct">
              <span className="ar-invoice-breakdown__label">Advance / Credit Adjusted</span>
              <span className="ar-invoice-breakdown__value">
                {invoice.advanceAdjusted > 0
                  ? `- ${formatCurrencyINR(invoice.advanceAdjusted)}`
                  : '₹0'}
              </span>
              <span className="ar-invoice-breakdown__hint">Pre-payment Offset</span>
            </div>

            <div className="ar-invoice-breakdown__item ar-invoice-breakdown__item--total">
              <span className="ar-invoice-breakdown__label">Net / Bank Amount</span>
              <span className="ar-invoice-breakdown__value ar-color-primary">
                {formatCurrencyINR(invoice.netAmount)}
              </span>
              <span className="ar-invoice-breakdown__hint">Cleared Inbound Cash</span>
            </div>
          </div>

          {/* Dates & Reference Bar */}
          <div className="ar-invoice-details-bar">
            <div className="ar-invoice-detail-chip">
              <Calendar size={13} />
              <span>Doc Date: <strong>{invoice.docDate}</strong></span>
            </div>
            <div className="ar-invoice-detail-chip">
              <ArrowDownRight size={13} />
              <span>Txn Date: <strong>{invoice.txnDate}</strong></span>
            </div>
            <div className="ar-invoice-detail-chip">
              <Layers size={13} />
              <span>SAP Doc: <strong>{invoice.sapDoc}</strong></span>
            </div>
            <div className="ar-invoice-detail-chip ar-invoice-detail-chip--success">
              <CheckCircle2 size={13} />
              <span>Matching Rule: <strong>{invoice.matchStatus}</strong></span>
            </div>
          </div>

          {/* Linked / Mapped Records */}
          <ARLinkedRecords records={invoice.linkedRecords} />
        </div>
      )}
    </div>
  );
};

export default ARInvoiceCard;
