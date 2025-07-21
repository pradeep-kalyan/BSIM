interface Props {
  department: string;
}

const ViewDecisions = ({ department }: Props) => {
  return (
    <div className="border p-4">
      <h3>View Decisions for {department}</h3>
      {/* Your table/list here */}
    </div>
  );
};

export default ViewDecisions;
