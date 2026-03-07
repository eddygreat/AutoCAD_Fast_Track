export const metadata = {
    title: 'Terms of Service | CAD Fast Track',
    description: 'Terms of Service for CAD Fast Track Training Services',
};

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
                <p className="text-zinc-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using the CAD Fast Track website and training platform ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">2. Intellectual Property</h2>
                    <p>
                        The Service and its original content, features, functionality, course materials, videos, and documentation are and will remain the exclusive property of CAD Fast Track and its licensors. The Service is protected by copyright, trademark, and other laws of both the country in which it is hosted and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CAD Fast Track.
                    </p>
                    <p>
                        You are granted a limited, non-exclusive, non-transferable license to access and use the training materials solely for your personal, non-commercial educational purposes.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">3. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p>
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">4. Course Access and Payments</h2>
                    <p>
                        Access to premium course content is subject to the payment of applicable fees. All payments are processed securely through our third-party payment providers (e.g., Paystack). We reserve the right to change our prices at any time. Your continued access to the courses is contingent upon successful payment and compliance with these Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">5. Acceptable Use</h2>
                    <p>You agree not to use the Service:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>In any way that violates any applicable national or international law or regulation.</li>
                        <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                        <li>To impersonate or attempt to impersonate CAD Fast Track, a CAD Fast Track employee, another user, or any other person or entity.</li>
                        <li>To share, distribute, rip, or otherwise make available course materials to individuals who have not purchased access.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">6. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">7. Limitation of Liability</h2>
                    <p>
                        In no event shall CAD Fast Track, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">8. Changes</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">9. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at: <a href="mailto:support@cadfasttrack.com" className="text-blue-600 hover:underline">support@cadfasttrack.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
