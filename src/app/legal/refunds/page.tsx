export const metadata = {
    title: 'Refund Policy | CAD Fast Track',
    description: 'Refund Policy for CAD Fast Track Training Services',
};

export default function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Refund Policy</h1>
                <p className="text-zinc-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">1. Money-Back Guarantee</h2>
                    <p>
                        At CAD Fast Track, we are confident in the quality of our training programs. We offer a 14-day money-back guarantee for our courses. If you are not satisfied with your purchase, you may request a full refund within 14 days of your initial enrollment date, provided you meet the eligibility criteria outlined below.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">2. Eligibility for a Refund</h2>
                    <p>
                        To be eligible for a refund, you must meet the following conditions:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>The refund request is submitted within 14 days of the original purchase.</li>
                        <li>You have completed less than 20% of the course content. (We track course progress via completed quizzes and watched video metrics).</li>
                        <li>You have not downloaded any of the supplementary project files provided in later modules.</li>
                    </ul>
                    <p className="mt-4">
                        We reserve the right to decline your refund request if you have engaged in significant content consumption or have violated our Terms of Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">3. How to Request a Refund</h2>
                    <p>
                        To request a refund, please contact our support team at <a href="mailto:support@cadfasttrack.com" className="text-blue-600 hover:underline">support@cadfasttrack.com</a>. Please include your full name, the email address associated with your account, your order number, and a brief explanation of why you are requesting a refund so we can improve our services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">4. Processing Time</h2>
                    <p>
                        Once your refund request is received and reviewed, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment (e.g., via Paystack or bank transfer) within 7-14 business days, depending on your financial institution.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">5. Exceptions</h2>
                    <p>
                        Please note that any specialized consulting services, one-on-one coaching sessions, or custom project management training services that have already been delivered or initiated are strictly non-refundable.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">6. Contact Us</h2>
                    <p>
                        If you have questions about our Refund Policy, please contact us at: <a href="mailto:support@cadfasttrack.com" className="text-blue-600 hover:underline">support@cadfasttrack.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
