import { Metadata } from 'next';
import TermsAndConditions from './TermsAndConditions';

export const metadata: Metadata = {
	title: 'Terms & Conditions',
};

export default function PagePrivacyPolicy() {
	return <TermsAndConditions />;
}
