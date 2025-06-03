import React from 'react';
import './AccountDeletionPolicy.css';

const AccountDeletionPolicy = () => {
  return (
    <div className="account-deletion-policy-container">
      <div className="bitlabs-common-title">
        <h1 className="bitlabs-common-black-title">Frequently Asked</h1>
        <h1 className="bitlabs-common-color-title">Questions</h1>
      </div>

      <div className="bitlabs-policy-content">
        <h2>BitLabs Account Deletion Policy</h2>
        <p>
          To request deletion of your BitLabs account and all associated personal data, please follow these steps:
        </p>
        <ol>
          <li>Email us at <a href="mailto:support@bitlabs.com">support@bitlabs.com</a> with your account details and request deletion.</li>
          <li>We will process your request within 7 business days.</li>
          <li>Upon deletion, your profile data, test history, and personal information will be permanently removed.</li>
          <li>Some anonymized data may be retained for legal compliance for up to 1 year.</li>
        </ol>
        <p>
          For questions, contact <a href="mailto:legal@bitlabs.com">legal@bitlabs.com</a>.
        </p>
      </div>
    </div>
  );
};

export default AccountDeletionPolicy;
