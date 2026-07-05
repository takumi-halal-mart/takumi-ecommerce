import Link from 'next/link';

export const metadata = {
  title: '特定商取引法に基づく表記 - Specified Commercial Transactions Act',
  description: 'Legal information and Specified Commercial Transactions Act details for Takumi Halal Mart.',
};

export default function TokushohoPage() {
  const legalData = [
    {
      label: 'Seller / Legal Entity (販売業者)',
      value: 'KABIR MOTORS COMPANY LIMITED (Branch: Takumi Halal Mart)'
    },
    {
      label: 'Representative (代表責任者)',
      value: 'AHEMADU LEBBE MOHAMED KABIR'
    },
    {
      label: 'Address (所在地)',
      value: '〒289-1211 Chiba-ken, Sammu-shi, Ogi 689-39-2, Japan'
    },
    {
      label: 'Phone Number (電話番号)',
      value: '+81 43 312 1629'
    },
    {
      label: 'Email Address (メールアドレス)',
      value: 'takumihalalmart@gmail.com'
    },
    {
      label: 'Selling Price (販売価格)',
      value: 'Displayed on each product page. All prices include Japanese Consumption Tax.'
    },
    {
      label: 'Payment Methods (支払方法)',
      value: 'Credit Card (Stripe), Cash on Delivery.'
    },
    {
      label: 'Additional Fees (商品代金以外の必要料金)',
      value: 'Shipping and delivery charges (calculated at checkout based on location and weight).'
    },
    {
      label: 'Sales Quantity (販売数量)',
      value: 'Products can be purchased starting from 1 item unless otherwise stated on the product page.'
    },
    {
      label: 'Shipping Time (引渡し時期)',
      value: 'Orders are typically processed and shipped within 2–5 business days after payment confirmation.'
    },
    {
      label: 'Returns / Exchanges (返品・交換について)',
      value: 'If you receive a damaged, defective, or incorrect product, please contact us within 7 days of delivery for a replacement or refund. Due to the perishable nature of food products, we cannot accept returns or exchanges for customer convenience.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            特定商取引法に基づく表記
          </h1>
          <h2 className="text-lg md:text-xl text-gray-500 font-medium">
            Legal Information (Specified Commercial Transactions Act)
          </h2>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden mb-10">
          <dl className="divide-y divide-gray-200 text-sm md:text-base">
            {legalData.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row">
                <dt className="w-full sm:w-1/3 bg-gray-50 px-6 py-4 font-semibold text-gray-900 sm:border-r border-gray-200">
                  {item.label}
                </dt>
                <dd className="w-full sm:w-2/3 px-6 py-4 text-gray-700 bg-white">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
