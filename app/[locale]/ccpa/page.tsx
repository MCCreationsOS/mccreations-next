import Menu from "@/components/Menu/Navbar";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <div className="sm:w-1/2 mx-auto p-5">
                <h1 className="text-2xl font-bold">Privacy Notice for California Residents</h1>
                <p className="text-sm text-gray-500">Last modified: June 5, 2025</p>
                <p><strong>Effective Date: </strong><em>June 5th, 2025</em></p><p>
                    <strong>Last reviewed on: </strong><em>June 5th, 2025</em></p>
                <br/>
                <p className="indent-4"> This Privacy Notice for California Residents supplements the information contained in the <a href="/privacy_policy" className="">Privacy Policy</a> of MCCreations (the "Company," "we," "us" or "our") and applies solely to all visitors, users, and others who reside in the State of California ("consumers" or "you"). We adopt this notice to comply with the California Consumer Privacy Act of 2018 (CCPA), as it may be amended, modified or supplemented from time to time, and any terms defined in the CCPA have the same meaning when used in this notice. </p>
                <br/>
                <h2 className="text-lg font-bold">Information We Collect</h2>
                <p className="indent-4"> Our Service collects information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device (<strong>"personal information"</strong>). In particular, our Service has collected the following categories of personal information from its consumers within the last twelve (12) months: </p>

                <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                        <tr>
                            <th className="border border-gray-300 p-2">Category</th>
                            <th className="border border-gray-300 p-2">Examples</th>
                            <th className="border border-gray-300 p-2">Collected</th>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">A. Identifiers.</td>
                            <td className="border border-gray-300 p-2"> A real name, alias, postal address, unique personal identifier, online identifier, Internet Protocol address, email address, account name, Social Security number, driver's license number, passport number, or other similar identifiers. </td>
                            <td className="border border-gray-300 p-2">YES</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2"> B. Personal information categories listed in the California Customer Records statute (Cal. Civ. Code § 1798.80(e)). </td>
                            <td className="border border-gray-300 p-2"> A name, signature, Social Security number, physical characteristics or description, address, telephone number, passport number, driver's license or state identification card number, insurance policy number, education, employment, employment history, bank account number, credit card number, debit card number, or any other financial information, medical information, or health insurance information. <br /><br /> Some personal information included in this category may overlap with other categories. </td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">C. Protected classification characteristics.</td>
                            <td className="border border-gray-300 p-2"> Age (40 years or older), race, color, ancestry, national origin, citizenship, religion or creed, marital status, medical condition, physical or mental disability, sex (including gender, gender identity, gender expression, pregnancy or childbirth and related medical conditions), sexual orientation, veteran or military status, genetic information (including familial genetic information). </td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">D. Commercial information.</td>
                            <td className="border border-gray-300 p-2"> Records of personal property, products or services purchased, obtained, or considered, or other purchasing or consuming histories or tendencies. </td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">E. Biometric information.</td>
                            <td className="border border-gray-300 p-2"> Genetic, physiological, behavioral, and biological characteristics, or activity patterns used to extract a template or other identifier or identifying information, such as, fingerprints, faceprints, and voiceprints, iris or retina scans, keystroke, gait, or other physical patterns, and sleep, health, or exercise data. </td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">F. Internet or other similar network activity.</td>
                            <td className="border border-gray-300 p-2"> Browsing history, search history, information on a consumer's interaction with a website, application, or advertisement. </td>
                            <td className="border border-gray-300 p-2">YES</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">G. Geolocation data.</td>
                            <td className="border border-gray-300 p-2">Physical location or movements.</td>
                            <td className="border border-gray-300 p-2">YES</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">H. Sensory data.</td>
                            <td className="border border-gray-300 p-2">Audio, electronic, visual, thermal, olfactory, or similar information.</td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">I. Professional or employment-related information.</td>
                            <td className="border border-gray-300 p-2">Current or past job history or performance evaluations.</td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2"> J. Non-public education information (per the Family Educational Rights and Privacy Act (20 U.S.C. Section 1232g, 34 C.F.R. Part 99)). </td>
                            <td className="border border-gray-300 p-2"> Education records directly related to a student maintained by an educational institution or party acting on its behalf, such as grades, transcripts, class lists, student schedules, student identification codes, student financial information, or student disciplinary records. </td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">K. Inferences drawn from other personal information.</td>
                            <td className="border border-gray-300 p-2"> Profile reflecting a person's preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, and aptitudes. </td>
                            <td className="border border-gray-300 p-2">NO</td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <p>Personal information does not include:</p>
                <ul className="list-disc list-inside">
                    <li>Publicly available information from government records.</li>
                    <li>Deidentified or aggregated consumer information.</li>
                    <li>Information excluded from the CCPA's scope, like:</li>
                    <ul className="list-disc list-inside ml-5">
                        <li> health or medical information covered by the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the California Confidentiality of Medical Information Act (CMIA) or clinical trial data; </li>
                        <li> personal information covered by certain sector-specific privacy laws, including the Fair Credit Reporting Act (FRCA), the Gramm-Leach-Bliley Act (GLBA) or California Financial Information Privacy Act (FIPA), and the Driver's Privacy Protection Act of 1994. </li>
                    </ul>
                </ul>
                <br/>
                <p> We obtain the categories of personal information listed above from the following categories of sources: </p>
                <ul className="list-disc list-inside">
                    <li> Directly from you. For example, from forms you complete or products and services you purchase. </li>
                    <li>Indirectly from you. For example, from observing your actions on our Service.</li>
                </ul>
                <br/>
                <h2 className="text-lg font-bold">Use of Personal Information</h2>
                <p> We may use or disclose the personal information we collect for one or more of the following business purposes: </p>
                <ul className="list-disc list-inside">
                    <li> To fulfill or meet the reason you provided the information. For example, if you share your name and contact information to request a price quote or ask a question about our products or services, we will use that personal information to respond to your inquiry. If you provide your personal information to purchase a product or service, we will use that information to process your payment and facilitate delivery. We may also save your information to facilitate new product orders or process returns. </li>
                    <li>To provide, support, personalize, and develop our Service, products, and services.</li>
                    <li>To create, maintain, customize, and secure your account with us.</li>
                    <li> To process your requests, purchases, transactions, and payments and prevent transactional fraud. </li>
                    <li> To provide you with support and to respond to your inquiries, including to investigate and address your concerns and monitor and improve our responses. </li>
                    <li> To personalize your Service experience and to deliver content and product and service offerings relevant to your interests, including targeted offers and ads through our Service, third-party sites, and via email or text message (with your consent, where required by law). </li>
                    <li> To help maintain the safety, security, and integrity of our Service, products and services, databases and other technology assets, and business. </li>
                    <li> For testing, research, analysis, and product development, including to develop and improve our Service, products, and services. </li>
                    <li> To respond to law enforcement requests and as required by applicable law, court order, or governmental regulations. </li>
                    <li> As described to you when collecting your personal information or as otherwise set forth in the CCPA. </li>
                    <li> To evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of the Company's assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by the Company about our Service users is among the assets transferred. </li>
                </ul>
                <p> We will not collect additional categories of personal information or use the personal information we collected for materially different, unrelated, or incompatible purposes without providing you notice. </p>
                <br/>
                <h2 className="text-lg font-bold">Sharing Personal Information</h2>
                <p className="indent-4"> We may disclose your personal information to a third party for a business purpose. When we disclose personal information for a business purpose, we enter a contract that describes the purpose and requires the recipient to both keep that personal information confidential and not use it for any purpose except performing the contract. The CCPA prohibits third parties who purchase the personal information we hold from reselling it unless you have received explicit notice and an opportunity to opt-out of further sales. </p>
                <br/>
                <h3 className="text-md font-bold">Disclosures of Personal Information for a Business Purpose</h3>
                <p> In the preceding twelve (12) months, Company has disclosed the following categories of personal information for a business purpose: </p>
                <ul className="list-disc list-inside">
                    <li>Category A: Identifiers.</li>
                    <li>Category F: Internet or other similar network activity.</li>
                    <li>Category G: Geolocation data.</li>
                </ul>
                <br/>
                <p> We disclose your personal information for a business purpose to the following categories of third parties: </p>
                <ul className="list-disc list-inside">
                    <li>Service providers.</li>
                </ul>
                <br/>
                <h3 className="text-md font-bold">Sales of Personal Information</h3>
                <p>In the preceding twelve (12) months, Company has not sold personal information.</p>
                <br/>
                <h2 className="text-lg font-bold">Your Rights and Choices</h2>
                <p className="indent-4">The CCPA provides consumers (California residents) with specific rights regarding their personal information. This section describes your CCPA rights and explains how to exercise those rights. </p>
                <br/>
                <h3 className="text-md font-bold">Access to Specific Information and Data Portability Rights</h3>
                <p className="indent-4"> You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months. Once we receive and confirm your verifiable consumer request (see <i>Exercising Access, Data Portability, and Deletion Rights</i>), we will disclose to you: </p>
                <ul className="list-disc list-inside">
                    <li>The categories of personal information we collected about you.</li>
                    <li>The categories of sources for the personal information we collected about you.</li>
                    <li> Our business or commercial purpose for collecting or selling that personal information. </li>
                    <li>The categories of third parties with whom we share that personal information.</li>
                    <li> The specific pieces of personal information we collected about you (also called a data portability request). </li>
                    <li> If we sold or disclosed your personal information for a business purpose, two separate lists disclosing: </li>
                    <ul>
                        <li> sales, identifying the personal information categories that each category of recipient purchased; and </li>
                        <li> disclosures for a business purpose, identifying the personal information categories that each category of recipient obtained. </li>
                    </ul>
                </ul>
                <br/>
                <h3 className="text-md font-bold">Deletion Request Rights</h3>
                <p className="indent-4"> You have the right to request that we delete any of your personal information that we collected from you and retained, subject to certain exceptions. Once we receive and confirm your verifiable consumer request (see <i>Exercising Access, Data Portability, and Deletion Rights</i>), we will delete (and direct our service providers to delete) your personal information from our records, unless an exception applies. </p>
                <p> We may deny your deletion request if retaining the information is necessary for us or our service provider(s) to: </p>
                <ol className="list-decimal list-inside">
                    <li> Complete the transaction for which we collected the personal information, provide a good or service that you requested, take actions reasonably anticipated within the context of our ongoing business relationship with you, or otherwise perform our contract with you. </li>
                    <li> Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity, or prosecute those responsible for such activities. </li>
                    <li> Debug products to identify and repair errors that impair existing intended functionality. </li>
                    <li> Exercise free speech, ensure the right of another consumer to exercise their free speech rights, or exercise another right provided for by law. </li>
                    <li> Comply with the California Electronic Communications Privacy Act (Cal. Penal Code § 1546 <i>et. seq.</i>). </li>
                    <li> Engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when the information's deletion may likely render impossible or seriously impair the research's achievement, if you previously provided informed consent. </li>
                    <li> Enable solely internal uses that are reasonably aligned with consumer expectations based on your relationship with us. </li>
                    <li>Comply with a legal obligation.</li>
                    <li> Make other internal and lawful uses of that information that are compatible with the context in which you provided it. </li>
                </ol>
                <br/>
                <h3 className="text-md font-bold">Exercising Access, Data Portability, and Deletion Rights</h3>
                <p className="indent-4"> To exercise the access, data portability, and deletion rights described above, please submit a verifiable consumer request to us by emailing us at <Link className="hover:underline text-blue-500" href="mailto:ben@mccreations.net">ben@mccreations.net</Link>. </p>
                <p className="indent-4"> Only you, or a person registered with the California Secretary of State that you authorize to act on your behalf, may make a verifiable consumer request related to your personal information. You may also make a verifiable consumer request on behalf of your minor child. </p>
                <p> You may only make a verifiable consumer request for access or data portability twice within a 12-month period. The verifiable consumer request must: </p>
                <ul className="list-disc list-inside">
                    <li> Provide sufficient information that allows us to reasonably verify you are the person about whom we collected personal information or an authorized representative. </li>
                    <li> Describe your request with sufficient detail that allows us to properly understand, evaluate, and respond to it. </li>
                </ul>
                <p className="indent-4"> We cannot respond to your request or provide you with personal information if we cannot verify your identity or authority to make the request and confirm the personal information relates to you. Making a verifiable consumer request does not require you to create an account with us. However, we do consider requests made through your password protected account sufficiently verified when the request relates to personal information associated with that specific account. </p>
                <p className="indent-4"> We will only use personal information provided in a verifiable consumer request to verify the requestor's identity or authority to make the request. For instructions on exercising sale opt-out rights, see <i>Personal Information Sales Opt-Out and Opt-In Rights.</i></p>
                <br/>
                <h3 className="text-md font-bold">Response Timing and Format</h3>
                <p className="indent-4"> We endeavor to respond to a verifiable consumer request within forty-five (45) days of its receipt. If we require more time (up to 90 days), we will inform you of the reason and extension period in writing. </p>
                <p className="indent-4"> If you have an account with us, we will deliver our written response to that account. If you do not have an account with us, we will deliver our written response by mail or electronically, at your option. </p>
                <p className="indent-4"> Any disclosures we provide will only cover the 12-month period preceding the verifiable consumer request's receipt. The response we provide will also explain the reasons we cannot comply with a request, if applicable. For data portability requests, we will select a format to provide your personal information that is readily useable and should allow you to transmit the information from one entity to another entity without hindrance. </p>
                <p className="indent-4"> We do not charge a fee to process or respond to your verifiable consumer request unless it is excessive, repetitive, or manifestly unfounded. If we determine that the request warrants a fee, we will tell you why we made that decision and provide you with a cost estimate before completing your request. </p>
                <br/>
                <h2 className="text-lg font-bold">Non-Discrimination</h2>
                <p> We will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not: </p>
                <ul className="list-disc list-inside">
                    <li>Deny you goods or services.</li>
                    <li> Charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties. </li>
                    <li>Provide you a different level or quality of goods or services.</li>
                    <li> Suggest that you may receive a different price or rate for goods or services or a different level or quality of goods or services. </li>
                </ul>
                <p className="indent-4"> However, we may offer you certain financial incentives permitted by the CCPA that <strong>can result</strong> in different prices, rates, or quality levels. Any CCPA-permitted financial incentive we offer will reasonably relate to your personal information's value and contain written terms that describe the program's material aspects. Participation in a financial incentive program requires your prior opt in consent, which you may revoke at any time. </p>
                <br/>
                <h2 className="text-lg font-bold">Changes to Our Privacy Notice</h2>
                <p className="indent-4"> We reserve the right to amend this privacy notice at our discretion and at any time. When we make changes to this privacy notice, we will post the updated notice on the Service and update the notice's effective date. <strong>Your continued use of our Service following the posting of changes constitutes your acceptance of such changes. </strong></p>
                <br/>
                <h2 className="text-lg font-bold">Contact Information</h2>
                <p className="indent-4"> If you have any questions or comments about this notice, the ways in which we collect and use your information described below and in the <Link className="hover:underline text-blue-500" href="/privacy_policy">Privacy Policy</Link>, your choices and rights regarding such use, or wish to exercise your rights under California law, please do not hesitate to contact us at <Link className="hover:underline text-blue-500" href="mailto:ben@mccreations.net">ben@mccreations.net</Link>.
                </p>
            </div>
        </>
    )
}