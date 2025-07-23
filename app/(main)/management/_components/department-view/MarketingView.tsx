const MarketingView = () => {
  return (
    <div>
      <table className="min-w-full table-auto border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2 border">Campaign</th>
            <th className="p-2 border">Budget</th>
            <th className="p-2 border">Platform</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-800 text-white">
            <td className="p-2 border">Summer Sale</td>
            <td className="p-2 border">₹5,00,000</td>
            <td className="p-2 border">Instagram</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MarketingView;
