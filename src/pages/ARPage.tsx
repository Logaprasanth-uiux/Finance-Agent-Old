import React, { useState } from 'react';
import type { ARPayment, SuggestedInvoiceMatch } from '../types/ar';
import { initialARPayments } from '../data/arMockData';
import ARInbox from '../components/ar/ARInbox';
import ARWorkspace from '../components/ar/ARWorkspace';
import { RotateCcw } from 'lucide-react';

export const ARPage: React.FC = () => {
  const [payments, setPayments] = useState<ARPayment[]>(initialARPayments);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    initialARPayments[0]?.id || ''
  );
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId) || null;

  // Handle Post to ERP simulation
  const handlePostToERP = (paymentId: string) => {
    setIsPosting(true);
    setTimeout(() => {
      // Generate a mock SAP doc number based on time/random seed
      const generatedSapDoc = (1400000300 + Math.floor(Math.random() * 90)).toString();
      const now = new Date();
      const formattedTimestamp = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`;

      setPayments((prev) =>
        prev.map((item) => {
          if (item.id === paymentId) {
            const updatedInvoices = item.matchedInvoices.map((inv) => ({
              ...inv,
              sapDoc: generatedSapDoc,
              linkedRecords: [
                {
                  id: `lr-sap-${Date.now()}`,
                  type: 'SAP Clearing Doc' as const,
                  reference: generatedSapDoc,
                  amount: item.paymentAmount,
                  date: 'Just now',
                  status: 'Posted to SAP',
                  details: 'Customer Sub-ledger & Bank Clearing Account balanced.',
                },
                ...inv.linkedRecords,
              ],
            }));

            return {
              ...item,
              erpStatus: 'Posted',
              status: 'Posted',
              sapDoc: generatedSapDoc,
              postedAt: formattedTimestamp,
              matchedInvoices: updatedInvoices,
              notes: `Posted to SAP Financials under clearing document #${generatedSapDoc} on ${formattedTimestamp}.`,
            };
          }
          return item;
        })
      );
      setIsPosting(false);
    }, 600);
  };

  // Handle 1-click matching of suggested candidate invoice
  const handleAcceptMatch = (paymentId: string, suggestion: SuggestedInvoiceMatch) => {
    setPayments((prev) =>
      prev.map((item) => {
        if (item.id === paymentId) {
          const newMatchedAmount = item.matchedAmount + suggestion.invoice.netAmount;
          const newRemaining = Math.max(0, item.paymentAmount - newMatchedAmount);
          const isFullyMatched = newRemaining === 0;

          return {
            ...item,
            matchedAmount: newMatchedAmount,
            remainingAmount: newRemaining,
            status: isFullyMatched ? 'Fully Reconciled' : 'Partially Matched',
            erpStatus: isFullyMatched ? 'Ready to Post' : 'Pending Match',
            matchedInvoices: [...item.matchedInvoices, suggestion.invoice],
            suggestedMatches: (item.suggestedMatches || []).filter(
              (s) => s.invoice.id !== suggestion.invoice.id
            ),
            notes: `Auto-matched invoice ${suggestion.invoice.docRef} with ${suggestion.confidenceScore}% confidence. Balanced for ERP clearance.`,
          };
        }
        return item;
      })
    );
  };

  // Reset demo state
  const handleResetDemoData = () => {
    setPayments(initialARPayments);
    setSelectedPaymentId(initialARPayments[0]?.id || '');
  };

  return (
    <div className="ar-page-container">
      {/* Quick Demo Toolbar banner */}
      <div className="ar-demo-toolbar">
        <div className="ar-demo-toolbar__info">
          <span className="ar-demo-badge">DEMO WORKSPACE</span>
          <span className="ar-demo-toolbar__text">
            Interactive AR payment reconciliation & SAP ERP posting experience
          </span>
        </div>
        <button
          onClick={handleResetDemoData}
          className="ar-demo-toolbar__reset-btn"
          title="Reset mock data to initial demo state"
        >
          <RotateCcw size={13} />
          Reset Demo Data
        </button>
      </div>

      {/* Two-Pane Primary Workspace */}
      <div className="ar-two-pane-layout">
        {/* Left Pane: Inbox */}
        <ARInbox
          payments={payments}
          selectedPaymentId={selectedPaymentId}
          onSelectPayment={(payment) => setSelectedPaymentId(payment.id)}
        />

        {/* Right Pane: Workspace & Reconciliation Details */}
        <ARWorkspace
          payment={selectedPayment}
          onPostToERP={handlePostToERP}
          onAcceptMatch={handleAcceptMatch}
          isPosting={isPosting}
        />
      </div>
    </div>
  );
};

export default ARPage;
