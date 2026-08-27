import React from 'react';
import type { ARPayment, SuggestedInvoiceMatch } from '../../types/ar';
import ARPaymentHeader from './ARPaymentHeader';
import ARReconciliationSummary from './ARReconciliationSummary';
import ARInvoiceCard from './ARInvoiceCard';
import ARSuggestedMatches from './ARSuggestedMatches';
import { Layers, FileText, Info, HelpCircle } from 'lucide-react';
import { formatCurrencyINR } from '../../data/arMockData';

interface ARWorkspaceProps {
  payment: ARPayment | null;
  onPostToERP: (paymentId: string) => void;
  onAcceptMatch: (paymentId: string, suggestion: SuggestedInvoiceMatch) => void;
  isPosting: boolean;
}

export const ARWorkspace: React.FC<ARWorkspaceProps> = ({
  payment,
  onPostToERP,
  onAcceptMatch,
  isPosting,
}) => {
  if (!payment) {
    return (
      <div className="ar-workspace-empty">
        <FileText size={40} className="ar-workspace-empty__icon" />
        <h3>No Payment Selected</h3>
        <p>Please select an incoming payment from the inbox on the left to view reconciliation details.</p>
      </div>
    );
  }

  const hasMatchedInvoices = payment.matchedInvoices.length > 0;
  const hasSuggestedMatches = (payment.suggestedMatches || []).length > 0;

  return (
    <div className="ar-workspace-pane">
      {/* 1. Compact Top Payment Header */}
      <ARPaymentHeader
        payment={payment}
        onPostToERP={onPostToERP}
        isPosting={isPosting}
      />

      {/* 2. Prominent Reconciliation Summary */}
      <ARReconciliationSummary payment={payment} />

      {/* 3. Matched Invoices Section */}
      <section className="ar-invoices-section">
        <div className="ar-invoices-section__header">
          <div className="ar-invoices-section__title-group">
            <Layers size={18} className="ar-invoices-section__icon" />
            <h3 className="ar-invoices-section__title">Matched Invoices</h3>
            <span className="ar-invoices-section__count-badge">
              {payment.matchedInvoices.length} {payment.matchedInvoices.length === 1 ? 'Invoice' : 'Invoices'}
            </span>
          </div>

          {hasMatchedInvoices && (
            <div className="ar-invoices-section__total-matched">
              <span>Total Matched:</span>
              <strong>{formatCurrencyINR(payment.matchedAmount)}</strong>
            </div>
          )}
        </div>

        {hasMatchedInvoices ? (
          <div className="ar-invoices-list">
            {payment.matchedInvoices.map((inv, idx) => (
              <ARInvoiceCard
                key={inv.id}
                invoice={inv}
                defaultExpanded={idx === 0}
              />
            ))}
          </div>
        ) : (
          <div className="ar-invoices-empty-card">
            <HelpCircle size={24} className="ar-invoices-empty-card__icon" />
            <h4>No Invoices Matched Yet</h4>
            <p>
              This payment has not yet been reconciled against an open invoice in the customer sub-ledger.
            </p>
          </div>
        )}
      </section>

      {/* 4. Suggested Matches (for Needs Review / Unmatched) */}
      {hasSuggestedMatches && (
        <ARSuggestedMatches payment={payment} onAcceptMatch={onAcceptMatch} />
      )}

      {/* 5. Notes & Audit Memo */}
      {payment.notes && (
        <div className="ar-audit-notes-card">
          <div className="ar-audit-notes-card__header">
            <Info size={14} className="ar-color-blue" />
            <span className="ar-audit-notes-card__title">Reconciliation Notes & System Log</span>
          </div>
          <p className="ar-audit-notes-card__text">{payment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ARWorkspace;
