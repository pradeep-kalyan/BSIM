const FinanceView = () => {
  return (
    <div>
      <table className="min-w-full table-auto border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2 border">Decision</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Period</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-800 text-white">
            <td className="p-2 border">Budget Allocation</td>
            <td className="p-2 border">₹10,00,000</td>
            <td className="p-2 border">Q1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinanceView;
