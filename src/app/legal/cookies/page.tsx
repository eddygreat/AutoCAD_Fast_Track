export const metadata = {
    title: 'Cookie Policy | CAD Fast Track',
    description: 'Cookie Policy for CAD Fast Track Training Services',
};

export default function CookiePolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
                <p className="text-zinc-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">1. What are cookies?</h2>
                    <p>
                        Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">2. How we use cookies</h2>
                    <p>
                        CAD Fast Track uses cookies to improve your experience on our platform. Specifically, we use cookies for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Authentication:</strong> We use cookies (specifically via Supabase) to verify your account and determine when you are logged in so we can make it easier for you to access your dashboard and course materials.</li>
                        <li><strong>Security:</strong> We use cookies to help keep your account, data, and the CAD Fast Track platform safe and secure.</li>
                        <li><strong>Performance and Analytics:</strong> We use cookies to understand how our website is performing and how you interact with it. This helps us to improve our platform and your learning experience.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">3. Types of cookies we use</h2>
                    <p>We primarily use two types of cookies:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Essential Cookies:</strong> These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website. Because these cookies are strictly necessary to deliver the site, you cannot refuse them without impacting how our site functions.</li>
                        <li><strong>Analytical/Performance Cookies:</strong> These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">4. Managing your cookies</h2>
                    <p>
                        Most web browsers allow some control of most cookies through the browser settings. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website, specifically the authenticated dashboard and learning experience, may become inaccessible or not function properly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 mt-8">5. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Cookie Policy, please contact us at: <a href="mailto:support@cadfasttrack.com" className="text-blue-600 hover:underline">support@cadfasttrack.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
