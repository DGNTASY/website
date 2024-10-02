import { Metadata } from 'next';
import PrivacyPolicy from './PrivacyPolicy';

export const metadata: Metadata = {
	title: 'Privacy Policy',
};

export default function PagePrivacyPolicy() {
	return <PrivacyPolicy />;
}
