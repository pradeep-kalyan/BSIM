const ProductionView = () => {
  return (
    <div>
      <table className="min-w-full table-auto border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2 border">Line</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Output Target</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-800 text-white">
            <td className="p-2 border">Line A</td>
            <td className="p-2 border">Running</td>
            <td className="p-2 border">10,000 units</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductionView;
