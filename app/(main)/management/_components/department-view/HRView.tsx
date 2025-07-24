const HRView = () => {
  return (
    <div>
      <table className="min-w-full table-auto border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2 border">Policy</th>
            <th className="p-2 border">Action</th>
            <th className="p-2 border">Period</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-800 text-white">
            <td className="p-2 border">Leave Policy</td>
            <td className="p-2 border">Updated</td>
            <td className="p-2 border">Q1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HRView;
