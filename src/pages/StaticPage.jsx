import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const StaticPage = () => {
  const location = useLocation();
  const slug = location.pathname.substring(1);

  const content = {
    about: {
      title: 'About Us',
      content: `
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Welcome to Truaxis</h2>
            <p class="mb-4">Truaxis is your trusted destination for premium quality products across multiple categories. We are committed to providing exceptional value, outstanding customer service, and a seamless shopping experience.</p>
            <p class="mb-4">Founded with a vision to make quality products accessible to everyone, we have built a reputation for reliability, authenticity, and customer satisfaction. Our extensive product range includes Personal Care & Hygiene, Household Cleaning Products, Home Appliances, and Miscellaneous items to cater to all your daily needs.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Our Mission</h3>
            <p class="mb-4">To provide high-quality products at competitive prices while maintaining the highest standards of customer service. We believe in building long-term relationships with our customers through trust, transparency, and consistent delivery of value.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Our Values</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Quality First:</strong> We source only genuine, high-quality products from trusted manufacturers and suppliers.</li>
              <li><strong>Customer Centricity:</strong> Your satisfaction is our top priority. We go the extra mile to ensure you have a pleasant shopping experience.</li>
              <li><strong>Transparency:</strong> We maintain complete transparency in our pricing, policies, and business practices.</li>
              <li><strong>Reliability:</strong> We deliver on our promises - from product quality to delivery timelines.</li>
              <li><strong>Innovation:</strong> We continuously improve our services and product offerings to meet evolving customer needs.</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Why Choose Us?</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Wide selection of premium products across multiple categories</li>
              <li>Competitive pricing with regular discounts and special offers</li>
              <li>Fast and reliable delivery across India</li>
              <li>Secure payment options including Cash on Delivery (COD)</li>
              <li>Easy returns and hassle-free refund process</li>
              <li>24/7 customer support to assist you with any queries</li>
              <li>100% genuine products with manufacturer warranty</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Company Information</h3>
            <p class="mb-2"><strong>Company Name:</strong> Truaxis</p>
            <p class="mb-2"><strong>Email:</strong> <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
            <p class="mb-2"><strong>Phone:</strong> <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Our Commitment</h3>
            <p class="mb-4">At Truaxis, we are committed to excellence in every aspect of our business. From product selection to customer service, we strive to exceed your expectations. We value your trust and work tirelessly to maintain it through consistent quality, fair pricing, and exceptional service.</p>
            <p class="mb-4">Thank you for choosing Truaxis. We look forward to serving you and becoming your preferred shopping destination.</p>
          </div>
        </div>
      `,
    },
    contact: {
      title: 'Contact Us',
      content: `
        <p>We'd love to hear from you! Get in touch with us through any of the following channels:</p>
        <h3>Email</h3>
        <p><a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
        <h3>Phone</h3>
        <p><a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
        <h3>Company Name</h3>
        <p><strong>Truaxis</strong></p>
      `,
    },
    shipping: {
      title: 'Shipping Information',
      content: `
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Shipping Policy</h2>
            <p class="mb-4">At Truaxis, we understand the importance of timely delivery. We have partnered with reliable logistics providers to ensure your orders reach you safely and on time.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Free Shipping</h3>
            <p class="mb-4">We offer <strong>FREE SHIPPING</strong> on all orders above ₹500. For orders below ₹500, a nominal shipping charge may apply based on your location and order weight.</p>
            <p class="mb-4">Free shipping is available to all major cities and towns across India. For remote locations, additional charges may apply, which will be clearly displayed during checkout.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Delivery Timeline</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Standard Delivery:</strong> 3-7 business days for most locations</li>
              <li><strong>Express Delivery:</strong> 1-3 business days (available for select locations at additional charges)</li>
              <li><strong>Metro Cities:</strong> 2-5 business days (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune)</li>
              <li><strong>Tier 2 & 3 Cities:</strong> 5-7 business days</li>
              <li><strong>Remote Areas:</strong> 7-10 business days (subject to courier service availability)</li>
            </ul>
            <p class="mb-4"><em>Note: Delivery timelines are estimates and may vary due to factors beyond our control such as weather conditions, natural disasters, or courier service delays. We will keep you informed of any significant delays.</em></p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Shipping Methods</h3>
            <p class="mb-4">We use trusted courier partners including:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Blue Dart</li>
              <li>DTDC</li>
              <li>Delhivery</li>
              <li>India Post</li>
              <li>Other regional courier services</li>
            </ul>
            <p class="mb-4">The shipping method is automatically selected based on your delivery address, order weight, and delivery timeline. We choose the most reliable and cost-effective option for each order.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Order Processing</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Orders placed before 2:00 PM on business days are processed the same day</li>
              <li>Orders placed after 2:00 PM are processed on the next business day</li>
              <li>Orders placed on weekends or holidays are processed on the next business day</li>
              <li>Once processed, orders are dispatched within 24-48 hours</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Order Tracking</h3>
            <p class="mb-4">Once your order is shipped, you will receive:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>An email confirmation with your tracking number</li>
              <li>SMS notification with tracking details (if mobile number is provided)</li>
              <li>Real-time updates on your order status</li>
            </ul>
            <p class="mb-4">You can track your order using the tracking number provided. Simply click on the tracking link in your email or SMS, or visit our website and enter your order number.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Delivery Address</h3>
            <p class="mb-4">Please ensure your delivery address is complete and accurate. Include:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Complete street address with house/flat number</li>
              <li>Landmark (if applicable)</li>
              <li>City, State, and PIN Code</li>
              <li>Contact phone number for delivery coordination</li>
            </ul>
            <p class="mb-4"><strong>Important:</strong> We are not responsible for delays or failed deliveries due to incorrect or incomplete addresses. Please verify your address before confirming your order.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Delivery Attempts</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Our courier partners will make up to 3 delivery attempts</li>
              <li>If you are unavailable, the courier will leave a calling card</li>
              <li>You can reschedule the delivery by contacting the courier directly</li>
              <li>If all delivery attempts fail, the order will be returned to us</li>
              <li>Returned orders may be subject to return shipping charges</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">International Shipping</h3>
            <p class="mb-4">Currently, we only ship within India. International shipping is not available at this time. We are working on expanding our shipping services to other countries in the future.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Damaged or Lost Shipments</h3>
            <p class="mb-4">In the rare event that your order is damaged during transit or lost:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Please contact us immediately at <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a> or call <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></li>
              <li>Provide your order number and photos of the damaged package (if applicable)</li>
              <li>We will investigate and resolve the issue promptly</li>
              <li>You may be eligible for a replacement or full refund as per our refund policy</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Contact for Shipping Queries</h3>
            <p class="mb-2">For any shipping-related queries or concerns, please contact us:</p>
            <p class="mb-2"><strong>Email:</strong> <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
            <p class="mb-2"><strong>Phone:</strong> <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
            <p class="mb-4"><strong>Business Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST</p>
          </div>
        </div>
      `,
    },
    'refund-policy': {
      title: 'Refund Policy',
      content: `
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Return & Refund Policy</h2>
            <p class="mb-4">At Truaxis, we want you to be completely satisfied with your purchase. If you are not happy with your order, we offer a hassle-free return and refund process.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Return Eligibility</h3>
            <p class="mb-4">You can return products within <strong>7 days</strong> of delivery, provided the following conditions are met:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>The product is unused, unopened, and in its original condition</li>
              <li>Original packaging is intact with all tags, labels, and accessories</li>
              <li>Original invoice or proof of purchase is provided</li>
              <li>The product is not damaged, defective, or tampered with</li>
              <li>Personal care items and consumables cannot be returned for hygiene reasons (unless defective)</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Non-Returnable Items</h3>
            <p class="mb-4">The following items cannot be returned:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Personal care items that have been opened or used (unless defective)</li>
              <li>Consumable products that have been opened</li>
              <li>Items damaged due to misuse or negligence</li>
              <li>Products without original packaging or tags</li>
              <li>Items purchased during special sales or clearance (unless defective)</li>
              <li>Customized or personalized products</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Defective or Damaged Products</h3>
            <p class="mb-4">If you receive a defective, damaged, or incorrect product:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Contact us immediately within 48 hours of delivery</li>
              <li>Provide clear photos of the defect or damage</li>
              <li>We will arrange for a replacement or full refund</li>
              <li>Return shipping charges will be borne by us</li>
              <li>No questions asked - we will resolve the issue promptly</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Return Process</h3>
            <p class="mb-4">To initiate a return:</p>
            <ol class="list-decimal pl-6 space-y-2 mb-4">
              <li>Log in to your account and go to "My Orders"</li>
              <li>Select the order you want to return</li>
              <li>Click on "Return" and select the reason for return</li>
              <li>Our team will review your request and send you a Return Authorization (RA) number</li>
              <li>Pack the product securely in its original packaging</li>
              <li>Include the original invoice and RA number</li>
              <li>Ship the product to the address provided in the return instructions</li>
              <li>Alternatively, you can email us at <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a> or call <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></li>
            </ol>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Return Shipping</h3>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Free Returns:</strong> Returns due to defective products, wrong items, or our error are free</li>
              <li><strong>Paid Returns:</strong> Returns due to change of mind or size/color exchange may incur return shipping charges</li>
              <li>Return shipping charges (if applicable) will be deducted from your refund amount</li>
              <li>We recommend using a trackable shipping method for returns</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Refund Process</h3>
            <p class="mb-4">Once we receive and inspect your returned product:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>We will verify the product condition and eligibility</li>
              <li>Refunds will be processed within <strong>5-7 business days</strong> after receiving the returned item</li>
              <li>Refund amount will be credited to your original payment method</li>
              <li>For Cash on Delivery (COD) orders, refunds will be processed via bank transfer or digital wallet</li>
            </ul>
            <p class="mb-4"><strong>Refund Timeline:</strong></p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Credit/Debit Cards: 5-7 business days</li>
              <li>Net Banking: 3-5 business days</li>
              <li>UPI/Wallets: 2-3 business days</li>
              <li>Cash on Delivery: 7-10 business days (via bank transfer)</li>
            </ul>
            <p class="mb-4"><em>Note: The refund timeline depends on your bank or payment gateway. We process refunds immediately upon approval.</em></p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Exchange Policy</h3>
            <p class="mb-4">We offer exchanges for:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Different sizes (subject to availability)</li>
              <li>Different colors (subject to availability)</li>
              <li>Wrong items delivered</li>
            </ul>
            <p class="mb-4">To request an exchange:</p>
            <ol class="list-decimal pl-6 space-y-2 mb-4">
              <li>Follow the same return process mentioned above</li>
              <li>Mention "Exchange" as the reason and specify the desired size/color</li>
              <li>If the requested item is available, we will ship it once we receive your return</li>
              <li>If the requested item is not available, we will process a refund</li>
            </ol>
            <p class="mb-4"><em>Note: Exchanges are subject to product availability. If the requested variant is out of stock, we will process a refund instead.</em></p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Partial Refunds</h3>
            <p class="mb-4">Partial refunds may apply in the following cases:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>If the returned product shows signs of use or damage</li>
              <li>If original packaging or accessories are missing</li>
              <li>If return shipping charges are applicable</li>
              <li>The refund amount will be calculated after deducting applicable charges</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Cancellation Policy</h3>
            <p class="mb-4">You can cancel your order:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Before Shipment:</strong> Full refund will be processed within 24-48 hours</li>
              <li><strong>After Shipment:</strong> You can still cancel, but return shipping charges may apply</li>
              <li>To cancel, contact us at <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a> or call <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Contact for Returns & Refunds</h3>
            <p class="mb-2">For any queries regarding returns or refunds, please contact us:</p>
            <p class="mb-2"><strong>Email:</strong> <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
            <p class="mb-2"><strong>Phone:</strong> <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
            <p class="mb-4"><strong>Business Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST</p>
            <p class="mb-4">Please include your order number in all communications for faster resolution.</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2"><strong>Note:</strong> This refund policy is subject to change without prior notice. Please check this page periodically for updates. By making a purchase on our website, you agree to the terms of this refund policy.</p>
          </div>
        </div>
      `,
    },
    terms: {
      title: 'Terms & Conditions',
      content: `
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Terms and Conditions</h2>
            <p class="mb-4">Welcome to Truaxis. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms. Please read them carefully before using our services.</p>
            <p class="mb-4"><strong>Last Updated:</strong> January 2025</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
            <p class="mb-4">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">2. Company Information</h3>
            <p class="mb-2">This website is operated by:</p>
            <p class="mb-2"><strong>Truaxis</strong></p>
            <p class="mb-2"><strong>Email:</strong> <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
            <p class="mb-4"><strong>Phone:</strong> <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">3. Use of Website</h3>
            <p class="mb-4">You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Transmitting obscene or offensive content</li>
              <li>Disrupting the normal flow of dialogue within our website</li>
              <li>Attempting to gain unauthorized access to our website, accounts, or computer systems</li>
              <li>Using automated systems or software to extract data from our website</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">4. Account Registration</h3>
            <p class="mb-4">To make purchases on our website, you may need to create an account. You agree to:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and identification</li>
              <li>Accept all responsibility for activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">5. Product Information</h3>
            <p class="mb-4">We strive to provide accurate product descriptions, images, and pricing information. However:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>We do not warrant that product descriptions, images, or other content is accurate, complete, reliable, current, or error-free</li>
              <li>Product images are for illustrative purposes only and may not reflect the exact appearance of the product</li>
              <li>We reserve the right to correct any errors, inaccuracies, or omissions at any time</li>
              <li>We reserve the right to refuse or cancel any order if the product information is inaccurate</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">6. Pricing and Payment</h3>
            <p class="mb-4">All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Prices are subject to change without prior notice</li>
              <li>We reserve the right to modify prices at any time</li>
              <li>In case of pricing errors, we reserve the right to cancel orders</li>
              <li>Payment can be made through credit/debit cards, net banking, UPI, wallets, or Cash on Delivery (COD)</li>
              <li>All payments are processed through secure payment gateways</li>
              <li>COD is available for orders above a certain value (subject to location)</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">7. Orders and Acceptance</h3>
            <p class="mb-4">When you place an order:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>You are making an offer to purchase products at the prices stated</li>
              <li>We reserve the right to accept or reject your order</li>
              <li>Order confirmation does not constitute acceptance of your order</li>
              <li>We will send you an email confirmation once your order is accepted</li>
              <li>If we cannot fulfill your order, we will notify you and process a full refund</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">8. Shipping and Delivery</h3>
            <p class="mb-4">Please refer to our <a href="/shipping" class="text-primary-600 hover:underline">Shipping Information</a> page for detailed shipping policies. Key points:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Delivery timelines are estimates and may vary</li>
              <li>We are not responsible for delays caused by courier services or circumstances beyond our control</li>
              <li>Risk of loss and title pass to you upon delivery to the carrier</li>
              <li>You are responsible for providing accurate delivery addresses</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">9. Returns and Refunds</h3>
            <p class="mb-4">Please refer to our <a href="/refund-policy" class="text-primary-600 hover:underline">Refund Policy</a> for detailed information about returns and refunds.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">10. Intellectual Property</h3>
            <p class="mb-4">All content on this website, including text, graphics, logos, images, and software, is the property of Truaxis or its content suppliers and is protected by Indian and international copyright laws.</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>You may not reproduce, distribute, or transmit any content without our written permission</li>
              <li>You may not use our trademarks or logos without our consent</li>
              <li>Unauthorized use may result in legal action</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">11. Limitation of Liability</h3>
            <p class="mb-4">To the maximum extent permitted by law:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>We shall not be liable for any indirect, incidental, special, or consequential damages</li>
              <li>Our total liability shall not exceed the amount paid by you for the products</li>
              <li>We are not responsible for any loss or damage arising from your use of our website</li>
              <li>We do not guarantee uninterrupted or error-free operation of the website</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">12. Indemnification</h3>
            <p class="mb-4">You agree to indemnify and hold harmless Truaxis, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Your use of the website</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">13. Privacy</h3>
            <p class="mb-4">Your use of our website is also governed by our <a href="/privacy" class="text-primary-600 hover:underline">Privacy Policy</a>. Please review our Privacy Policy to understand our practices.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">14. Modifications to Terms</h3>
            <p class="mb-4">We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after changes are posted constitutes your acceptance of the modified Terms.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">15. Governing Law and Jurisdiction</h3>
            <p class="mb-4">These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in India.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">16. Severability</h3>
            <p class="mb-4">If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">17. Contact Information</h3>
            <p class="mb-2">If you have any questions about these Terms, please contact us:</p>
            <p class="mb-2"><strong>Email:</strong> <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
            <p class="mb-4"><strong>Phone:</strong> <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2"><strong>By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</strong></p>
            <p>If you do not agree to these Terms, please do not use our website or services.</p>
          </div>
        </div>
      `,
    },
    privacy: {
      title: 'Privacy Policy',
      content: `
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Privacy Policy</h2>
            <p class="mb-4">At Truaxis ("we," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
            <p class="mb-4"><strong>Last Updated:</strong> January 2025</p>
            <p class="mb-4">By using our website, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our website.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">1. Information We Collect</h3>
            <p class="mb-4">We collect information that you provide directly to us and information that is automatically collected when you use our website.</p>
            
            <h4 class="text-lg font-semibold mb-2 mt-4">1.1 Information You Provide</h4>
            <p class="mb-4">We collect information that you provide when you:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Create an Account:</strong> Name, email address, phone number, password</li>
              <li><strong>Make a Purchase:</strong> Billing address, shipping address, payment information, order details</li>
              <li><strong>Contact Us:</strong> Name, email address, phone number, message content</li>
              <li><strong>Subscribe to Newsletter:</strong> Email address</li>
              <li><strong>Participate in Surveys or Promotions:</strong> Information you choose to provide</li>
            </ul>

            <h4 class="text-lg font-semibold mb-2 mt-4">1.2 Automatically Collected Information</h4>
            <p class="mb-4">When you visit our website, we automatically collect certain information:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Information:</strong> Pages visited, time spent on pages, click patterns, search queries</li>
              <li><strong>Location Information:</strong> General location based on IP address</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
            <p class="mb-4">We use the information we collect for various purposes:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Order Processing:</strong> To process and fulfill your orders, send order confirmations, and provide customer support</li>
              <li><strong>Account Management:</strong> To create and manage your account, authenticate your identity</li>
              <li><strong>Communication:</strong> To send you updates about your orders, respond to your inquiries, and send marketing communications (with your consent)</li>
              <li><strong>Improvement of Services:</strong> To analyze website usage, improve our products and services, and enhance user experience</li>
              <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and other harmful activities</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms and conditions</li>
              <li><strong>Personalization:</strong> To personalize your shopping experience and show you relevant products</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">3. Information Sharing and Disclosure</h3>
            <p class="mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <h4 class="text-lg font-semibold mb-2 mt-4">3.1 Service Providers</h4>
            <p class="mb-4">We may share information with third-party service providers who perform services on our behalf:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Payment processors for transaction processing</li>
              <li>Shipping and logistics companies for order delivery</li>
              <li>Email service providers for sending communications</li>
              <li>Analytics providers for website analysis</li>
              <li>Customer support service providers</li>
            </ul>
            <p class="mb-4">These service providers are contractually obligated to protect your information and use it only for the purposes we specify.</p>

            <h4 class="text-lg font-semibold mb-2 mt-4">3.2 Legal Requirements</h4>
            <p class="mb-4">We may disclose your information if required by law or in response to valid requests by public authorities.</p>

            <h4 class="text-lg font-semibold mb-2 mt-4">3.3 Business Transfers</h4>
            <p class="mb-4">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>

            <h4 class="text-lg font-semibold mb-2 mt-4">3.4 With Your Consent</h4>
            <p class="mb-4">We may share your information with third parties when you explicitly consent to such sharing.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">4. Cookies and Tracking Technologies</h3>
            <p class="mb-4">We use cookies and similar tracking technologies to:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve website functionality and user experience</li>
            </ul>
            <p class="mb-4">You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">5. Data Security</h3>
            <p class="mb-4">We implement appropriate technical and organizational security measures to protect your personal information:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments and updates</li>
              <li>Employee training on data protection</li>
            </ul>
            <p class="mb-4">However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">6. Data Retention</h3>
            <p class="mb-4">We retain your personal information for as long as necessary to:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Fulfill the purposes for which it was collected</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain business records as required by law</li>
            </ul>
            <p class="mb-4">When we no longer need your information, we will securely delete or anonymize it.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">7. Your Rights and Choices</h3>
            <p class="mb-4">You have certain rights regarding your personal information:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Access:</strong> You can request access to your personal information</li>
              <li><strong>Correction:</strong> You can update or correct your information through your account settings</li>
              <li><strong>Deletion:</strong> You can request deletion of your account and personal information</li>
              <li><strong>Opt-Out:</strong> You can opt-out of marketing communications by clicking unsubscribe links or contacting us</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> You can withdraw consent for data processing where applicable</li>
            </ul>
            <p class="mb-4">To exercise these rights, please contact us at <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">8. Children's Privacy</h3>
            <p class="mb-4">Our website is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete such information.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">9. Third-Party Links</h3>
            <p class="mb-4">Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">10. Changes to This Privacy Policy</h3>
            <p class="mb-4">We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
            <ul class="list-disc pl-6 space-y-2 mb-4">
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification (if you have provided your email)</li>
              <li>Updating the "Last Updated" date</li>
            </ul>
            <p class="mb-4">Your continued use of our website after changes are posted constitutes acceptance of the updated policy.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">11. International Data Transfers</h3>
            <p class="mb-4">Your information may be transferred to and processed in countries other than India. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">12. Contact Us</h3>
            <p class="mb-2">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <p class="mb-2"><strong>Truaxis</strong></p>
            <p class="mb-2"><strong>Email:</strong> <a href="mailto:support@truaxisventures.com" class="text-primary-600 hover:underline">support@truaxisventures.com</a></p>
            <p class="mb-4"><strong>Phone:</strong> <a href="tel:+919354792822" class="text-primary-600 hover:underline">+91 9354792822</a></p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2"><strong>By using our website, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.</strong></p>
            <p>If you do not agree with this Privacy Policy, please do not use our website or services.</p>
          </div>
        </div>
      `,
    },
  };

  const page = content[slug] || {
    title: 'Page Not Found',
    content: '<p>The page you are looking for does not exist.</p>',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: page.title }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{page.title}</h1>
        <div
          className="prose max-w-none bg-white rounded-lg shadow-md p-8"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export default StaticPage;
