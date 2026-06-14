import type { Metadata } from 'next';
import SurveyForm from './_components/SurveyForm';

export const metadata: Metadata = {
    title: 'soluma 목회자 자문 설문',
    description: 'SOLUMA 프리런칭 목회자 자문 설문 — ROOT & SOLUMA',
};

export default function SurveyPage() {
    return <SurveyForm />;
}
