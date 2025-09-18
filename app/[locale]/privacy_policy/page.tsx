import Menu from "@/components/Menu/Navbar";
import { Link } from "@/i18n/navigation";

export default function Page() {
    return (<>
    <div className="sm:w-1/2 mx-auto p-5">
        <h1 className="text-2xl font-bold">Privacy Policy</h1>

        <p className="text-sm text-gray-500">Last modified: June 5, 2025</p>
        <h3 className="text-lg font-bold">Introduction</h3>

        <p className="indent-4">MCCreations is owned and operated by Benjamin Meier ("Company", "us", "we", "our"). This privacy policy explains how we collect data, process it, and your rights relative to your data.</p>

        <p className="indent-4">This policy describes the types of information we may collect from you or that you may provide when you use www.mccreations.net, or api.mccreations.net ("Service" or "Website"), and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
        <br />
        <p>This policy applies to information we collect:</p>
        <ul className="list-disc list-inside">
            <li>On this Website.</li>
            <li>In email, text, and other electronic messages between you and this Website.</li>
        </ul>
        <p className="mt-2">It does not apply to information collected by:</p>
        <ul className="list-disc list-inside">
            <li>Us offline or through any other means, including on any other website operated by Benjamin Meier or any third party (including our affiliates and subsidiaries); or</li>
            <li>Any third party (including our affiliates and subsidiaries), including through any application or content (including advertising) that may link to or be accessible from or on the Website </li>
        </ul>
        <br />
        <p className="indent-4">Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is not to use our Website. By accessing or using this Website, you agree to this privacy policy. This policy may change from time to time (see Changes to the Privacy Policy). Your continued use of this Website after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.</p>
        <br />
        <h3 className="text-lg font-bold">Foreword</h3>

        <p>The following document was created as required by several laws, including but not limited to:</p>
        <ul className="list-disc list-inside">
            <li>the California Consumer Privacy Act (CA CCPA), more information about which can be found on <Link className="hover:underline text-blue-500" href="https://oag.ca.gov/privacy/ccpa">oag.ca.gov</Link></li>
            <li>the European Union General Data Protection Regulation (EU GDPR), more information about which can be found on <Link className="hover:underline text-blue-500" href="https://gdpr.eu/">gdpr.eu</Link></li>
        </ul>
        <p> Benjamin Meier is the data controller for data collected through MCCreations. </p>
        <br />
        <h3 className="text-lg font-bold">What data do we collect?</h3>
        <h4 className="text-md font-bold">User data</h4>

        <p>When you create an account, we collect:</p>
        <ul className="list-disc list-inside">
            <li>Your email</li>
            <li>Your username</li>
            <li>Your display name</li>
            <li>Your profile picture</li>
            <li>Your OAuth application data (ex: GitHub or Discord ID)</li>
        </ul>
        <p>This data is used to identify you and display your profile. It will be linked to your creations.</p>
        <br />
        <h4 className="text-md font-bold">View data and download data</h4>

        <p>When you view a creation page or download a file from MCCreations, we collect:</p>
        <ul className="list-disc list-inside">
            <li>The creation viewed and/or the file downloaded</li>
            <li>Some additional metadata about your connection (HTTP headers)</li>
        </ul>
        <p>This data is used to monitor automated access to our service and deliver statistics.</p>
        <br />
        <h4 className="text-md font-bold">Usage data</h4>

        <p>When you interact with the Website, we collect through Vercel:</p>
        <ul className="list-disc list-inside">
            <li>Your IP address</li>
            <li>Your anonymized user ID</li>
            <li>The time the interaction happened</li>
            <li>Some additional metadata about the device you are on</li>
            <li>Some additional metadata about each interaction</li>
        </ul>
        <p>This data is used to deliver statistics.</p>
        <br />
        <h3 className="text-lg font-bold">Data retention</h3>

        <p>Data is retained indefinitely. We do not delete any data unless you request it.</p>
        <h3 className="text-lg font-bold">Third-party services</h3>

        <p>We use some third-party services to make MCCreations run. Please refer to each of their privacy policies for more information:</p>
        <ul className="list-disc list-inside">
            <li><Link href="https://vercel.com/legal/privacy-policy">Vercel</Link></li>
            <li><Link href="https://sentry.io/trust/privacy/">Sentry</Link></li>
            <li><Link href="https://www.twilio.com/en-us/legal/privacy">Sendgrid</Link></li>
        </ul>
        <p>Data that we specifically collect isn't shared with any other third party. We do not sell any data.</p>
        <br />
        <h3 className="text-lg font-bold">Data Governance</h3>

        <p>Database access is limited to Benjamin Meier.</p>
        <h3 className="text-lg font-bold">Marketing and advertising</h3>

        <p>We do not conduct marketing or advertising.</p>
        <br />
        <h3 className="text-lg font-bold">Cookies</h3>

        <p className="indent-4">We use cookies to track some information about your session, like what content you have downloaded or rated. Cookies are text files placed on your computer to collect standard Internet information. For more information, please visit <Link className="hover:underline text-blue-500" href="https://allaboutcookies.org/">allaboutcookies.org</Link>.</p>

        <p className="indent-4">You can set your browser not to accept cookies, and the above website tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.</p>
        <br />
        <h3 className="text-lg font-bold">Access, rectification, erasure, restriction, portability, and objection</h3>

        <p>Every user is entitled to the following:</p>
        <ul className="list-disc list-inside">
            <li>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request us to complete the information you believe is incomplete.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
            <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions. </li>
        </ul>
        <p>If you would like to exercise those rights, contact us at <Link className="hover:underline text-blue-500" href="mailto:ben@mccreations.net">ben@mccreations.net</Link>. We may ask you to verify your identity before proceeding and will respond to your request within 30 days as required by law, or notify you of an extended reply time.</p>
        <br />
        <h3 className="text-lg font-bold">Children's Information</h3>

        <p className="indent-4">Another part of our priority is adding protection for children while using the Internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. MCCreations does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
        <br />
        <h3 className="text-lg font-bold">Online Privacy Policy Only</h3>

        <p className="indent-4">This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in MCCreations. This policy is not applicable to any information collected offline or via channels other than this website.</p>
        <br />
        <h3 className="text-lg font-bold">Consent</h3>

        <p className="indent-4">By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
        <br />
        <h3 className="text-lg font-bold">California Privacy Rights</h3>

        <p className="indent-4">If you are a California resident, California law may provide you with additional rights regarding our use of your personal information. To learn more about your California privacy rights, visit <Link className="hover:underline text-blue-500" href="/ccpa">this page.</Link> California's "Shine the Light" law (Civil Code Section § 1798.83) permits users of our App that are California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please send an email to <Link className="hover:underline text-blue-500" href="mailto:ben@mccreations.net">ben@mccreations.net</Link>.</p>
        <br />
        <h3 className="text-lg font-bold">Changes to the Privacy Policy</h3>

        <p className="indent-4">We keep this privacy policy under regular review and place any updates on this web page. If we do this, we will post the changes on this page and update the "Last edited" date at the top of this page, after which such changes will become effective immediately. We will make an effort to keep users updated on any such changes, but because most changes do not affect how we process existing data, a notice will not be sent for all changes.</p>
        <br />
        <h3 className="text-lg font-bold">Contact</h3>

        <p className="indent-4">If you have any questions about this privacy policy or how we process your data, contact us at <Link className="hover:underline text-blue-500" href="mailto:ben@mccreations.net">ben@mccreations.net</Link>.</p>
    </div >
    </>)
}