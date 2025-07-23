const RDView = () => {
  return (
    <div>
      <table className="min-w-full table-auto border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Phase</th>
            <th className="p-2 border">Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-800 text-white">
            <td className="p-2 border">AI Assistant</td>
            <td className="p-2 border">Prototype</td>
            <td className="p-2 border">₹3,00,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RDView;
